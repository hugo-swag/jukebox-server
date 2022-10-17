'use strict';

const getSongUri = require('./getSongUri');

getSongUri('folsom prison blues', 'johnny cash')
  .then(response => {
    console.log(response);
  })
  .catch(e => {
    console.log(e);
  });
