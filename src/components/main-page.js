import fs from 'fs';

import _ from 'lodash';
import React from 'react';
import update from 'react/lib/update';

import DarkTheme from 'material-ui/lib/styles/raw-themes/dark-raw-theme';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import LinearProgress from 'material-ui/lib/linear-progress';
import Toggle from 'material-ui/lib/toggle';

import Shelf from './shelf';
import BookDetails from './book-details';

import {mainPageSelector} from '../selectors';
import { connect } from 'react-redux';
import {
  addBook,
  deleteBook,
  loadBooks,
  selectBook,
  changeIsbn,
  toggleDetailedView,
  moveBook,
  markBook
} from '../callers';

const darkThemeMixin = {
  childContextTypes : {
    muiTheme: React.PropTypes.object,
  },
  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(DarkTheme),
    };
  }
};

export default connect(mainPageSelector)(React.createClass(Object.assign({
  componentDidMount() {
    const {dispatch} = this.props;
    fs.readFile('./queue.json', 
                {encoding: 'utf8'}, 
                (err, data) => dispatch(loadBooks(JSON.parse(data))));
  },
  onAddBook() {
    if (!this._canAddNewISBN()) return;
    const {newIsbn: isbn, dispatch} = this.props;
    this.refs.isbn.setValue('');
    dispatch(addBook(isbn));
  },
  onDelete(isbn) {
    this.props.dispatch(deleteBook(isbn));
  },
  onSelect(isbn) {
    this.props.dispatch(selectBook(isbn));
  },
  onMove(isbn, toIndex) {
    this.props.dispatch(moveBook(isbn, toIndex));
  },
  onMark(isbn) {
    this.props.dispatch(markBook(isbn));
  },
  _canAddNewISBN() {
    let isbn = this.props.newIsbn;
    return isbn.length === 10 || isbn.length === 13;
  },
  render() {
    return (
      <div>
        <TextField hintText="ISBN # (10 or 13 digits)" 
                   floatingLabelText="Add new book"
                   ref="isbn" 
                   onChange={() => this.props.dispatch(changeIsbn(this.refs.isbn.getValue()))}
                   onEnterKeyDown={this.onAddBook}/>
        <RaisedButton style={{margin: '0px 15px'}} label="Add" labelColor="white" secondary={true} 
                      disabled={!this._canAddNewISBN()} 
                      onClick={this.onAddBook} />
        <div style={{position: 'absolute', top: 20, right: 50}}>
          <Toggle label="Detailed View" ref="detailedView" onToggle={() => this.props.dispatch(toggleDetailedView())}/>
        </div>
        { this.props.saving ? <LinearProgress mode="indeterminate" /> : null }
        <div>
          <Shelf books={this.props.books} 
                 selected={this.props.selected}
                 isDetailed={this.props.detailed}
                 onSelect={this.onSelect}
                 onMove={this.onMove}
                 onDelete={this.onDelete}
                 marked={this.props.marked}
                 onMark={this.onMark} />
          {this.props.selected && this.props.detailed ? 
            <BookDetails book={this.props.books[_.findIndex(this.props.books, 'isbn', this.props.selected)]} 
                         isbn={this.props.selected} 
                         onDelete={this.onDelete} />
           : null}
        </div>    
      </div>
    );
  }
}, darkThemeMixin)));
