const { User } = require('../models');
const roles = require('../config/roles');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'Пользователь не найден.' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден.' });
    if (role && !Object.values(roles).includes(role)) {
      return res.status(400).json({ error: 'Недопустимая роль.' });
    }
    await user.update({ fullName, email, role });
    res.json({ message: 'Пользователь обновлён.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден.' });
    await user.destroy();
    res.json({ message: 'Пользователь удалён.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};