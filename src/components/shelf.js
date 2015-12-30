import React from 'react';
import {includes} from 'lodash';
import Book from './book';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const bookTarget = {
  drop() {
  }
};

export default DragDropContext(HTML5Backend)(DropTarget('card', bookTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(React.createClass({
    getBook(book) {
      return <Book key={book.isbn}
                   isbn={book.isbn}
                   fetch={book.fetch}
                   book={book}
                   isSelected={this.props.selected == book.isbn}
                   isDetailed={this.props.isDetailed}
                   isMarked={includes(this.props.marked, book.isbn)}
                   onMark={this.props.onMark}
                   moveBook={this.props.onMove}
                   onSelect={this.props.onSelect}
                   onBookData={this.props.onData}/>
    },
    render() {
        const { connectDropTarget, books, isDetailed } = this.props;
        const style = isDetailed ? {
          display: 'inline-block', 
          width: 'calc(100% - 300px)', 
          verticalAlign: 'top'
        } : {};
        return connectDropTarget(
          <div style={style}>
            {books.map(this.getBook)}
          </div>
        );
    }
})));