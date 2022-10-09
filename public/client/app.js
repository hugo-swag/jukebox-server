'use strict';

// eslint-disable-next-line no-undef
const socket = io();
const songForm = document.querySelector('form');
const queueDiv = document.querySelector('ul');
const nowPlayingHeader = document.querySelector('#nowPlaying');

let localQueue = [];

// server sends queue as soon as a client joins
socket.on('send-queue', (payload) => {
  localQueue = payload;
  try {
    if(localQueue.songList) {
      showPlaying(localQueue.songList[0]);
      updateQueueList();
    } 
  } catch(e) {
    console.log('empty song list, cannot update queue');
  }
});

socket.on('update-queue', (payload) => {
  localQueue = payload;
  try {
    if(localQueue.songList) {
      showPlaying(localQueue.songList[0]);
      updateQueueList();
    } 
  } catch(e) {
    console.log('empty song list, cannot update queue');
  }
});

socket.on('next', (payload) => {
  localQueue = payload;
  try {
    if(localQueue.songList) {
      showPlaying(localQueue.songList[0]);
      updateQueueList();
    } 
  } catch(e) {
    console.log('empty song list, cannot update queue');
  }
});


songForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target.songName.value;
  const artist = e.target.artist.value;
  const bid = parseInt(e.target.bid.value);
  handleAddSong(name, artist, bid, 60000);
});

function updateQueueList() {
  queueDiv.innerHTML = '';
  const songList = localQueue.songList;

  for(let index = 1; index < songList.length; index++) {
    const li = document.createElement('li');
    li.innerHTML = `${songList[index].name} by ${songList[index].artist}: current bid at ${songList[index].bid}`;
    const form = getBidForm(songList[index]);
    li.appendChild(form);
    queueDiv.appendChild(li);
  }
}

function showPlaying(song) {
  nowPlayingHeader.innerHTML = `Now Playing: ${song.name} by ${song.artist}`;

  // add an audio tag and src from the data we get from spotify api
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









