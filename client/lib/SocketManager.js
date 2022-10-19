const io = require('socket.io-client');



class SocketManager {
  constructor() {
    this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJyb29rZSIsImlhdCI6MTY2NjIxNTk5OX0.TNu6X-aUBQ2e6-wWqw9_vNFgCG7LWBNYt1q4dW3jnq8';
    this.socket = io('http://localhost:3000',
      {
        auth: {
          token: this.token,
        },
      },
    );
    this.socket.on('room-list', (payload) => {
      if (this.onRoomListCallback) {
        this.onRoomListCallback(payload);
      }
    });
    this.socket.on('update-playing-and-queue', (payload) => {
      if (this.onUpdatePlayingAndQueueCallback) { this.onUpdatePlayingAndQueueCallback(payload); }
    });
    this.socket.on('update-queue', (payload) => {
      if (this.onUpdateQueueCallback) {
        this.onUpdateQueueCallback(payload);
      }
    });
    this.socket.on('search-results', (payload) => {
      if (this.onReceiveSearchResultsCallback) {
        this.onReceiveSearchResultsCallback(payload);
      }
    });
    this.socket.on('connect_error', (e) => {
      console.log(e);
    });
  }

  // create or join
  createRoom(roomName, oldRoom) {
    this.socket.emit('create-room', { currentRoom: oldRoom, newRoom: roomName });
  }

  joinRoom(roomName, oldRoom) {
    this.socket.emit('join-room', { currentRoom: oldRoom, newRoom: roomName });
  }

  // song object
  // const song = {
  //   clientId: socket.id,
  //   name: name,
  //   artist: artist,
  //   bid: bid,
  //   uri: uri,
  //   songLength: songLength,
  //   room: currentRoom,
  // };

  searchSong(song) {
    this.socket.emit('search-song', song);
  }

  addSong(song) {
    song.clientId = this.socket.id;
    this.socket.emit('add', song);
  }

  bidOnSong(song) {
    this.socket.emit('bid', song);
  }

  onRoomList(fn) {
    this.onRoomListCallback = fn;
  }

  onUpdatePlayingAndQueue(fn) {
    this.onUpdatePlayingAndQueueCallback = fn;
  }

  onUpdateQueue(fn) {
    this.onUpdateQueueCallback = fn;
  }

  onReceiveSearchResults(fn) {
    this.onReceiveSearchResultsCallback = fn;
  }
}

module.exports = SocketManager;