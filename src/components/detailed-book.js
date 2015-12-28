import React from 'react';
import getBook from '../booque';

import { DragSource, DropTarget } from 'react-dnd';

import Card from 'material-ui/lib/card/card';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';

function formatAuthors(authors) {
    if (authors.length) return authors[0];
    return `${authors.slice(0, -1).join(', ')} and ${authors.slice(-1)[0]}`;
}

const bookSource = {
  beginDrag(props) {
    return {
      isbn: props.isbn,
      originalIndex: props.findBook(props.isbn).index
    };
  },

  endDrag(props, monitor) {
    const { isbn: droppedId, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      props.moveBook(droppedId, originalIndex);
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
      const { index: overIndex } = props.findBook(overId);
      props.moveBook(draggedId, overIndex);
    }
  }
};

export default DropTarget('card', bookTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(DragSource('card', bookSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(React.createClass({
    getInitialState() {
        return {
            loading: false,
            marked: false
        }
    },
    componentDidMount() {
        if (this.props.isbn && this.props.fetch) {
            this.setState({loading: true});
            getBook(this.props.isbn)
            .then(book => {
                this.setState({
                    loading: false,
                    thumbnail: book.imageLinks.smallThumbnail
                });
                return book;
            })
            .then(book => this.props.onBookData(this.props.isbn, book))
            .catch(() => this.props.onDelete(this.props.isbn));
        } else {
          this.setState({
            thumbnail: this.props.thumbnail
          });
        }
    },
    markForDelete() {
      this.setState({marked: true});
    },
    render() {
        if (this.state.loading) return <Card style={{width: 50, display: 'inline-block', margin: '5px 5px'}}><CardTitle title="..." /></Card>;
        else {
            const { isDragging, connectDragSource, connectDropTarget, isSelected } = this.props;
            const opacity = isDragging ? 0 : 1;
            const filter = isSelected ? 'grayscale(100%)' : 'none';
            const view = (
              <div style={{width: 50, display: 'inline-block', margin: '5px 5px', opacity: opacity, cursor: 'pointer', WebkitFilter: filter}} 
                   onClick={() => this.props.onSelect(this.props.isbn)}>
                  <Card>
                    <CardMedia>
                        <img src={this.state.thumbnail} />
                    </CardMedia>
                  </Card>
              </div>
            );
            return connectDragSource(connectDropTarget(view));
        }
    }
})));