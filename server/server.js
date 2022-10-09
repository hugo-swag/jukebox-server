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
const mainQueue = new MusicQueue('main');

const queueList = [mainQueue];

const findQueue = (roomName) => {
  return queueList.find(queue => queue.queueName === roomName);
};

const getRoomList = () => {
  return queueList.reduce((acc, queue) => {
    const queueName = queue.queueName;
    acc.push(queueName);
    return acc;
  }, []);
};

io.on('connection', async (socket) => {

  let isRunning = false;

  // send the queue when a client connects, have them automatically join the main room
  console.log(`Client joined: ${socket.id}`);
  socket.join('main');
  io.to(socket.id).emit('update-playing-and-queue', queueList[0]);
  io.to(socket.id).emit('room-list', getRoomList());

  // create a new queue for that room, give the queueName property the same as the room name
  socket.on('create-room', roomName => {
    socket.join(roomName);
    console.log(`${socket.id} joined room ${roomName}`);

    const newQueue = new MusicQueue(roomName);
    queueList.push(newQueue);

    io.sockets.emit('room-list', getRoomList());

    io.to(socket.id).emit('update-queue', newQueue);
  });

  // when a user joins, send them that rooms queue and current song
  socket.on('join-room', (roomName) => {
    socket.join(roomName);
    console.log(`${socket.id} joined room ${roomName}`);

    const queue = findQueue(roomName);
    io.to(socket.id).emit('update-playing-and-queue', queue);
  });

  // when client adds a song, add it to queue
  // if a song is not playing, call playSong() to start it
  socket.on('add', songToAdd => {
    songToAdd.songId = chance.guid();

    const queue = findQueue(songToAdd.room);
    queue.addSong(songToAdd);
    io.sockets.emit('update-queue', queue);
    console.log(`${songToAdd.songId} added to queue`);

    if(!isRunning) {
      playSong(queue);
      io.to(songToAdd.room).emit('update-playing-and-queue', queue);
    } else io.to(songToAdd.room).emit('update-queue', queue);
  });

  // when client bids, the bid method in MusicQueue updates the bid and sorts the queue
  socket.on('bid', songWithNewBid => {
    const queue = findQueue(songWithNewBid.room);
    queue.bid(songWithNewBid);
    io.to(songWithNewBid.room).emit('update-queue', queue);
  });

  // play song sets is Running is true, so that playSong is not called again when a song is added
  // it sets a timeout according to the duration of the song, after timeout, calls play next song
  function playSong(queue) {
    console.log(queue);
    isRunning = true;
    setTimeout(() => {
      playNextSong(queue);
    }, queue.songList[0].songLength);
  }

  // calls remove song to remove the song that was just playing
  // plays the next song if there is one, sets isRunning to false if there isn't one
  function playNextSong(queue) {
    removeSong(queue);
    if(queue.songList.length !== 0) playSong(queue);
    else isRunning = false;
  }

  // takes the song at the top off the queue and emits remove so that the queue is updated client side
  function removeSong(queue) {
    const removedSong = queue.removeSong();
    try {
      console.log(`${removedSong.songId} removed from queue`);
    } catch(e) {console.log('No more songs to remove');}
    io.to(queue.queueName).emit('update-playing-and-queue', queue);
  }
});

module.exports = {
  server:server,
  start: PORT => {
    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  },
};
