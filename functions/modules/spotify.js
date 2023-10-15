require('dotenv').config();
const Promise = require('promise');
const SpotifyWebApi = require('spotify-web-api-node');
let identifiers = require('./../bands/doro/music');
const fs = require('fs');
const path = require('path');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})
const dbFilePath = path.join(__dirname, '../../', 'db.json');

const albumsById = async (targetId) => {
  const jsonData = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  const foundObject = jsonData?.albums?.find(item => item.id === targetId);
  return foundObject ? foundObject : null
}

const getMusics = async () => {
  const jsonData = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  return jsonData?.albums
}
const LoadAlbums = async () => {
  const token = await spotifyApi.clientCredentialsGrant()
  spotifyApi.setAccessToken(token.body.access_token)
  const chunkedArray = [];
  const completeData = [];
  for (let i = 0; i < identifiers.length; i += 15) {
    chunkedArray.push(identifiers.slice(i, i + 15));
  }

  for (const batchIds of chunkedArray) {
    try {
      const data = await spotifyApi.getAlbums(batchIds);
      completeData.push(...data.body.albums);
    } catch (err) {
      console.error(err);
    }
  }

  fs.writeFileSync(dbFilePath, JSON.stringify({ albums: [] }, null, 2));
  fs.writeFileSync(dbFilePath, JSON.stringify({ albums: completeData }, null, 2));

  return completeData
}
module.exports = {
  LoadAlbums,
  albumsById,
  getMusics
}


// module.exports = async () => {
//   let data = []
//   const token = await spotifyApi.clientCredentialsGrant()
//   spotifyApi.setAccessToken(token.body.access_token)

//   for (const item of identifiers) {
//     let result = await getAlbum(item)
//     data.push(result)
//   }
//   console.log(data, "data")
//   // const dbFilePath = path.join(__dirname, '../', 'db.json');
//   // console.log(dbFilePath.length, "dbFilePath")

//   // console.log(dbFilePath, "dbFilePath")
//   // let dataJson = JSON.stringify(data, null, 2)
//   // fs.writeFileSync(dbFilePath, dataJson, 'utf-8')
//   //   let asset = new AssetCache('music')
//   //   if (asset.isCacheValid('3d')) {
//   //     return asset.getCachedValue() km
//   //   }
//   // const albumPromises = identifiers.map(getAlbum)
//   // const albumPromises = ["1mlr5qT8Bsyd1wzu8bdtA3"].map(getAlbum);
//   // console.log(albumPromises, "--albumPromises--")
//   // return Promise.all(albumPromises).then(albumObjs => {
//   //   let albumArray = [].concat.apply([], albumObjs)
//   //   // fs.writeFileSync(dbFilePath, JSON.stringify(albumArray), 'utf-8');
//   return dataJson
//   // })
// }
