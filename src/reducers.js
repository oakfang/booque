import { combineReducers } from 'redux';
import _ from 'lodash';

import actions from './actions';

function books(state = [], action) {
    switch (action.type) {
        case actions.LOAD_BOOKS: return action.payload;
        case actions.ADD_BOOK:
            return [...state, {isbn: action.payload, fetch: true}];
        case actions.BOOK_DATA_FETCHED:
            {
                let {data, isbn} = action.payload;
                let index = _.findIndex(state, 'isbn', isbn);
                return [...state.slice(0, index), 
                        Object.assign({isbn, fetch: false}, data), 
                        ...state.slice(index +1)];
            }
        case actions.DELETE_BOOK:
            {
                let index = _.findIndex(state, 'isbn', action.payload);
                return [...state.slice(0, index), ...state.slice(index +1)];
            }
        case actions.MOVE_BOOK:
            {
                let {overIsbn, isbn} = action.payload;
                let index = _.findIndex(state, 'isbn', isbn);            
                let toIndex = _.findIndex(state, 'isbn', overIsbn);
                let book = state[index];
                let excluded = [...state.slice(0, index), 
                                ...state.slice(index +1)];
                excluded.splice(toIndex, 0, book);
                return excluded;
            }
        default: return state;
    }
}

function selectedBook(state = null, action) {
    switch (action.type) {        
        case actions.DELETE_BOOK:
            return state === action.payload ? null : state;
        case actions.SELECT_BOOK:
            return action.payload;
        default: return state;
    }
}

function newIsbn(state = '', action) {
    switch (action.type) {
        case actions.CHANGE_ISBN:
            return action.payload;
        case actions.ADD_BOOK:
            return '';
        default: return state;
    }
}

function currentlySaving(state = false, action) {
    switch (action.type) {
        case actions.TOGGLE_CURRENTLY_SAVING:
            return action.payload;
        default: return state;
    }
}

function markedBooks(state = [], action) {
    switch (action.type) {
        case actions.DELETE_BOOK:
            return _.without(state, action.payload);
        case actions.MARK_BOOK:
            if (_.includes(state, action.payload)) {
                return _.without(state, action.payload);
            }
            return [...state, action.payload];
        default: return state;
    }
}

export default combineReducers({
    books,
    newIsbn,
    markedBooks,
    saving: currentlySaving,
    selected: selectedBook
});