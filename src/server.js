const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const bookResponses = require('./bookResponses.js');
const responses = require('./responses.js');
const querystring = require('querystring');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const loadBooks = () => {
  const filePath = path.join(__dirname, '../data/books.json');

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(data);

    bookResponses.setBooks(parsedData);

    console.log('Book data loaded successfully.');
  } catch (error) {
    console.error('Could not load book data:', error);
  }
};

const parseBody = (request, response, callback) => {
    const body = [];
  
    request.on('data', (chunk) => {
      body.push(chunk);
    });
  
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const contentType = request.headers['content-type'] || '';
  
      try {
        let parsedBody;
  
        if (contentType.includes('application/json')) {
          parsedBody = JSON.parse(bodyString);
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          parsedBody = querystring.parse(bodyString);
        } else {
          responses.respondJSON(request, response, 400, {
            message: 'Unsupported Content-Type.',
          });
          return;
        }
  
        callback(parsedBody);
      } catch {
        responses.respondJSON(request, response, 400, {
          message: 'Invalid request body.',
        });
      }
    });
  };

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url, true);

    if (request.method === 'POST') {
        if (parsedUrl.pathname === '/api/addBook') {
          parseBody(request, response, (body) => {
            bookResponses.addBook(request, response, body);
          });
          return;
        }
      
        if (parsedUrl.pathname === '/api/updateBook') {
          parseBody(request, response, (body) => {
            bookResponses.updateBook(request, response, body);
          });
          return;
        }
    }

    switch (parsedUrl.pathname) {
        case '/api/books':
          bookResponses.getBooks(request, response);
          break;
      
        case '/api/titles':
          bookResponses.getBookTitles(request, response);
          break;
      
        case '/api/authors':
          bookResponses.getAuthors(request, response);
          break;
      
        case '/api/search':
          bookResponses.searchBooks(request, response, parsedUrl.query);
          break;
      
        default:
          responses.respondJSON(request, response, 404, {
            message: 'The page you are looking for was not found.',
          });
          break;
    }
};

loadBooks();

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on port ${port}`);
});