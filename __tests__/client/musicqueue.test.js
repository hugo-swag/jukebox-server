'use strict';

let removeSong = require('../../server/MusicQueue/index.js');
let addSong = require('../../server/MusicQueue/index.js');
let bid = require('../../server/MusicQueue/index.js');

let songList = ['testingVar'];
// let queueName = 'queueNameTest';
let song  = 'testSong';
let prevSong = 'prevSongTest';
let currSong = 'currSongTest';
// let songId = 'songIdTest';

function push() {return jest.fn()};
function sort() {return jest.fn()};
function unshift() {return jest.fn()};
function findIndex() {return jest.fn()};
function shift() {return jest.fn()};

describe('testing remove song', () => {
  test('Should remove a song', () => {
    new removeSong();
    expect(shift()).toBeTruthy();
    expect(songList).toEqual(['testingVar']);
    expect(new removeSong()).toEqual({songList: [], queueName: undefined});
    expect(songList.shift()).toEqual('testingVar');
  });
});

describe('testing add song function', () => {
  test('Should add a song', () => {
    new addSong();
    expect(push()).toBeTruthy();
    expect(sort()).toBeTruthy();
    expect(songList).toEqual([]);
    expect(new addSong(song)).toEqual({songList: [], queueName: 'testSong'});
    expect(songList.push(song)).toEqual(1);
    expect(songList.sort((prevSong, currSong) => currSong.bid - prevSong.bid)).toEqual(['testSong']);
  });
});

describe('testing bid function', () => {
  test('Should bid for a song', () => {
    new bid();
    expect(shift()).toBeTruthy();
    expect(findIndex()).toBeTruthy();
    expect(sort()).toBeTruthy();
    expect(unshift()).toBeTruthy();
    expect(songList).toEqual(['testSong']);
    expect(new bid(song)).toEqual({songList: [], queueName: 'testSong'});
    expect(songList.push(song)).toEqual(2);
    expect(songList.sort((prevSong, currSong) => currSong.bid - prevSong.bid)).toEqual(['testSong', 'testSong']);
    // test nowPlaying
    // test foundIndex
  });
});