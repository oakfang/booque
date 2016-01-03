import actions from './actions';

const act = (type, payload=null) => ({type, payload});

export const toggleCurrentlySaving = isSaving => 
    act(actions.TOGGLE_CURRENTLY_SAVING, isSaving);

export const changeIsbn = newIsbn =>
    act(actions.CHANGE_ISBN, newIsbn);

export const addBook = isbn =>
    act(actions.ADD_BOOK, isbn);

export const updateBookData = (isbn, data) =>
    act(actions.BOOK_DATA_FETCHED, {isbn, data});

export const loadBooks = books =>
    act(actions.LOAD_BOOKS, books);

export const deleteBook = isbn =>
    act(actions.DELETE_BOOK, isbn);

export const moveBook = (isbn, overIsbn) =>
    act(actions.MOVE_BOOK, {isbn, overIsbn});

export const selectBook = isbn =>
    act(actions.SELECT_BOOK, isbn);

export const markBook = isbn =>
    act(actions.MARK_BOOK, isbn);