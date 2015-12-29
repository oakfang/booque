import _ from 'lodash';

export default [
    'TOGGLE_DETAILED_VIEW',
    'TOGGLE_CURRENTLY_SAVING',
    'CHANGE_ISBN',
    'ADD_BOOK',
    'BOOK_DATA_FETCHED',
    'LOAD_BOOKS',
    'DELETE_BOOK',
    'MOVE_BOOK',
    'SELECT_BOOK',
    'MARK_BOOK',
].reduce((actions, key) => _.set(actions, key, key), {});