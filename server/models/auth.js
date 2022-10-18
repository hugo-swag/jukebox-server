// mock auth middleware

module.exports = function(req, res, next) {
  const username = req.cookies['username'];
  req.user = { username };
  next();
}