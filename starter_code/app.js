const express = require('express');
const hbs = require('hbs');
const clientId='d3181bdee67e4762b8593e70929fe284',
clientSecret ='f7848f1323204093979bafc6d9c9fc28';
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
  });
hbs.registerPartials(__dirname + '/views/partials');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

  



// the routes go here:
app.get("/", (req, res) => {
    res.render("index.hbs");
  });

app.get('/artist', (req, res, next) => {
  let artist = req.query.search
  spotifyApi.searchArtists(artist)
    .then(data => {
      let artist = data.body.artists.items;
      res.render('artists', { artist })
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
})



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
