require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'supersecret',
  expiresIn: process.env.JWT_EXPIRE || '7d',
};