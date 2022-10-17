'use strict';

const axios = require('axios');
require('dotenv').config();
const base64 = require('base-64');

var authOptions = {
  method: 'post',
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + base64.encode(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_SECRET}`),
    'Content-Type':'application/x-www-form-urlencoded',
  },
  data: {
    grant_type: 'client_credentials',
  },
};

const getAccessToken = async () => {
  try {
    let response = await axios(authOptions);
    return response.data;
  } catch(e) {
    console.log(e);
    console.log(e.message);
  }
};

module.exports = getAccessToken;