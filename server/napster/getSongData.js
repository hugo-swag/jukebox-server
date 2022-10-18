require('dotenv').config();
const axios = require('axios');

const NAPSTER_API_KEY = process.env.NAPSTER_API_KEY;

module.exports = async (songName, artist) => {
  const queryWords = [...songName.split(' '), ...artist.split(' ')];
  const queryString = queryWords.join('+');

  const config = {
    method: 'get',
    url: `http://api.napster.com/v2.2/search?apikey=${NAPSTER_API_KEY}&query=${queryString}&type=track&per_type_limit=5`,
  };

  try {
    if(queryString) {
      const response = await axios(config);
      if(response.data.search.tracks) {
        return response.data.search.data.tracks.map((track) => {
          return new Song(track);
        });
      }
    }  else {
      return [];
    }
  } catch(e) {
    console.log(e.message);
  }
};

class Song {
  constructor(musicData) {
    this.name = musicData.albumName;
    this.artist = musicData.artistName;
    this.uri = musicData.previewURL;
  }
}




