'use strict';

const users = require('../../models/user');

module.exports = async (socket, next) => {

  try {

    if (!socket.token) { _authError(); }
    //takes in a variable in  the header called token that has the token given when you sign in
    const validUser = await users.authenticateToken(socket.token);
    socket.user = validUser;
    //req 
    next();

  } catch (e) {
    _authError();
  }

  function _authError() {
    next('Invalid login');
  }
};
