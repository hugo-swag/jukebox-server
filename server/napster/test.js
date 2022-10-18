const getSongData = require('./getSongData');

getSongData('Mr Brightside', 'the killers')
  .then(response => {
    console.log(response);
  })
  .catch(e => console.log(e));