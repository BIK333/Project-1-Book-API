const responses = require('./responses.js');

let books = [];

// Stores the book data that was loaded when the server started.
const setBooks = (bookData) => {
  books = bookData;
};

// Returns all books.
const getBooks = (request, response) => {
  const responseJSON = {
    books,
  };

  responses.respondJSON(request, response, 200, responseJSON);
};

// Returns only the titles of all books.
const getBookTitles = (request, response) => {
  const titles = books.map((book) => book.title);

  const responseJSON = {
    titles,
  };

  responses.respondJSON(request, response, 200, responseJSON);
};

// Returns a list of unique authors.
const getAuthors = (request, response) => {
  const authors = [...new Set(books.map((book) => book.author))];

  const responseJSON = {
    authors,
  };

  responses.respondJSON(request, response, 200, responseJSON);
};

// Searches for books using query parameters.
const searchBooks = (request, response, query) => {
  let results = books;

  if (query.genre) {
    const genre = query.genre.toLowerCase();

    results = results.filter((book) => {
        if (!book.genres) {
          return false;
        }
      
        return book.genres.some(
          (bookGenre) => bookGenre.toLowerCase().includes(genre),
        );
    });
  }

  if (query.language) {
    const language = query.language.toLowerCase();

    results = results.filter(
      (book) => book.language.toLowerCase() === language,
    );
  }

  const responseJSON = {
    books: results,
  };

  responses.respondJSON(request, response, 200, responseJSON);
};

module.exports = {
  setBooks,
  getBooks,
  getBookTitles,
  getAuthors,
  searchBooks,
};