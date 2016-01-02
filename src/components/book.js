import React from 'react';

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

const innerCard = ({book, isDetailed, onSelect, isbn, isMarked, onMark, onDelete}) => {
  if (isDetailed) {
        return (<Card onClick={() => onSelect(isbn)}>
                  <CardMedia>
                      <img src={book.imageLinks.smallThumbnail} />
                  </CardMedia>
                </Card>);
    } else if (isMarked) {
        return (<Card onClick={() => onMark(isbn)} style={{background: 'rgba(219, 68, 55, 0.5)'}}>
                   <CardTitle title={book.title} subtitle={formatAuthors(book.authors)} />
                   <FlatButton label="Delete?" onClick={() => onDelete(isbn)} />
                </Card>);
    } else {
        return (<Card onDoubleClick={() => onMark(isbn)}>
                  <CardMedia overlay={<CardTitle title={book.title} subtitle={formatAuthors(book.authors)} />}>
                      <img src={book.imageLinks.thumbnail} />
                  </CardMedia>
                </Card>);
    }
};

const Book = ({book, isDetailed, onSelect, isbn, isMarked, onMark, onDelete, fetch, 
               isSelected, isDragging, connectDragSource, connectDropTarget}) => {
  const bookStyle = Object.assign({display: 'inline-block'},
                                     isDetailed ?
                                        {width: 50, margin: '5px 5px'}:
                                        {width: 200, margin: '5px 10px'}
                                    );
  if (fetch) return <Card style={bookStyle}><CardTitle title="Loading..." /></Card>;
  const opacity = isDragging ? 0 : 1;
  const cursor = isDetailed ? 'pointer':'auto';
  const WebkitFilter = isSelected && isDetailed ? 'grayscale(100%)' : 'none';
  return connectDragSource(connectDropTarget(
      <div style={Object.assign({opacity, WebkitFilter, cursor}, bookStyle)}>
          {innerCard({book, isDetailed, onSelect, isbn, isMarked, onMark, onDelete})}
      </div>
  ));
}

export default DropTarget('card', bookTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(DragSource('card', bookSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(Book));