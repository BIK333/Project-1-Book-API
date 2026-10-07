const results = document.querySelector('#results');
const statusMessage = document.querySelector('#status');

const showStatus = (message, type = '') => {
    statusMessage.textContent = message;
    statusMessage.className = type;
};

const displayBooks = (books) => {
  results.innerHTML = '';

    if (books.length === 0) {
    results.innerHTML = '<p>No books were found.</p>';
    return;
    }

    books.forEach((book) => {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book';

    const title = document.createElement('h3');
    title.textContent = book.title;

    const author = document.createElement('p');
    author.textContent = `Author: ${book.author}`;

    const language = document.createElement('p');
    language.textContent = `Language: ${book.language}`;

    const year = document.createElement('p');
    year.textContent = `Year: ${book.year}`;

    bookDiv.appendChild(title);
    bookDiv.appendChild(author);
    bookDiv.appendChild(language);
    bookDiv.appendChild(year);

    results.appendChild(bookDiv);
    });
};

const requestData = async (endpoint, type) => {
    showStatus('Loading...');

    try {
        const response = await fetch(endpoint, {
            headers: {
              Accept: 'application/json',
            },
        });

    if (!response.ok) {
        showStatus(`Request failed: ${response.status}`, 'error');
        return;
    }

    const data = await response.json();

    showStatus(`Request successful: ${response.status}`, 'success');

    if (type === 'books') {
        displayBooks(data.books);
    }

    if (type === 'titles') {
        results.innerHTML = '';

        data.titles.forEach((title) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = title;
        results.appendChild(paragraph);
        });
    }

    if (type === 'authors') {
        results.innerHTML = '';

        data.authors.forEach((author) => {
        const paragraph = document.createElement('p');
        paragraph.textContent = author;
        results.appendChild(paragraph);
        });
    }
    } catch (error) {
        showStatus('Could not connect to the server.', 'error');
    }
};

document.querySelector('#allBooksButton').addEventListener('click', () => {
    requestData('/api/books', 'books');
});

document.querySelector('#titlesButton').addEventListener('click', () => {
  requestData('/api/titles', 'titles');
});

document.querySelector('#authorsButton').addEventListener('click', () => {
  requestData('/api/authors', 'authors');
});

document.querySelector('#genreButton').addEventListener('click', () => {
    const genre = document.querySelector('#genreInput').value.trim();
  
    if (genre === '') {
        showStatus('Please enter a genre.', 'error');
        return;
    }
  
    requestData(`/api/search?genre=${encodeURIComponent(genre)}`, 'books');
});

document.querySelector('#languageButton').addEventListener('click', () => {
    const language = document.querySelector('#languageInput').value.trim();
  
    if (language === '') {
        showStatus('Please enter a language.', 'error');
        return;
    }
  
    requestData(
      `/api/search?language=${encodeURIComponent(language)}`,
      'books',
    );
});

document.querySelector('#addBookForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const book = {
      title: document.querySelector('#addTitle').value.trim(),
      author: document.querySelector('#addAuthor').value.trim(),
      country: document.querySelector('#addCountry').value.trim(),
      language: document.querySelector('#addLanguage').value.trim(),
      pages: document.querySelector('#addPages').value,
      year: document.querySelector('#addYear').value,
    };
  
    statusMessage.textContent = 'Adding book...';
  
    try {
      const response = await fetch('/api/addBook', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });
  
      const data = await response.json();
  
      if (response.status === 201) {
        showStatus('Book added successfully!', 'success');
        displayBooks([data.book]);
        document.querySelector('#addBookForm').reset();
        return;
      }
  
      showStatus(data.message, 'error');
    
    } catch (error) {
        showStatus('Could not connect to the server.', 'error');
    }
});

document.querySelector('#updateBookForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const book = {
      title: document.querySelector('#updateTitle').value.trim(),
      author: document.querySelector('#updateAuthor').value.trim(),
      language: document.querySelector('#updateLanguage').value.trim(),
      pages: document.querySelector('#updatePages').value,
      year: document.querySelector('#updateYear').value,
    };
  
    statusMessage.textContent = 'Updating book...';
  
    try {
      const response = await fetch('/api/updateBook', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });
  
      if (response.status === 204) {
        showStatus('Book updated successfully!', 'success');
        results.innerHTML = '<p>The book information was updated.</p>';
        document.querySelector('#updateBookForm').reset();
        return;
      }
  
      const data = await response.json();
      showStatus(data.message, 'error');
    } catch (error) {
        showStatus('Could not connect to the server.', 'error');
    }
});