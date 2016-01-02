import fs from 'fs';
import {debounce} from 'lodash';
import { createStore, applyMiddleware } from 'redux';
import app from './reducers';
import actions from './actions';
import getBook from './booque';
import {toggleCurrentlySaving, updateBookData, deleteBook} from './callers';

const saveBooks = debounce(store => {
    let books = store.getState().books;
    store.dispatch(toggleCurrentlySaving(true));
    fs.writeFile('./queue.json', 
                 JSON.stringify(books), 
                 err => err ? null : store.dispatch(toggleCurrentlySaving(false)));
}, 1000);

const persistChanges = store => next => action => {
    let result = next(action);
    switch(action.type) {
        case actions.DELETE_BOOK:
        case actions.ADD_BOOK:
        case actions.MOVE_BOOK:
        case actions.BOOK_DATA_FETCHED:
            saveBooks(store);
        default:
            return result;
    }
};

const fetchBooksData = store => next => action => {
    let result = next(action);
    switch(action.type) {
        case actions.ADD_BOOK:
            let isbn = action.payload;
            getBook(isbn)
            .then(book => store.dispatch(updateBookData(isbn, book)))
            .catch(() => store.dispatch(deleteBook(isbn)));
        default:
            return result;
    }
};

const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.groupEnd(action.type);
  return result;
};

export default applyMiddleware(logger, persistChanges, fetchBooksData)(createStore)(app);