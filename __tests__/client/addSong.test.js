'use strict';

const handleAddSong = require('../../public/client/app.js');

let socket = {
  emit: jest.fn(),
  on: jest.fn(),
};

describe('testing add song', () => {
  test('should emit a song object', () => {
    let clientId = 'testid';
    let name = 'testName';
    let bid = 1;
    let artist = 'testArtist';
    let songLength = 100;
    handleAddSong(socket, name, artist, bid, songLength);
    expect(socket.emit).toHaveBeenCalledWith('add', {
      clientId,
      name,
      artist,
      bid,
      songLength,
      room: 'needs work',
    });
  }); 
});
