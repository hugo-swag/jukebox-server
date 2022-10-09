'use strict';

class MusicQueue {

  constructor() {
    this.songList = [];    
  }

  addSong(song) {
    this.songList.push(song);
    this.songList.sort((prevSong, currSong) => currSong.bid - prevSong.bid);
  }

  bid(song) {

    const nowPlaying = this.songList.shift();

    const foundIndex = this.songList.findIndex(currSong => currSong.songId === song.songId);
    if(foundIndex > -1) {
      this.songList[foundIndex].bid = song.bid;
      this.songList.sort((prevSong, currSong) => currSong.bid - prevSong.bid);
    }  
    
    this.songList.unshift(nowPlaying);
  }

  removeSong(){
    return this.songList.shift();
  } 
}

module.exports = MusicQueue;




