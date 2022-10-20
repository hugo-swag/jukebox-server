'use strict';

const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/auth/');
const bearer = require('./auth/middleware/bearer');
const errorHandler = require('./errorhandler/500');
const notFoundHandler = require('./errorhandler/404');

let app = express();
let server = http.createServer(app);
let io = new socketIO.Server(server);


app.use(cookieParser());
app.use(cors());

app.use(userRoutes);

const Chance = require('chance');
const chance = new Chance();

const getSongData = require('./napster/getSongData');

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

io.use(bearer);
io.on('connection', async (socket) => {

  let isRunning = false;

  // send the queue when a client connects, have them automatically join the main room
  console.log(`Client joined: ${socket.id}`);
  socket.join('main');
  io.to(socket.id).emit('update-playing-and-queue', queueList[0]);
  io.to(socket.id).emit('room-list', getRoomList());

  // create a new queue for that room, give the queueName property the same as the room name
  socket.on('create-room', rooms => {
    socket.leave(rooms.currentRoom);
    socket.join(rooms.newRoom);
    console.log(`${socket.id} joined room ${rooms.newRoom}`);

    const oldQueue = queueList.find(q => q.queueName === rooms.newRoom);
    if (!oldQueue) {
      const newQueue = new MusicQueue(rooms.newRoom);
      queueList.push(newQueue);
      io.sockets.emit('room-list', getRoomList());
      io.to(socket.id).emit('update-queue', newQueue);
    } else {
      io.to(socket.id).emit('update-queue', oldQueue);
    }
  });

  // when a user joins, send them that rooms queue and current song
  socket.on('join-room', rooms => {
    socket.leave(rooms.currentRoom);
    socket.join(rooms.newRoom);
    console.log(`${socket.id} joined room ${rooms.newRoom}`);

    const queue = findQueue(rooms.newRoom);
    io.to(socket.id).emit('update-playing-and-queue', queue);
  });

  socket.on('search-song', async (songData) => {
    const songSearchData = await getSongData(songData.name, songData.artist);
    console.log(songSearchData);
    io.to(socket.id).emit('search-results', songSearchData);
  });

  // when client adds a song, add it to queue
  // if a song is not playing, call playSong() to start it
  socket.on('add', songToAdd => {
    songToAdd.songId = chance.guid();
    const queue = findQueue(songToAdd.room);
    queue.addSong(songToAdd);
    io.to(queue.queueName).emit('update-queue', queue);
    console.log(`${songToAdd.songId} added to queue`);

    if (!isRunning) {
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
    isRunning = true;
    setTimeout(() => {
      playNextSong(queue);
    }, queue.songList[0].songLength);
  }

  // calls remove song to remove the song that was just playing
  // plays the next song if there is one, sets isRunning to false if there isn't one
  function playNextSong(queue) {
    removeSong(queue);
    if (queue.songList.length !== 0) playSong(queue);
    else isRunning = false;
  }

  // takes the song at the top off the queue and emits remove so that the queue is updated client side
  function removeSong(queue) {
    const removedSong = queue.removeSong();
    try {
      console.log(`${removedSong.songId} removed from queue`);
    } catch (e) { console.log('No more songs to remove'); }
    io.to(queue.queueName).emit('update-playing-and-queue', queue);
  }
});

app.get('/', (req, res) => {
  res.status(200).send('Welcome to my server');
});

app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  server: server,
  start: PORT => {
    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  },
};
