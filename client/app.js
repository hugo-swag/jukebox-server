'use strict';

const SocketManager = require('./lib/SocketManager');

// eslint-disable-next-line no-undef
const socketManger = new SocketManager();
const songForm = document.querySelector('#addSongForm');
const queueDiv = document.querySelector('ol');
const nowPlayingHeader = document.querySelector('#nowPlaying');
const currentRoomDisplay = document.querySelector('#currentRoom');

let localQueue = [];

let currentRoom = 'main';
let roomList = [];

// get room list on initial connection, update the list when one is added
socketManger.onRoomList(updatedList => {
  roomList = updatedList;
  showRoomList();
});

// only update the song playing when you enter and when the song changes
//socket.on('update-playing-and-queue', (updatedQueue) => {
socketManger.onUpdatePlayingAndQueue((updatedQueue) => {
  localQueue = updatedQueue;
  try {
    if (localQueue.songList !== 0) {
      showPlaying(localQueue.songList[0]);
      updateQueueList();
    } 
  } catch (e) {
    console.log('empty song list, cannot update queue');
  }
});

// update the queue whenever songs are added and bided on
//socket.on('update-queue', (updatedQueue) => {
socketManger.onUpdateQueue((updatedQueue) => {
  localQueue = updatedQueue;
  try {
    if (localQueue.songList) {
      updateQueueList();
    }
  } catch (e) {
    console.log('empty song list, cannot update queue');
  }
});

socketManger.onReceiveSearchResults((searchResults) => {
  showSearchResults(searchResults);
});

function showSearchResults(searchResults) {
  const resultsDiv = document.querySelector('#searchResults');
  const ol = document.createElement('ol');

  searchResults.forEach(songData => {
    const li = document.createElement('li');
    
    const songName = document.createElement('p');
    songName.innerHTML = songData.name;
    li.appendChild(songName);
    
    const artist = document.createElement('p');
    artist.innerHTML = songData.artist;
    li.appendChild(artist);

    const bidInput = document.createElement('input');
    bidInput.type = 'number';
    bidInput.value = '0';
    bidInput.min = '0';
    bidInput.id = 'bid';
    li.appendChild(bidInput);

    const addSong = document.createElement('button');
    addSong.innerHTML = 'Select Song';
    addSong.addEventListener('click', (e) => {
      e.preventDefault();
      resultsDiv.innerHTML = '';
      handleAddSong(songData.name, songData.artist, songData.uri, bidInput.value);
    });
    li.appendChild(addSong);

    ol.appendChild(li);
  });
  resultsDiv.appendChild(ol);
}


songForm.addEventListener('submit', handleSearchSong);

function handleSearchSong(e) {
  e.preventDefault();
  const song = {
    name: e.target.songName.value,
    artist: e.target.artist.value,
  };
  socketManger.searchSong(song);
}

function handleAddSong(name, artist, uri, bid) {
  const song = {
    name: name,
    artist: artist,
    bid: bid,
    uri: uri,
    room: currentRoom,
    songLength: 30000,
  };
  socketManger.addSong(song);
}

function updateQueueList() {
  queueDiv.innerHTML = '';
  const songList = localQueue.songList;

  for (let index = 1; index < songList.length; index++) {
    const li = document.createElement('li');
    li.innerHTML = `${songList[index].name} by ${songList[index].artist}: current bid at ${songList[index].bid}`;
    const form = getBidForm(songList[index]);
    li.appendChild(form);
    queueDiv.appendChild(li);
  }
}

function showPlaying(song) {
  if (song) {
    nowPlayingHeader.innerHTML = `Now Playing: ${song.name} by ${song.artist}`;
  } else {
    nowPlayingHeader.innerHTML = 'Add Songs to Queue to Play Song';
  }

  const audioDiv = document.querySelector('#currentlyPlayingAudio');
  audioDiv.innerHTML = '';
  const audio = new Audio(song.uri);
  audio.autoplay = true;
  audioDiv.appendChild(audio);

}

function handleBid(song, bid) {
  if (!isNaN(parseInt(bid))) {
    song.bid += parseInt(bid);
    socketManger.bidOnSong(song);
  }
}

function getBidForm(song) {
  try {
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
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
  } catch (e) {
    console.log(e);
  }
}

function addCreateRoomListener() {
  const createRoomForm = document.querySelector('#createRoomForm');
  createRoomForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newRoom = e.target.roomName.value;
    e.target.roomName.value = '';
    socketManger.createRoom(newRoom, currentRoom);
    currentRoom = newRoom;
    currentRoomDisplay.innerHTML = `Current Room ${currentRoom}`;
    showPlaying();
  });
}
addCreateRoomListener();

function joinRoom(room) {
  socketManger.joinRoom(room, currentRoom);
  currentRoom = room;
  currentRoomDisplay.innerHTML = `Current Room ${room}`;
}

function showRoomList() {
  const rooms = document.querySelector('#rooms');
  rooms.innerHTML = '';
  for (let room of roomList) {
    const roomLi = document.createElement('li');
    roomLi.innerHTML = room;
    roomLi.addEventListener('click', () => joinRoom(room));
    rooms.appendChild(roomLi);
  }
}
