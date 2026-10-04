const responses = require('./responses.js');

let books = [];

const setBooks = (bookData) => {
  books = bookData;
};

const getBooks = (request, response) => {
  const responseJSON = {
    books,
  };

  responses.respondJSON(request, response, 200, responseJSON);
};

const getBookTitles = (request, response) => {
  const titles = books.map((book) => book.title);

  const responseJSON = {
    titles,
  };

  responses.respondJSON(request, response, 200, responseJSON);
};

module.exports = {
  setBooks,
  getBooks,
  getBookTitles,
};