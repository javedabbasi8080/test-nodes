//import ytpl module, pass the playlist id and output json file when visiting sitename.ext/bands/doro/videos.json
//remove eleventy code

const
  ytpl = require('ytpl'),
  { AssetCache } = require('@11ty/eleventy-fetch')

module.exports = async () => {
  let asset = new AssetCache('videos')
  if (asset.isCacheValid('3d')) {
    return asset.getCachedValue()
  }
  const playlist = await ytpl('PLO6yW8agzHgE1aDWADQPq7hRmCiv06XeF')
  console.log(playlist)
  await asset.save(playlist.items, 'json')
  return playlist.items
}
