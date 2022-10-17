const io = require("socket.io-client");

class SocketManager {
    constructor() {
        this.socket = io();
        this.socket.on('room-list', (payload) => {
            if(this.onRoomListCallback) {
                this.onRoomListCallback(payload);
            }
        });
        this.socket.on('update-playing-and-queue', (payload) => {
            if(this.onUpdatePlayingAndQueueCallback){
                this.onUpdatePlayingAndQueueCallback(payload);
            }
        })
        this.socket.on('update-queue', (payload) => {
            if(this.onUpdateQueueCallback) {
                this.onUpdateQueueCallback(payload);
            }
        });
    }

    // create or join
    createRoom(roomName, oldRoom) {
        this.socket.emit('create-room', {currentRoom: oldRoom, newRoom: roomName});
    }

    joinRoom(roomName, oldRoom) {
        this.socket.emit('join-room', {currentRoom: oldRoom, newRoom: roomName});
    }

    // song object
    // const song = {
    //   clientId: socket.id,
    //   name: name,
    //   artist: artist,
    //   bid: bid,
    //   songLength: songLength,
    //   room: currentRoom,
    // };
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
}

module.exports = SocketManager;