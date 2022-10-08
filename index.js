'use strict';

const server = require('./server/server');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

try {
  server.start(PORT);
} catch(e) {
  console.log(e);
}