require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { json } = require('stream/consumers');

let app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
})

app.get('/movies', (req, res) => {
  const title = req.query.title; 

  const url = 'https://api.themoviedb.org/3/search/movie?query='+title+'&include_adult=false&language=en-US&page=1';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + process.env.TMDB_KEY,
    }
    };

  fetch(url, options)
    .then(apiRes => apiRes.json())
    .then(json => {
      let data = json.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        watch_here: '/movie/'+movie.id,
      }));
      fs.writeFileSync('data.json','','utf-8', (err) => {
        console.error(err);
      });
      fs.writeFileSync('data.json', JSON.stringify(data), 'utf-8', (err) => {
        console.error(err);
      });
        res.json(data)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: 'Failed to fetch movies' });
  })
});

app.get('/movie/:id', (req, res) => {
  const id = req.params.id * 1;
  html = fs.readFileSync('index.html', 'utf-8');
  
  res.status(200).send(html.replace('{{%movieid%}}', id));
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
})