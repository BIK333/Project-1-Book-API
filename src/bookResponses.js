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

const addBook = (request, response, body) => {
    if (!body.title || body.title.trim() === '') {
      responses.respondJSON(request, response, 400, {
        message: 'A book title is required.',
      });
      return;
    }
  
    if (!body.author || body.author.trim() === '') {
      responses.respondJSON(request, response, 400, {
        message: 'An author is required.',
      });
      return;
    }
  
    const existingBook = books.find(
      (book) => book.title.toLowerCase() === body.title.toLowerCase(),
    );
  
    if (existingBook) {
      responses.respondJSON(request, response, 400, {
        message: 'A book with that title already exists.',
      });
      return;
    }
  
    const newBook = {
      title: body.title,
      author: body.author,
      country: body.country || 'Unknown',
      language: body.language || 'Unknown',
      pages: Number(body.pages) || 0,
      year: Number(body.year) || 0,
      genres: body.genres || [],
    };
  
    books.push(newBook);
  
    responses.respondJSON(request, response, 201, {
      message: 'Book created successfully.',
      book: newBook,
    });
  };
  
  const updateBook = (request, response, body) => {
    if (!body.title || body.title.trim() === '') {
      responses.respondJSON(request, response, 400, {
        message: 'A book title is required.',
      });
      return;
    }
  
    const book = books.find(
      (currentBook) => currentBook.title.toLowerCase() === body.title.toLowerCase(),
    );
  
    if (!book) {
      responses.respondJSON(request, response, 404, {
        message: 'Book not found.',
      });
      return;
    }
  
    if (body.author) {
      book.author = body.author;
    }
  
    if (body.country) {
      book.country = body.country;
    }
  
    if (body.language) {
      book.language = body.language;
    }
  
    if (body.pages) {
      book.pages = Number(body.pages);
    }
  
    if (body.year) {
      book.year = Number(body.year);
    }
  
    responses.respondJSONMeta(response, 204);
  };

module.exports = {
  setBooks,
  getBooks,
  getBookTitles,
  getAuthors,
  searchBooks,
  addBook,
  updateBook,
};