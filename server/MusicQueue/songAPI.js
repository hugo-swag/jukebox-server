const axios = require(`axios`);

async function getMusic (request, response, next) {
  try {
    let url = `http:// https://api.spotify.com//v1/search?type=album&include_external=audio HTTP/1.1apikey=${process.env.MUSIC_API_KEY}
    let musicObj = await axios.get(url);
    console.log(musicObj.data);
    let  = musicObj.data.tracks.map(music => new Music(music));
    cache = {
      data: nowPlaying,
      
    };

    response.status(200).send(selectedSong);
  
  } catch(err) {
    next(err);
  }
};



module.exports = playMusic;