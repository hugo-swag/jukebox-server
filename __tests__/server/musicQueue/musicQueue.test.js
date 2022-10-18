'use strict';

const MusicQueue = require('../../../server/MusicQueue/index');

describe('Test music queue instantiation and methods', () => {
  test('instantiate the queue should create array and name', () => {
    const queue = new MusicQueue('test');
    expect(queue.songList).toEqual([]);
    expect(queue.queueName).toEqual('test');
  });

  test('Songs should be added and remove in first in first out order', () => {
    const queue = new MusicQueue('tests');
    queue.addSong({songName: 'testSong'});
    queue.addSong({songName: 'testSong2'});
    expect(queue.songList[0].songName).toEqual('testSong');
    expect(queue.songList[1].songName).toEqual('testSong2');

    const removedSong = queue.removeSong();
    expect(removedSong.songName).toEqual('testSong');
    expect(queue.songList[0].songName).toEqual('testSong2');   
  });

  test('Songs should be sorted when bid on', () => {
    const queue = new MusicQueue('test');
    queue.addSong({songName: 'songZero', bid: 0, songId: 0});
    queue.addSong({songName: 'songTwo', bid: 2, songId: 2});
    queue.addSong({songName: 'songOne', bid: 1, songId: 1});
    queue.addSong({songName: 'songThree', bid: 3, songId: 3});

    queue.bid({songName: 'songZero', bid: 4, songId: 0});

    // bid should not change the first song in the list because it is already being played
    // songId zero should be the next song to play because it was bid to 4
    expect(queue.songList[0].songId).toEqual(3);
    expect(queue.songList[1].songId).toEqual(0);
    expect(queue.songList[2].songId).toEqual(2);
    expect(queue.songList[3].songId).toEqual(1);
  });
});