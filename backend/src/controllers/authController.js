const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const roles = require('../config/roles');

exports.register = async (req, res) => {
  try {
    const { username, password, role, fullName, email } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Необходимо указать имя пользователя, пароль и роль.' });
    }
    if (!Object.values(roles).includes(role)) {
      return res.status(400).json({ error: 'Недопустимая роль.' });
    }
    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ error: 'Пользователь с таким именем уже существует.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash, role, fullName, email });
    res.status(201).json({ id: user.id, username: user.username, role: user.role });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Пользователь не найден.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Неверный пароль.' });
    const token = jwt.sign({ id: user.id, role: user.role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, fullName: user.fullName, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};