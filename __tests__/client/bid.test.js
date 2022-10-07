'use strict';

let handleBid = require('../../src/Client/bid.js');

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

    handleBid(socket, song, bid);
    expect(song.bid).toBeTruthy();
    expect(song.bid).toEqual(1);
    expect(socket.emit).toHaveBeenCalled('bid', {
      bid: bid,
    });
  });
});