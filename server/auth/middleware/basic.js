'use strict';

const base64 = require('base-64');
const users = require('../../models/user');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) {
    return _authError();
  }
  let basic = req.headers.authorization.split(' ').pop();
  let [username, password] = base64.decode(basic).split(':');

  try {
    req.user = await users.authenticateBasic(username, password);
    next();
  } catch (e) {
    console.error(e);
    res.status(403).send('Invalid Login');
  }

  function _authError() {
    res.status(403).send('Did not send the any information in the header');
  }
};
