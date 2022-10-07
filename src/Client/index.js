'use strict';

const io = require('socket.io-client');
const handleAddSong = require('./addSong');
const handleBid = require('./bid');
// const getSongs = require('./songList');
const Chance = require('chance');

const chance = new Chance();
const clientId = chance.guid();

const URI = process.env.URI || 'http://localhost:3002/main';
const socket = io.connect(URI);
let localQueue = [];

const events = require('../eventPool');

events.forEach(event => socket.on(event, (payload) => {
  localQueue = payload;
  console.log(localQueue);
}));


for(let i = 0; i < 10; i++) {
  handleAddSong(socket, clientId, 'song', Math.floor(Math.random() * 10), 2000);
}

setTimeout(() => {
  handleAddSong(socket, clientId, 'song again', Math.floor(Math.random() * 10), );
});

module.exports = socket;








