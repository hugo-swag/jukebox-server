'use strict';

const getSongData = require('./../../../server/napster/getSongData');

describe('Should get up to 5 tracks from napster api', () => {
  test('', async () => {
    const response = await getSongData('heat waves', 'glass animals');
    console.log(response);
  });
});