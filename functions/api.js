const express = require('express');
const serverless = require('serverless-http');
const { LoadAlbums, albumsById, getMusics } = require('./modules/spotify.js');
const app = express();
const router = express.Router();

//Get all students
router.get('/', (req, res) => {
  res.send(`App is running.. ${process.env.NAME}`);
});

//Create new record
router.get('/album-by-id/:id', async (req, res) => {
  try {
    const albumId = req.params.id;
    let data = await albumsById(albumId)
    if (data) {
      return res.status(200).json({ message: 'Created', data: data });
    }
    return res.status(404).json({ message: "data not found", data: null });
  } catch (error) {
    return res.status(500).json({ message: error, data: null });
  }
});
//load-albums
router.post('/load-albums', async (req, res) => {
  try {
    const data = await LoadAlbums()
    return res.status(200).json({ message: 'Created', data: data });
  } catch (error) {
    return res.status(500).json({ message: error, data: null });
  }
});


router.get('/ger-music', async (req, res) => {
  try {
    const data = await getMusics()
    return res.status(200).json({ message: 'load music', data: data });
  } catch (error) {
    return res.status(500).json({ message: error, data: null });
  }
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
