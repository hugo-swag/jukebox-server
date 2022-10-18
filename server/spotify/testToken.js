const getAccessToken = require('./getAccessToken');

getAccessToken()
  .then(response => {
    console.log(response.access_token);
  })
  .catch(e => {
    console.log(e);
    console.log(e.message);
  });