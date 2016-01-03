import React from 'react';
import Avatar from 'material-ui/lib/avatar';
import Card from 'material-ui/lib/card/card';
import CardMedia from 'material-ui/lib/card/card-media';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import FlatButton from 'material-ui/lib/flat-button';
import {deleteBook} from '../callers';

function formatAuthors(authors) {
    if (authors.length) return authors[0];
    return `${authors.slice(0, -1).join(', ')} and ${authors.slice(-1)[0]}`;
}

export default ({book, isbn, dispatch}) => {
    let rating = (book.averageRating && book.title.length <= 30) ? 
                    <Avatar style={{color:'white'}}>{book.averageRating}</Avatar> : null;
    let header = <CardHeader title={book.title} subtitle={formatAuthors(book.authors)} avatar={rating} />;
    return (
        <Card style={{width: '300px', display: 'inline-block'}}>
            <CardMedia overlay={header}>
                <img src={book.imageLinks.thumbnail} />
            </CardMedia>
            <CardText>{book.description}</CardText>
            <FlatButton label="Remove this book?" onClick={() => dispatch(deleteBook(isbn))} />
        </Card>
    );
};