'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'secretString';


const user = sequelize.define('users', {
  username: {
    type: DataTypes.STRING,
    required: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    required: true,
  },
  token: {
    type: DataTypes.VIRTUAL,
    get() {
      return jwt.sign({ username: this.username }, SECRET);
    },
    set(tokenObj) {
      let token = jwt.sign(tokenObj, SECRET);
      return token;
    },
  },
});

//encrypts users password with 10 passes
user.beforeCreate(async (user) => {
  let hashedPass = await bcrypt.hash(user.password, 10);
  user.password = hashedPass;
});

//takes in a username and password and compares it to the users in the database, checking if there is a user with that password
user.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ where: { username } });
  const valid = await bcrypt.compare(password, user.password);
  if (valid) { return user; }
  throw new Error('Invalid User');
};



user.authenticateToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token, SECRET);
    const user = this.findOne({ where: { username: parsedToken.username } });
    if (user) { return user; }
    throw new Error('User Not Found');
  } catch (e) {
    throw new Error(e.message);
  }
};

user.sync().then((res) => {
  console.log('Sync User Model', res);
}).catch((err) => {
  console.log('Couldn\'t sync User Model', err);
});


module.exports = user;

