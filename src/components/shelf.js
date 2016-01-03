import React from 'react';
import {includes} from 'lodash';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import Book from './book';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const bookTarget = {
  drop() {
  }
};


const Shelf = ({books, connectDropTarget, selected, marked, dispatch}) => {
  const style = selected ? {
    display: 'inline-block', 
    width: 'calc(100% - 300px)', 
    verticalAlign: 'top'
  } : {};
  return connectDropTarget(
    <div style={style}>
      <FloatingActionButton style={{position: 'fixed', bottom: 30, right: selected ? 350 : 50}}>
        <i className="fa fa-plus"></i>
      </FloatingActionButton>
      {books.map(book => <Book key={book.isbn}
                               isbn={book.isbn}
                               fetch={book.fetch}
                               book={book}
                               isSelected={selected == book.isbn}
                               isMarked={includes(marked, book.isbn)}
                               dispatch={dispatch}/>)}
    </div>
  );
};

export default DragDropContext(HTML5Backend)(DropTarget('card', bookTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Shelf));