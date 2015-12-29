import { createSelector } from 'reselect';

const booksSelector = state => state.books;
const selectedBookSelector = state => state.selected;
const newIsbnSelector = state => state.newIsbn;
const markedBooksSelector = state => state.markedBooks;
const viewStateSelector = state => ({
    saving: state.saving,
    detailed: state.detailed
});

export const mainPageSelector = createSelector(
    viewStateSelector,
    booksSelector,
    selectedBookSelector,
    newIsbnSelector,
    markedBooksSelector,
    ({saving, detailed}, books, selected, newIsbn, marked) => ({
        books,
        selected,
        newIsbn,
        saving,
        detailed,
        marked
    })
);