'use strict';

const io = require('socket.io');
const PORT = process.env.PORT || 3002;
const server = io(PORT);
const MusicQueue = require('./MusicQueue/index');

const queue = new MusicQueue();

const main = server.of('/main');


main.on('connection', async (socket) => {

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


module.exports = server;