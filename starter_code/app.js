// setup dotenv package

const express = require("express");
const hbs = require("hbs");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
// Remember to insert your credentials here
require("dotenv").config();

const clientId = process.env.CLIENT_ID,
  clientSecret = process.env.CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artists", (req, res) => {
  const search = req.query.search;

  spotifyApi
    .searchArtists(search)
    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      const artists = data.body.artists.items;

      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

      artists.forEach(artist => {
        if (!artist.images.length) {
          artist.images.push({
            url:
              "https://media2.fishtank.my/app_themes/hitz/assets/images/default-album-art.png"
          });
        }
      });

      res.render("artists", { artistsList: artists });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res) => {
  const artistId = req.params.artistId;

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      // isolate the array of albums
      // render an albums view with the content of that array

      const albums = data.body.items;

      res.render("albums", { albumsList: albums });
    })
    .catch(err => {
      console.log("The error while searching albums occured: ", err);
    });
});

app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      const tracks = data.body.items;

      res.render("tracks", { tracksList: tracks });
    })
    .catch(err => {
      console.log("The error while searching tracks occured: ", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
