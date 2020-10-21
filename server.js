'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;

const GOOGLE_API = process.env.GOOGLE_API_KEY;

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));


// loads home page using index.ejs
app.get('/', (req, res) => {
  res.render('pages/index');
});


// TESTING ONLY: used for testing only as per feature task recommendation
app.get('/hello', (req, res) => {
  res.render('pages/index');
});

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
      console.log('google books data', data.body);
      let results = JSON.parse(data.text)
      results = results.items;
      let bookResults = results.map(book => new Book(book));
      res.json(bookResults); // posts results as giant obj
    })
    .catch(err => console.log(err));
}


app.listen(PORT, () => {
  console.log(`Server listening at: ${PORT}`);
})

// Book object constructor
function Book(data) {
  this.title = data.volumeInfo.title;
  this.author = data.volumeInfo.authors;
  this.publishDate = data.volumeInfo.publishedDate;
  this.desc = data.volumeInfo.description;
  this.pages = data.volumeInfo.pageCount;
  this.rating = data.volumeInfo.averageRating;
  this.img = data.volumeInfo.imageLinks.thumbnail || `https://i.imgur.com/J5LVHEL.jpg`;
}

app.use(errorHandler);

function errorHandler(error, request, response, next) {
  console.log(error);
  response.status(500).send('Ooops. That is spooky! Something went wrong ):')
}
