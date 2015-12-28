import React from 'react';
import Avatar from 'material-ui/lib/avatar';
import Card from 'material-ui/lib/card/card';
import CardMedia from 'material-ui/lib/card/card-media';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import FlatButton from 'material-ui/lib/flat-button';

function formatAuthors(authors) {
    if (authors.length) return authors[0];
    return `${authors.slice(0, -1).join(', ')} and ${authors.slice(-1)[0]}`;
}

export default React.createClass({
    render() {
        let rating = (this.props.book.averageRating && this.props.book.title.length <= 30) ? 
                        <Avatar style={{color:'white'}}>{this.props.book.averageRating}</Avatar> : null;
        let header = <CardHeader title={this.props.book.title} subtitle={formatAuthors(this.props.book.authors)} avatar={rating} />;
        return (
            <Card style={{width: '300px', display: 'inline-block'}}>
                <CardMedia overlay={header}>
                    <img src={this.props.book.imageLinks.thumbnail} />
                </CardMedia>
                <CardText>{this.props.book.description}</CardText>
                <FlatButton label="Remove this book?" onClick={() => this.props.onDelete(this.props.isbn)} />
            </Card>
        );
    }
});