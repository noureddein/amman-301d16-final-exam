'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));


// Specify a directory for static resources

// define our method-override reference

// Set the view engine for server-side templating

// Use app cors


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/', homePage);
app.post('/save', saveCharacters);
app.get('/favorite', favCharacters);
app.get('/details/:char_id', characterDetails);


// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function homePage(req, res) {
  const url = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=10';
  superagent.get(url).set('User-Agent', '1.0')
    .then(results => {
      const data = results.body;
      let dataArray = data.map(ele => new Characters(ele));
      res.render('index', { dataArray: dataArray });
    })
    .catch((error) => console.log(error))

}

function saveCharacters(req, res) {
  const { character, quote, img, direction } = req.body;
  const sql = 'INSERT INTO book_wiki (character, quote,image,characterdirection) VALUES ($1,$2,$3,$4) ;';
  const safeValues = [character, quote, img, direction];
  client.query(sql, safeValues).then(res.redirect('/')).catch((error) => console.log(error))

}

function favCharacters(req, res) {
  const sql = 'SELECT * FROM book_wiki;';
  client.query(sql).then(results => {
    res.render('fav', { dataArray: results.rows })
  })
}

function characterDetails(req, res) {
  console.log(req.params.char_id)
  const sql = 'SELECT * FROM book_wiki WHERE id=$1;'
  // const sql = 'UPDATE book_wiki SET quote=$1 WHERE id =$2;'
  const safeValues = [req.params.char_id];
  client.query(sql, safeValues).then(result => {
    res.render('details', { dataArray, result })
  })

}


// helper functions
function Characters(data) {
  this.quote = data.quote;
  this.character = data.character;
  this.image = data.image;
  this.characterDirection = data.characterDirection;
}
// app start point
client.connect().then(() =>
  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
