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

app.get('/books/:id', getBookDetails);

function getBookDetails(req, res) {
  console.log('reached!')
  try {
    let query = 'SELECT * FROM books WHERE id=$1';
    let value = [req.params.id];
    value = [Number(value[0])];

    return client.query(query, value)
      .then(details => {
        res.render('pages/books/detail', { book: details.rows[0]})
      })
      .catch(err => console.error(err));
  } catch(exception) {
    console.log(exception);
  }
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
      let results = JSON.parse(data.text)
      results = results.items;
      let bookResults = results.map(book => new Book(book));
      res.render('pages/searches/show',{search_results: bookResults});
    })
    .catch(err => console.log(err));
}

app.post('/books', addToFave);

function addToFave(req,res) {
  const {title, author, isbn, image, description } = req.body;
  let insertBookSQL = `INSERT INTO books (title, author, isbn, image_url, description) VALUES($1, $2, $3, $4, $5) RETURNING id;`;
  client.query(insertBookSQL, [title, author, isbn, image, description])
    .then( data => {
      console.log("fave", data.rows[0]);
      res.redirect(`/books/${data.rows[0].id}`);
    })
}

app.post('/edit', getForm);

function getForm(req,res) {
  let query = 'SELECT * FROM books WHERE id=$1';
  let { id } = req.body
  id = Number(id);
  client.query(query, [id])
    .then(details => {
      res.render('pages/books/edit.ejs', {book: details.rows[0]});
    })
}

app.post('/books/add',editDetails);

function editDetails(req,res) {
  const {title, author, image, description, isbn, id} = req.body;
  let updateSQL = 'UPDATE books SET title=$1, author=$2, image_url=$3, description=$4, isbn=$5 WHERE id=$6 RETURNING id;';
  client.query(updateSQL, [title, author, image, description, isbn, id])
    .then(data => {
      console.log("edit", data.rows[0]);
      res.redirect(`/books/${data.rows[0].id}`);
    });
}


function removeFromFave(req,res) {
  console.log()
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
