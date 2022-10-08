'use strict';

// eslint-disable-next-line no-undef
const socket = io();
const songForm = document.querySelector('form');
const queueDiv = document.querySelector('ul');

let localQueue = [];

// server sends queue as soon as a client joins
socket.on('send-queue', (payload) => {
  localQueue = payload;
  console.log(localQueue.songList);
  console.log('queue received on init');
});

socket.on('update-queue', (payload) => {
  localQueue = payload;
  updateQueueList();
});


songForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target.songName.value;
  const artist = e.target.artist.value;
  const bid = parseInt(e.target.bid.value);
  handleAddSong(name, artist, bid, 5000);
});

function updateQueueList() {
  queueDiv.innerHTML = '';
  for(let song of localQueue.songList) {
    const li = document.createElement('li');
    li.innerHTML = `${song.name} by ${song.artist}: current bid at ${song.bid}`;
    
    const form = getBidForm(song);
    li.appendChild(form);

    queueDiv.appendChild(li);
  }
}

function handleAddSong (name, artist, bid, songLength) {
  if(isNaN(bid)) bid = 0;
  const song = {
    clientId: socket.id,
    name: name,
    artist: artist,
    bid: bid,
    songLength: songLength,
  };
  socket.emit('add', song);
}

function handleBid(song, bid) {
  if(!isNaN(parseInt(bid))) {
    song.bid += parseInt(bid);
    socket.emit('bid', song);
    console.log(song.bid);
  }
}

function getBidForm(song) {

  try {

    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'existingSongBid';

    const submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = 'Bid';

    const form = document.createElement('form');
    form.appendChild(input);
    form.appendChild(submit);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBid(song, e.target.existingSongBid.value);
    });

    
    return form;
  } catch(e) {
    console.log(e);
  }
}









