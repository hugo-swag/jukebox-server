'use strict';

const server = require('./server/server');
require('dotenv').config();
const axios = require('axios');
const io = require('socket.io-client');

const PORT = process.env.PORT || 3001;

let token = '';
let socket = null;

try {
  server.start(PORT);
} catch(e) {
  console.log(e);
}

// test sign in and sign up with axios
async function testSignup() {
  console.log('Testing Sign Up');
  const config = {
    url: 'http://localhost:3001/user/signup',
    method: 'post',
    data: {
      username: 'test',
      password: 'foo',
    },
  };
  const response = await axios(config);
  console.log(response.data);
  token = response.data.token;
}

async function testSignIn() {
  console.log('Testing in Sign In');
  const config = {
    url: 'http://localhost:3001/user/signin',
    method: 'post',
    auth: {
      username: 'test',
      password: 'foo',
    },
  };
  const response = await axios(config);
  console.log(response.data);
}


testSignup()
  .then(() => {
    testSignIn();
  })
  .then(() => {
    socket = io('http://localhost:3000',
      {
        auth: {
          token: token,
        },
      },
    );
    console.log('socket connected');
  })
  .catch((e) => {
    console.log(e);
  });

