const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

router.get('/', auth, projectController.getAllProjects);
router.get('/:id', auth, projectController.getProjectById);
router.post('/', auth, roles(['manager']), projectController.createProject);
router.put('/:id', auth, roles(['manager']), projectController.updateProject);
router.delete('/:id', auth, roles(['manager']), projectController.deleteProject);

module.exports = router;