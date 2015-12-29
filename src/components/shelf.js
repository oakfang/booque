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
    render() {
        const { connectDropTarget, books } = this.props;

        return connectDropTarget(
          <div>
            {books.map(book => book.fetch ? 
              (<Book key={book.isbn} 
                     isbn={book.isbn} 
                     fetch={book.fetch} 
                     moveBook={this.props.onMove} 
                     findBook={this.findBook} 
                     onDelete={this.props.onDelete}
                     isMarked={includes(this.props.marked, book.isbn)}
                     onMark={this.props.onMark}
                     onBookData={this.props.onData} />) :
              (<Book key={book.isbn} 
                     isbn={book.isbn} 
                     fetch={book.fetch} 
                     title={book.title}
                     authors={book.authors}
                     thumbnail={book.imageLinks.thumbnail}
                     moveBook={this.props.onMove}
                     isMarked={includes(this.props.marked, book.isbn)}
                     onMark={this.props.onMark}
                     onDelete={this.props.onDelete}
                     onBookData={this.props.onData} />)
              )}
          </div>
        );
    }
})));