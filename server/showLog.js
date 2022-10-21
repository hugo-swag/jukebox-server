'use strict';

const axios = require('axios');
const server = require('./server');



const config = {
  url: 'https://localhost:3001/user/signup',
  method: 'post',
  data: {
    username: 'user',
    password: 'fake',
  },
};

let token = '';
let user = {};
server.start(3001)
  .then(() =>{
    axios(config);
  })
  .then(response => {
    console.log(response.data);
    user = response.data.user;
    token = response.data.user.token;
  })
  .catch(e => console.log(e));

