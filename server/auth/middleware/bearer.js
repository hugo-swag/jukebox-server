'use strict';

const users = require('../../models/user');

module.exports = async (socket, next) => {

  try {
    if (!socket.handshake.auth.token) { console.log('invalid token'); }
    //takes in a variable in  the header called token that has the token given when you sign in
    const validUser = await users.authenticateToken(socket.handshake.auth.token);
    socket.user = validUser;
    //req 
    next();

  } catch (e) {
    console.log('invalid token');
  }
};
