import React from 'react';
import {includes} from 'lodash';
import Book from './book';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const bookTarget = {
  drop() {
  }
};


const Shelf = ({books, connectDropTarget, selected, isDetailed, marked, onMark, onDelete, onMove, onSelect}) => {
  const style = isDetailed ? {
    display: 'inline-block', 
    width: 'calc(100% - 300px)', 
    verticalAlign: 'top'
  } : {};
  return connectDropTarget(
    <div style={style}>
      {books.map(book => <Book key={book.isbn}
                               isbn={book.isbn}
                               fetch={book.fetch}
                               book={book}
                               isSelected={selected == book.isbn}
                               isDetailed={isDetailed}
                               isMarked={includes(marked, book.isbn)}
                               onMark={onMark}
                               onDelete={onDelete}
                               moveBook={onMove}
                               onSelect={onSelect}/>)}
    </div>
  );
};

export default DragDropContext(HTML5Backend)(DropTarget('card', bookTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Shelf));