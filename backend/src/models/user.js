const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const roles = require('../config/roles');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM(...Object.values(roles)), allowNull: false },
  fullName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true }
});

module.exports = User;