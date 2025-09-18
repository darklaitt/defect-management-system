const sequelize = require('../config/db');
const User = require('./user');
const Project = require('./project');
const Defect = require('./defect');
const Comment = require('./comment');
const Attachment = require('./attachment');

// Связи
Project.hasMany(Defect, { foreignKey: 'projectId', as: 'defects' });
Defect.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Defect, { foreignKey: 'assigneeId', as: 'assignedDefects' });
Defect.belongsTo(User, { foreignKey: 'assigneeId', as: 'assignee' });

User.hasMany(Defect, { foreignKey: 'createdById', as: 'createdDefects' });
Defect.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

Defect.hasMany(Comment, { foreignKey: 'defectId', as: 'comments' });
Comment.belongsTo(Defect, { foreignKey: 'defectId' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'userComments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Defect.hasMany(Attachment, { foreignKey: 'defectId', as: 'attachments' });
Attachment.belongsTo(Defect, { foreignKey: 'defectId' });

module.exports = {
  sequelize,
  User,
  Project,
  Defect,
  Comment,
  Attachment,
};