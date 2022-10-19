'use strict';

const getSongData = require('./../../../server/napster/getSongData');

describe('Should get up to 5 tracks from napster api', () => {
  test('should return the top five search results', async () => {
    const response = await getSongData('heat waves', 'glass animals');
    
    expect(response.length).toEqual(5);
    expect(response[0].name).toBeDefined();
    expect(response[0].artist).toBeDefined();
    expect(response[0].uri).toBeDefined();
  });

  test('Should catch an error and return an empty array for no query strings', async () => {
    const response = await getSongData();
    expect(response).toEqual([]);
  });

  test('Should catch an error and return an empty array for empty strings for query strings', async () => {
    const response = await getSongData('', '');
    expect(response).toEqual([]);
  });
});