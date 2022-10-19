const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');

const Recipient = sequelize.define('Recipient', {
  name: DataTypes.STRING,
  manager: DataTypes.INTEGER // userId
});

Recipient.sync().then((res) => {
  console.log("Sync User Model", res);
}).catch((err) => {
  console.log("Couldn't sync User Model", err)
});

module.exports = Recipient;