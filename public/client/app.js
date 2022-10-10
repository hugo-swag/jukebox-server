'use strict';

// eslint-disable-next-line no-undef
const socket = io();
const songForm = document.querySelector('#addSongForm');
const queueDiv = document.querySelector('ol');
const nowPlayingHeader = document.querySelector('#nowPlaying');
const currentRoomDisplay = document.querySelector('#currentRoom');

let localQueue = [];

let currentRoom = 'main';
let roomList = [];

// get room list on initial connection, update the list when one is added
socket.on('room-list', updatedList => {
  roomList = updatedList;
  showRoomList();
});

// only update the song playing when you enter and when the song changes
socket.on('update-playing-and-queue', (updatedQueue) => {
  localQueue = updatedQueue;
  try {
    if(localQueue.songList !== 0) {
      showPlaying(localQueue.songList[0]);
      updateQueueList();
    } 
  } catch(e) {
    console.log('empty song list, cannot update queue');
  }
});

// update the queue whenever songs are added and bided on
socket.on('update-queue', (updatedQueue) => {
  localQueue = updatedQueue;
  try {
    if(localQueue.songList) {
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
  handleAddSong(name, artist, bid, 10000);
});

function handleAddSong (name, artist, bid, songLength) {
  if(isNaN(bid)) bid = 0;
  const song = {
    clientId: socket.id,
    name: name,
    artist: artist,
    bid: bid,
    songLength: songLength,
    room: currentRoom,
  };
  socket.emit('add', song);
}

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
  if(song) {
    nowPlayingHeader.innerHTML = `Now Playing: ${song.name} by ${song.artist}`;
  } else {
    nowPlayingHeader.innerHTML = 'Add Songs to Queue to Play Song';
  }

  // add an audio tag and src from the data we get from spotify api
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

function addCreateRoomListener() {
  const createRoomForm = document.querySelector('#createRoomForm');
  createRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newRoom = e.target.roomName.value;
    socket.emit('create-room', {currentRoom: currentRoom, newRoom: newRoom});
    currentRoom = newRoom;
    currentRoomDisplay.innerHTML = `Current Room ${currentRoom}`;
    showPlaying();
  });
}
addCreateRoomListener();

function joinRoom(room) {
  socket.emit('join-room', {currentRoom: currentRoom, newRoom: room});
  currentRoom = room;
  currentRoomDisplay.innerHTML = `Current Room ${room}`;
}

function showRoomList() {
  const rooms = document.querySelector('#rooms');
  rooms.innerHTML = '';
  for(let room of roomList) {
    const roomLi = document.createElement('li');
    roomLi.innerHTML = room;
    roomLi.addEventListener('click', () => joinRoom(room));
    rooms.appendChild(roomLi);
  }
}









