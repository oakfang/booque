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
                    title: book.title,
                    authors: formatAuthors(book.authors),
                    thumbnail: book.imageLinks.thumbnail,
                    description: book.description
                });
                return book;
            })
            .then(book => this.props.onBookData(this.props.isbn, book))
            .catch(() => this.props.onDelete(this.props.isbn));
        } else {
          this.setState({
            title: this.props.title,
            authors: formatAuthors(this.props.authors),
            thumbnail: this.props.thumbnail,
            description: this.props.description
          });
        }
    },
    markForDelete() {
      this.setState({marked: true});
    },
    render() {
        if (this.state.loading) return <Card style={{width: 200, display: 'inline-block', margin: '5px 10px'}}><CardTitle title="Loading..." /></Card>;
        else {
            const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
            const opacity = isDragging ? 0 : 1;
            return connectDragSource(connectDropTarget(
                <div style={{width: 200, display: 'inline-block', margin: '5px 10px', opacity: opacity}} 
                     onDoubleClick={this.markForDelete} onClick={() => this.setState({marked: false})}>
                    {!this.state.marked ?
                      <Card>
                        <CardMedia overlay={<CardTitle title={this.state.title} subtitle={this.state.authors} />}>
                            <img src={this.state.thumbnail} />
                        </CardMedia>
                      </Card>:
                      <Card style={{background: 'rgba(219, 68, 55, 0.5)'}}>
                        <CardTitle title={this.state.title} subtitle={this.state.authors} />
                        <FlatButton label="Delete?" onClick={() => this.props.onDelete(this.props.isbn)} />
                      </Card>
                    }
                </div>
            ));
        }
    }
})));