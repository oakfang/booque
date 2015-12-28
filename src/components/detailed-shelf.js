import React from 'react';
import Book from './detailed-book';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const bookTarget = {
  drop() {
  }
};

export default DragDropContext(HTML5Backend)(DropTarget('card', bookTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(React.createClass({
    moveBook(id, atIndex) {
        const { book, index } = this.findBook(id);
        this.props.onBooksUpdate({
            $splice: [
                [index, 1],
                [atIndex, 0, book]
            ]
        });
    },
    findBook(id) {
        const { books } = this.props;
        const book = books.filter(c => c.isbn === id)[0];

        return {
          book,
          index: books.indexOf(book)
        };
    },
    render() {
        const { connectDropTarget } = this.props;
        const { books } = this.props;

        return connectDropTarget(
          <div style={{display: 'inline-block', width: 'calc(100% - 300px)', verticalAlign: 'top'}}>
            {books.map(book => book.fetch ? 
              (<Book key={book.isbn} 
                     isbn={book.isbn} 
                     fetch={book.fetch} 
                     moveBook={this.moveBook} 
                     findBook={this.findBook} 
                     onSelect={this.props.onSelect}
                     onDelete={this.props.onDelete}
                     onBookData={this.props.onBookData} />) :
              (<Book key={book.isbn} 
                     isbn={book.isbn} 
                     fetch={book.fetch}
                     thumbnail={book.imageLinks.smallThumbnail}
                     moveBook={this.moveBook} 
                     findBook={this.findBook} 
                     onDelete={this.props.onDelete}
                     onSelect={this.props.onSelect}
                     onBookData={this.props.onBookData} />)
              )}
          </div>
        );
    }
})));