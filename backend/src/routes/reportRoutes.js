const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// Получить отчёт по проекту (статистика + данные)
router.get('/projects/:projectId', auth, reportController.getProjectReport);

// Экспорт дефектов проекта в CSV
router.get('/projects/:projectId/csv', auth, reportController.exportProjectDefectsCSV);

// Экспорт всех дефектов в CSV (старый метод, для совместимости)
router.get('/defects/csv', auth, roles(['manager', 'observer']), reportController.exportDefectsCSV);

module.exports = router;