const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// Только для менеджеров и выше
router.get('/', auth, roles(['manager', 'observer']), userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, roles(['manager']), userController.deleteUser);

module.exports = router;