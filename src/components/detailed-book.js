import React from 'react';
import getBook from '../booque';

import { DragSource, DropTarget } from 'react-dnd';

import Card from 'material-ui/lib/card/card';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';

function formatAuthors(authors) {
    if (authors.length) return authors[0];
    return `${authors.slice(0, -1).join(', ')} and ${authors.slice(-1)[0]}`;
}

const bookSource = {
  beginDrag(props) {
    return {
      isbn: props.isbn
    };
  },

  endDrag(props, monitor) {
    const { isbn: droppedId } = monitor.getItem();
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      props.moveBook(droppedId, droppedId);
    }
  }
};

const bookTarget = {
  canDrop() {
    return false;
  },

  hover(props, monitor) {
    const { isbn: draggedId } = monitor.getItem();
    const { isbn: overId } = props;

    if (draggedId !== overId) {
      props.moveBook(draggedId, overId);
    }
  }
};

export default DropTarget('card', bookTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(DragSource('card', bookSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(React.createClass({
    componentDidMount() {
        if (this.props.isbn && this.props.fetch) {
            getBook(this.props.isbn)
            .then(book => this.props.onBookData(this.props.isbn, book))
            .catch(() => this.props.onDelete(this.props.isbn));
        }
    },
    render() {
        if (this.props.fetch) return <Card style={{width: 50, display: 'inline-block', margin: '5px 5px'}}><CardTitle title="..." /></Card>;
        else {
            const { isDragging, connectDragSource, connectDropTarget, isSelected } = this.props;
            const opacity = isDragging ? 0 : 1;
            const filter = isSelected ? 'grayscale(100%)' : 'none';
            const view = (
              <div style={{width: 50, display: 'inline-block', margin: '5px 5px', opacity: opacity, cursor: 'pointer', WebkitFilter: filter}} 
                   onClick={() => this.props.onSelect(this.props.isbn)}>
                  <Card>
                    <CardMedia>
                        <img src={this.props.thumbnail} />
                    </CardMedia>
                  </Card>
              </div>
            );
            return connectDragSource(connectDropTarget(view));
        }
    }
})));