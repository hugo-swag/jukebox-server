require('dotenv').config();
const axios = require('axios');

const NAPSTER_API_KEY = process.env.NAPSTER_API_KEY || 'ZGUzZTc3ZTUtYjg2NS00Mjc2LTgxM2UtM2QyY2YzOGQ2NTBm';

module.exports = async (songName, artist) => {
  const queryWords = [...songName.split(' '), ...artist.split(' ')];
  const queryString = queryWords.join('+');
  console.log(queryString);

  const config = {
    method: 'get',
    url: `http://api.napster.com/v2.2/search?apikey=${NAPSTER_API_KEY}&query=${queryString}&type=track&per_type_limit=5`,
  };

  const response = await axios(config);
  return response.data.search.data.tracks.map((track) => {
    return new Song(track);
  });

  
};

class Song {
  constructor(musicData) {
    this.name = musicData.albumName;
    this.artist = musicData.artistName;
    this.uri = musicData.previewURL;
  }
}




