'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('pages/index');
});


// TESTING ONLY: used for testing only as per feature task recommendation 
app.get('/hello', (req, res) => {
  res.render('pages/index');
});

app.post('/searches', createSearch);

function createSearch(req, res) {
  let url = ``;
}


app.listen(PORT, () => {
  console.log(`Server listening at: ${PORT}`);
})
