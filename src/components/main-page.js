import fs from 'fs';

import _ from 'lodash';
import React from 'react';
import update from 'react/lib/update';

import DarkTheme from 'material-ui/lib/styles/raw-themes/dark-raw-theme';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

import queue from '../queue-events';
import Shelf from './shelf';

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

export default React.createClass(Object.assign({
  getInitialState() {
    return {
      books: [],
      newIsbn: '', 
      saving: false
    };
  },
  componentDidMount() {
    queue.on('change', () => this.setState({saving: true}));
    queue.on('saved', () => this.setState({saving: false}));
    fs.readFile('./queue.json', {encoding: 'utf8'}, (err, data) => this.setState({books: JSON.parse(data)}));
  },
  updateBooks(updater) {
    this.setState(update(this.state, {
      books: updater
    }));
    queue.emit('change', this.state.books);
  },
  onBookData(isbn, data) {
    let index = _.findIndex(this.state.books, 'isbn', isbn);
    let {books} = this.state;
    books[index] = Object.assign({isbn, fetch: false}, data);
    this.setState({books});
    queue.emit('change', this.state.books);
  },
  onAddBook() {
    let isbn = this.state.newIsbn;
    this.refs.isbn.setValue('');
    this.setState({
      newIsbn: '',
      books: this.state.books.concat([{isbn, fetch: true}])
    });
    queue.emit('change', this.state.books);
  },
  onDelete(isbn) {
    let index = _.findIndex(this.state.books, 'isbn', isbn);
    let {books} = this.state;
    books.splice(index, 1);
    this.setState({books});
    queue.emit('change', this.state.books);
  },
  _canAddNewISBN() {
    let isbn = this.state.newIsbn;
    return isbn.length === 10 || isbn.length === 13;
  },
  render() {    
    return (
      <div>
        <TextField hintText="ISBN # (10 or 13 digits)" 
                   floatingLabelText="Add new book" 
                   ref="isbn" onChange={() => this.setState({newIsbn: this.refs.isbn.getValue()})}/>
        <RaisedButton style={{margin: '0px 15px'}} label="Add" labelColor="white" secondary={true} 
                      disabled={!this._canAddNewISBN()} 
                      onClick={this.onAddBook} />
        <Shelf books={this.state.books} onBooksUpdate={this.updateBooks} onBookData={this.onBookData} onDelete={this.onDelete} />
        { this.state.saving ? <p>Saving...</p> : null }
      </div>
    );
  }
}, darkThemeMixin));
