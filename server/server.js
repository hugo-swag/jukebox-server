'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, './../public');
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

const Chance = require('chance');
const chance = new Chance();

const MusicQueue = require('./MusicQueue/index');
const queue = new MusicQueue();


io.on('connection', async (socket) => {

  let isRunning = false;

  // send the queue when a client connects
  console.log(`Client joined: ${socket.id}`);
  io.to(socket.id).emit('update-playing-and-queue', queue);

  // when client adds a song, add it to queue
  // if a song is not playing, call playSong() to start it
  socket.on('add', payload => {
    payload.songId = chance.guid();
    console.log(`${payload.songId} added to queue`);
    queue.addSong(payload);
    io.sockets.emit('update-queue', queue);
    if(!isRunning) {
      playSong();
      io.sockets.emit('update-playing-and-queue', queue);
    } else io.sockets.emit('update-queue', queue);
  });

  // when client bids, the bid method in MusicQueue updates the bid and sorts the queue
  socket.on('bid', payload => {
    queue.bid(payload);
    io.sockets.emit('update-queue', queue);
  });

  // play song sets is Running is true, so that playSong is not called again when a song is added
  // it sets a timeout according to the duration of the song, after timeout, calls play next song
  function playSong() {
    isRunning = true;
    setTimeout(() => {
      playNextSong();
    }, queue.songList[0].songLength);
  }

  // calls remove song to remove the song that was just playing
  // plays the next song if there is one, sets isRunning to false if there isn't one
  function playNextSong() {
    removeSong();
    if(queue.songList.length !== 0) playSong();
    else isRunning = false;
  }

  // takes the song at the top off the queue and emits remove so that the queue is updated client side
  function removeSong() {
    const removedSong = queue.removeSong();
    try {
      console.log(`${removedSong.songId} removed from queue`);
    } catch(e) {console.log('No more songs to remove');}
    io.sockets.emit('update-playing-and-queue', queue);
  }
});

module.exports = {
  server:server,
  start: PORT => {
    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  },
};
