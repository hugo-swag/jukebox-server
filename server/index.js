'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, './../public');
const PORT = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));


const MusicQueue = require('./MusicQueue/index');

const queue = new MusicQueue();


io.on('connection', async (socket) => {

  let isRunning = false;

  socket.on('add', payload => {
    console.log(`${payload.songId} added to queue`);
    queue.addSong(payload);
    socket.broadcast.emit('add', queue);
    if(!isRunning) {
      removeSong();
    }
  });

  socket.on('bid', payload => {
    console.log(payload);
    queue.bid(payload);
    console.log(queue);
    socket.broadcast.emit('bid', queue);
  });

  function removeSong() {
    while(queue.songList.length !== 0 && !isRunning) {
      isRunning = true;
      setTimeout(() => {
        const removedSong = queue.removeSong();
        console.log(`${removedSong.songId} removed from queue`);
        socket.emit('remove', queue);
        isRunning = false;
        removeSong();
      }, queue.songList[0].songLength);
    }
  }

});


server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
