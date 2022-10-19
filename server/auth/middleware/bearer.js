'use strict';

const users = require('../../models/user');

module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { _authError(); }
    //takes in a variable in  the header called authorization that has the token given when you sign in, we de
    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateToken(token);
    req.user = validUser;
    req.token = validUser.token;
    //req 
    next();

  } catch (e) {
    _authError();
  }

  function _authError() {
    next('Invalid Login');
  }
};
