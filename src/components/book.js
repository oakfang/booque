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
    getCard() {
      if (this.props.isDetailed) {
          return (<Card onClick={() => this.props.onSelect(this.props.isbn)}>
                    <CardMedia>
                        <img src={this.props.book.imageLinks.smallThumbnail} />
                    </CardMedia>
                  </Card>);
      } else if (this.props.isMarked) {
          return (<Card onClick={() => this.props.onMark(this.props.isbn)} style={{background: 'rgba(219, 68, 55, 0.5)'}}>
                     <CardTitle title={this.props.book.title} subtitle={formatAuthors(this.props.book.authors)} />
                     <FlatButton label="Delete?" onClick={() => this.props.onDelete(this.props.isbn)} />
                  </Card>);
      } else {
          return (<Card onDoubleClick={() => this.props.onMark(this.props.isbn)}>
                    <CardMedia overlay={<CardTitle title={this.props.book.title} subtitle={formatAuthors(this.props.book.authors)} />}>
                        <img src={this.props.book.imageLinks.thumbnail} />
                    </CardMedia>
                  </Card>);
      }
    },
    render() {
        const {isDetailed} = this.props;
        const bookStyle = Object.assign({display: 'inline-block'},
                                           isDetailed ?
                                              {width: 50, margin: '5px 5px'}:
                                              {width: 200, margin: '5px 10px'}
                                          );
        if (this.props.fetch) return <Card style={bookStyle}><CardTitle title="Loading..." /></Card>;
        else {
            const { isDragging, connectDragSource, connectDropTarget, isSelected } = this.props;
            const opacity = isDragging ? 0 : 1;
            const cursor = isDetailed ? 'pointer':'auto';
            const WebkitFilter = isSelected && isDetailed ? 'grayscale(100%)' : 'none';
            return connectDragSource(connectDropTarget(
                <div style={Object.assign({opacity, WebkitFilter, cursor}, bookStyle)}>
                    {this.getCard()}
                </div>
            ));
        }
    }
})));