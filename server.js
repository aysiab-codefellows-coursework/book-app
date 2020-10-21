'use strict';

// 3rd party dependencies
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL)

// configuring database
client.connect();
client.on('error', err => console.log(err));

// front end configs
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));


// loads home page using index.ejs
app.get('/', getAllBooks);

// function that retrieves books from database
function getAllBooks(req, res) {
  let query = `SELECT * FROM books;`;
  return client.query(query)
    .then(data => {
      res.render('pages/index.ejs',{ books: data.rows })
    })
    .catch(err => console.log(err));
}

app.get('/books/:book_id', getBookDetails);

function getBookDetails(req, res) {
  let query = 'SELECT * FROM books WHERE id=$1';
  let value = [req.params.book_id];
  value = [Number(value[0])];

  return client.query(query, value)
    .then(details => {
      res.render('pages/books/detail', { book: details.rows[0]})
    })
    .catch(err => console.error(err));
}


// loads search page
app.get('/search', (req, res) => res.render('pages/searches/searches.ejs'));

// loads search results
app.post('/searches', createSearch);

function createSearch(req, res) {
  let query = req.body.search[0];
  let url;
  if (req.body.search[1] === 'title') { url = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${query}`; }
  if (req.body.search[1] === 'author') { url = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${query}`; }
  superagent.get(url)
    .then(data => {
     // console.log('google books data', data.body);
      let results = JSON.parse(data.text)
      results = results.items;
      let bookResults = results.map(book => new Book(book));
      //res.json(bookResults);
      res.render('pages/searches/show',{search_results: bookResults}); 
    })
    .catch(err => console.log(err));
}

app.get('/add', addToFave)

function addToFave(req,res) {
  console.log(req.body);
}


app.listen(PORT, () => {
  console.log(`Server listening at: ${PORT}`);
})

// Book object constructor
function Book(data) {
  this.title = data.volumeInfo.title;
  this.author = data.volumeInfo.authors;
  this.publishDate = data.volumeInfo.publishedDate;
  this.isbn = data.volumeInfo.industryIdentifiers[0].identifier;
  this.desc = data.volumeInfo.description;
  this.pages = data.volumeInfo.pageCount;
  this.rating = data.volumeInfo.averageRating;
  this.img = data.volumeInfo.imageLinks ? data.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
}

app.use(errorHandler);

function errorHandler(error, request, response, next) {
  console.log(error);
  response.status(500).send('Ooops. That is spooky! Something went wrong ):')
}
