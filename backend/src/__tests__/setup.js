const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// Тестовая база данных в памяти SQLite
const sequelize = new Sequelize('sqlite::memory', {
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false
});

const roles = {
  ENGINEER: 'engineer',
  MANAGER: 'manager',
  OBSERVER: 'observer'
};

// Определяем модели напрямую для тестов
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  fullName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true }
});

const Project = sequelize.define('Project', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  stage: { type: DataTypes.STRING }
});

const Defect = sequelize.define('Defect', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  priority: { type: DataTypes.STRING, defaultValue: 'medium' },
  status: { type: DataTypes.STRING, defaultValue: 'new' },
  dueDate: { type: DataTypes.DATE }
});

const Attachment = sequelize.define('Attachment', {
  filename: { type: DataTypes.STRING, allowNull: false },
  path: { type: DataTypes.STRING, allowNull: false }
});

// Настройка связей
Project.hasMany(Defect, { foreignKey: 'projectId', as: 'defects' });
Defect.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Defect, { foreignKey: 'assigneeId', as: 'assignedDefects' });
Defect.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });

User.hasMany(Defect, { foreignKey: 'createdById', as: 'createdDefects' });
Defect.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

Defect.hasMany(Attachment, { foreignKey: 'defectId', as: 'attachments' });
Attachment.belongsTo(Defect, { foreignKey: 'defectId' });

module.exports = {
  sequelize,
  User,
  Project,
  Defect,
  Attachment,
  roles
};
