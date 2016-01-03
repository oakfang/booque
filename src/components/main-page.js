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
import Toolbar from './toolbar';

import {mainPageSelector} from '../selectors';
import { connect } from 'react-redux';
import {
  addBook,
  loadBooks,
  changeIsbn,
  toggleDetailedView
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
  render() {
    return (
      <div>
        <Toolbar saving={this.props.saving} dispatch={this.props.dispatch} isbn={this.props.newIsbn} />
        <div>
          <Shelf books={this.props.books}
                 dispatch={this.props.dispatch}
                 selected={this.props.selected}
                 isDetailed={this.props.detailed}
                 marked={this.props.marked}/>
          {this.props.selected && this.props.detailed ? 
            <BookDetails book={this.props.books[_.findIndex(this.props.books, 'isbn', this.props.selected)]} 
                         isbn={this.props.selected} 
                         dispatch={this.props.dispatch}/>
           : null}
        </div>    
      </div>
    );
  }
}, darkThemeMixin)));
