const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');

const User = sequelize.define('User', {
  username: DataTypes.STRING,
});

User.sync().then((res) => {
  console.log("Sync User Model", res);
}).catch((err) => {
  console.log("Couldn't sync User Model", err)
});

module.exports = User;