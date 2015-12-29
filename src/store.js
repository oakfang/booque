import fs from 'fs';
import {debounce} from 'lodash';
import { createStore, applyMiddleware } from 'redux';
import app from './reducers';
import actions from './actions';
import {toggleCurrentlySaving} from './callers';

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

const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);
  let result = next(action);
  console.groupEnd(action.type);
  return result;
};

export default applyMiddleware(logger, persistChanges)(createStore)(app);