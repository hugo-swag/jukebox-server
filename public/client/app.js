'use strict';

// eslint-disable-next-line no-undef
const socket = io();
const songForm = document.querySelector('form');
const queueDiv = document.querySelector('ul');

let localQueue = [];

const eventPool = ['add', 'remove', 'bid'];

eventPool.forEach(singleEvent => socket.on(singleEvent, (payload) => {
  localQueue = payload;
  updateQueueList();
}));

songForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target.songName.value;
  const artist = e.target.artist.value;
  const bid = e.target.bid.value;
  handleAddSong(name, artist, bid, 5000);
});

function updateQueueList() {
  queueDiv.innerHTML = '';
  console.log(localQueue.songList);
  for(let song of localQueue.songList) {
    const li = document.createElement('li');
    li.innerHTML = `${song.name} by ${song.artist}`;
    queueDiv.appendChild(li);
  }
}

function handleAddSong (name, artist, bid, songLength) {
  const song = {
    clientId: socket.id,
    songId: Math.ceil(Math.random() * 10000),
    name: name,
    artist: artist,
    bid: bid,
    songLength: songLength,
  };

  socket.emit('add', song);
}

function handleBid(socket, song, bid) {
  song.bid += bid;
  socket.emit('bid', song);
}









