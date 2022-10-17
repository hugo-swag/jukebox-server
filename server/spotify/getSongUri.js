const axios = require('axios');
const getAccessToken = require('./getAccessToken');

module.exports = async (songName, artist) => {
  
  const token = await getAccessToken();

  const config = {
    url: `https://api.spotify.com/v1/search?type=track&q=${songName}_${artist}&limit=1`,
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
    },
  };

  try {
    let response = await axios(config);
    return {uri: response.data.tracks.items[0].uri, songLength: response.data.tracks.items[0].duration_ms};
  } catch(e) {
    console.log(e);
  }
};

