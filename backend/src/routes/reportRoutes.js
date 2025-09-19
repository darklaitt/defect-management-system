const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// Экспорт дефектов в CSV (только для менеджеров и выше)
router.get('/defects/csv', auth, roles(['manager', 'observer']), reportController.exportDefectsCSV);

module.exports = router;