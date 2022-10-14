'use strict';

const removeSong = require('../../server/MusicQueue/index.js');
const playNextSong = require('../../server/MusicQueue/index.js');
let bid = require('../../server/MusicQueue/index.js');

let socket = {
  emit: jest.fn(),
  on: jest.fn(),
};

const queue = {
  test: 'testQueue',
};

const payload = {
  test: 'testPayload',
};

jest.mock('chance', () => {
  return jest.fn().mockImplementation(() => {
    return {
      guid: () => 'test-id',
    };
  });
});

jest.mock('../../server/MusicQueue/index.js', () => {
  return jest.fn().mockImplementation(() => {
    return 'testQueue';
  });
});

describe('testing the socket', () => {
  test('Should send the queue', () => {
    removeSong();
    console.log(io.socket.emit);
    expect(socket.on).toBeTruthy();
    expect(socket.emit).toBeTruthy();
    expect(socket.emit).toHaveBeenCalledWith('test', {
      test: 'test',
    });
  });
});

describe('testing the socket', () => {
  test('Should send the queue', () => {
    playNextSong();
    expect(socket.on).toBeTruthy();
    expect(socket.emit).toBeTruthy();
    expect(socket.emit).toHaveBeenCalledWith('update-queue', {
      test: 'test',
    });
  });
});

describe('testing the bid handler', () => {
  test('Should emit a proper bid event with a socket, song, and bid value', () => {
    let socket = {
      emit: jest.fn(),
      on: jest.fn(),
    };
    let song = {
      bid: 0,
    };
    let bid = 1;

    bid(socket, song, bid);
    expect(song.bid).toBeTruthy();
    expect(song.bid).toEqual(1);
    expect(socket.emit).toHaveBeenCalled('bid', {
      bid: bid,
    });
  });
});