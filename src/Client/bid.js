'use  strict';

const handleBid = (socket, song, bid) => {

  song.bid = bid;
  socket.emit('bid', song);

}; 

module.exports = handleBid;

