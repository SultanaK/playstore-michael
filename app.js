'use strict';
const express = require('express');
const app = express();
const morgan = require('morgan');
const data = require('./data');
const {capitalize} = require('./utils');
app.use(morgan('common'));


app.get('/apps', (req, res) => {
  let {sort, genres} = req.query;
  let results = data;

  if (genres) {
    genres = capitalize(genres);
    if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genres)) {
      return res.status(400).send('genres must be of Action, Puzzle, Strategy, Casual, Arcade or Card');
    }
    results = data.filter(item => {
      let regex = new RegExp(genres, 'i');
      return regex.test(item['Genres']);
    });
  }

  if (sort) {
    sort = capitalize(sort);
    if (!['Rating', 'App'].includes(sort)) {
      return res.status(400).send('sort must be of Rating or App');
    }
    if (sort === 'Rating') {
      results.sort((a,b) => {
        return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
      });
    } else {
      results.sort((a,b) => {
        return a[sort].toLowerCase() > b[sort].toLowerCase() ? 1 : a[sort].toLowerCase() < b[sort].toLowerCase() ? -1 : 0;
      });
    }
    
  }
  res.status(200).json(results);
});

app.listen(3000, () => {
  console.log('server running on port 3000');
});
