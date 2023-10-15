const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const { LoadAlbums, albumsById, getMusics } = require('./modules/spotify.js');
server.use(middlewares);

const fetch = require('node-fetch');

// album-by-id
server.get('/album-by-id/:id', async (req, res) => {
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
server.post('/load-albums', async (req, res) => {
    try {
        const data = await LoadAlbums()
        return res.status(200).json({ message: 'Created', data: data });
    } catch (error) {
        return res.status(500).json({ message: error, data: null });
    }
});


server.get('/ger-music', async (req, res) => {
    try {
        const data = await getMusics()
        return res.status(200).json({ message: 'load music', data: data });
    } catch (error) {
        return res.status(500).json({ message: error, data: null });
    }
});

server.use(router);


// Start the server
server.listen(3000, () => {
    console.log('JSON Server is running');
});
