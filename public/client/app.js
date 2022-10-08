'use strict';

// eslint-disable-next-line no-undef
const socket = io();
const songForm = document.querySelector('form');
const queueDiv = document.querySelector('ul');

let localQueue = [];

const eventPool = ['add', 'remove', 'bid'];

// server sends queue as soon as a client joins
socket.on('send-queue', (payload) => {
  localQueue = payload;
});

// every socket is listening for events, so that when other clients update
// the queue they get the up to date queue
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
    li.innerHTML = `${song.name} by ${song.artist}: current bid at ${song.bid}`;
    
    const form = getBidForm(song);
    li.appendChild(form);

    queueDiv.appendChild(li);
  }
}

function handleAddSong (name, artist, bid, songLength) {
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
  song.bid += bid;
  socket.emit('bid', song);
}

function getBidForm(song) {
  // <label for="bid">Bid</label>
  // <input type="number" id="bid" value="min" min="0" />

  const label = document.createElement('label');
  label.for = 'existingSongBid';

  const input = document.createElement('input');
  input.type = 'number';
  input.id = 'existingSongBid';
  input.min = '0';
  input.value = '0';

  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.value = 'Bid';
  submit.addEventListener('submit', (e) => {
    e.preventDefault();
    handleBid(song, 10);
  });

  const form = document.createElement('form');
  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(submit);
  return form;
}









