// mock auth middleware
// const User = require('../models/user');

module.exports = function(req, res, next) {
  
  /*
  const username = req.cookies['username'];
  let user;
  user = User.findOne({where: {username: username}})
  if(!user) {
    user = User.create({username});
  }
  req.user = user;
  */
  req.user = {username: 'user1', id: 1};
  next();
};
