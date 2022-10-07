'use strict';

const handleAddSong = require('../../src/Client/addSong.js');

describe('testing add song', () => {
  test('should emit a song object', () => {
    let socket = {
      emit: jest.fn(),
      on: jest.fn(),
    };
    let clientId = 'testid';
    let name = 'testname';
    let bid = 10;
    handleAddSong(socket, clientId, name, bid);
    expect(socket.emit).toHaveBeenCalledWith('add', {
      clientId,
      songId: 'needs work',
      name,
      bid,
    });
  }); 
});