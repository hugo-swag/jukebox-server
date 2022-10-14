'use strict';

const updateQueueList = require('../../public/client/app.js');

let socket = {
  emit: jest.fn(),
  on: jest.fn(),
};

let localQueue = [];

const payload = {
  test: 'test',
};

describe('testing the socket', () => {
  test('Should send the queue', () => {
    updateQueueList(socket, test);
    expect(socket.on).toBeTruthy();
    expect(socket.emit).toBeTruthy();
    expect(localQueue).toEqual(payload);
    expect(socket.emit).toHaveBeenCalledWith('test', {
      test: 'test',
    });
  });
});
