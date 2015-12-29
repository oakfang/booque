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
    render() {
        const { connectDropTarget, books } = this.props;
        return connectDropTarget(
          <div style={{display: 'inline-block', width: 'calc(100% - 300px)', verticalAlign: 'top'}}>
            {books.map(book => book.fetch ? 
              (<Book key={book.isbn} 
                     isbn={book.isbn} 
                     fetch={book.fetch} 
                     isSelected={this.props.selected == book.isbn}
                     moveBook={this.props.onMove}
                     onSelect={this.props.onSelect}
                     onBookData={this.props.onData} />) :
              (<Book key={book.isbn} 
                     isbn={book.isbn} 
                     fetch={book.fetch}
                     isSelected={this.props.selected == book.isbn}
                     thumbnail={book.imageLinks.smallThumbnail}
                     moveBook={this.props.onMove}
                     onSelect={this.props.onSelect}
                     onBookData={this.props.onData} />)
              )}
          </div>
        );
    }
})));