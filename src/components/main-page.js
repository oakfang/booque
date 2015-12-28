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

import queue from '../queue-events';
import Shelf from './shelf';
import DetailedShelf from './detailed-shelf';
import BookDetails from './book-details';

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
      saving: false,
      detailed: false,
      selected: null
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
    if (!this._canAddNewISBN()) return;
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
    this.setState({
      books,
      selected: (this.state.selected === isbn) ? null : this.state.selected
    });
    queue.emit('change', this.state.books);
  },
  onSelect(isbn) {
    let index = _.findIndex(this.state.books, 'isbn', isbn);
    this.setState({selected: isbn});
  },
  _canAddNewISBN() {
    let isbn = this.state.newIsbn;
    return isbn.length === 10 || isbn.length === 13;
  },
  render() {
    var shelfView;
    if (this.state.detailed) {
      shelfView = (
        <div>
          <DetailedShelf books={this.state.books} 
                         selected={this.state.selected}
                         onBooksUpdate={this.updateBooks} 
                         onBookData={this.onBookData} 
                         onSelect={this.onSelect} 
                         onDelete={this.onDelete} />
          {this.state.selected ? <BookDetails book={this.state.books[_.findIndex(this.state.books, 'isbn', this.state.selected)]} isbn={this.state.selected} onDelete={this.onDelete} /> : null}
        </div>
      );
    } else {
      shelfView = <Shelf books={this.state.books} onBooksUpdate={this.updateBooks} onBookData={this.onBookData} onDelete={this.onDelete} />;
    }
    return (
      <div>
        <TextField hintText="ISBN # (10 or 13 digits)" 
                   floatingLabelText="Add new book"
                   ref="isbn" 
                   onChange={() => this.setState({newIsbn: this.refs.isbn.getValue()})}
                   onEnterKeyDown={this.onAddBook}/>
        <RaisedButton style={{margin: '0px 15px'}} label="Add" labelColor="white" secondary={true} 
                      disabled={!this._canAddNewISBN()} 
                      onClick={this.onAddBook} />
        <div style={{position: 'absolute', top: 20, right: 50}}>
          <Toggle label="Detailed View" ref="detailedView" onToggle={() => this.setState({detailed: this.refs.detailedView.isToggled()})}/>
        </div>
        { this.state.saving ? <LinearProgress mode="indeterminate" /> : null }
        { shelfView}        
      </div>
    );
  }
}, darkThemeMixin));
