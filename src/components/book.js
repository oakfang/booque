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
            .catch(err => console.error(err) || this.props.onDelete(this.props.isbn));
        }
    },
    render() {
        if (this.props.fetch) return <Card style={{width: 200, display: 'inline-block', margin: '5px 10px'}}><CardTitle title="Loading..." /></Card>;
        else {
            const { isDragging, connectDragSource, connectDropTarget } = this.props;
            const opacity = isDragging ? 0 : 1;
            return connectDragSource(connectDropTarget(
                <div style={{width: 200, display: 'inline-block', margin: '5px 10px', opacity: opacity}}>
                    {!this.props.isMarked ?
                      <Card onDoubleClick={() => this.props.onMark(this.props.isbn)}>
                        <CardMedia overlay={<CardTitle title={this.props.title} subtitle={formatAuthors(this.props.authors)} />}>
                            <img src={this.props.thumbnail} />
                        </CardMedia>
                      </Card>:
                      <Card onClick={() => this.props.onMark(this.props.isbn)} style={{background: 'rgba(219, 68, 55, 0.5)'}}>
                        <CardTitle title={this.props.title} subtitle={formatAuthors(this.props.authors)} />
                        <FlatButton label="Delete?" onClick={() => this.props.onDelete(this.props.isbn)} />
                      </Card>
                    }
                </div>
            ));
        }
    }
})));