const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Defect = sequelize.define('Defect', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  priority: { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' },
  status: { type: DataTypes.ENUM('new', 'in_progress', 'review', 'closed', 'cancelled'), defaultValue: 'new' },
  dueDate: { type: DataTypes.DATE },
});

module.exports = Defect;