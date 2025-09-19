const express = require('express');
const router = express.Router();
const defectController = require('../controllers/defectController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', auth, defectController.getAllDefects);
router.get('/:id', auth, defectController.getDefectById);
router.post('/', auth, defectController.createDefect);
router.put('/:id', auth, defectController.updateDefect);
router.delete('/:id', auth, defectController.deleteDefect);

// Загрузка вложений к дефекту
router.post('/:id/attachments', auth, upload.single('file'), defectController.addAttachment);

module.exports = router;