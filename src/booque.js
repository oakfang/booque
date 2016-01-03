import https from 'https';

function getBookUrl(isbn) {
    return `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
}

export default function getBook(isbn) {
    return new Promise((resolve, reject) => {
        https.get(getBookUrl(isbn), response => {
            response.setEncoding('utf8');
            response.on('error', reject);
            let chunks = [];
            response.on('data', chunks.push.bind(chunks));
            response.on('end', () => {
                let responseObject = JSON.parse(chunks.join(''));
                responseObject.items ? resolve(responseObject.items[0].volumeInfo) : reject(responseObject);
            });
        });
    });    
}