'use  strict';

const Chance = require('chance');

const chance = new Chance();

const handleAddSong = (socket, clientId, name, bid, songLength) => {
  
  const song = {
    clientId: clientId,
    songId: chance.guid(),
    name: name,
    bid: bid,
    songLength: songLength,
  };

  socket.emit('add', song);

};

module.exports = handleAddSong;

