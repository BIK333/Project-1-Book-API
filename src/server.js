const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const bookResponses = require('./bookResponses.js');
const responses = require('./responses.js');

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

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  switch (parsedUrl.pathname) {
    case '/api/books':
      bookResponses.getBooks(request, response);
      break;

    case '/api/titles':
      bookResponses.getBookTitles(request, response);
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