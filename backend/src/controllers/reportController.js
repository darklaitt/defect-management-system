const { Defect, Project, User } = require('../models');
const { Parser } = require('json2csv');

// Получить аналитику по проекту
exports.getProjectReport = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Проверяем существование проекта
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }

    // Получаем все дефекты проекта
    const defects = await Defect.findAll({
      where: { projectId },
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'username', 'fullName'] },
        { model: User, as: 'createdBy', attributes: ['id', 'username', 'fullName'] }
      ]
    });

    // Подсчёт статистики
    const totalDefects = defects.length;
    const byStatus = {
      new: defects.filter(d => d.status === 'new').length,
      in_progress: defects.filter(d => d.status === 'in_progress').length,
      review: defects.filter(d => d.status === 'review').length,
      closed: defects.filter(d => d.status === 'closed').length,
      cancelled: defects.filter(d => d.status === 'cancelled').length,
    };
    
    const byPriority = {
      low: defects.filter(d => d.priority === 'low').length,
      medium: defects.filter(d => d.priority === 'medium').length,
      high: defects.filter(d => d.priority === 'high').length,
    };

    // Процент выполнения
    const completedCount = byStatus.closed + byStatus.cancelled;
    const completionRate = totalDefects > 0 ? Math.round((completedCount / totalDefects) * 100) : 0;

    // Дефекты по исполнителям
    const byAssignee = {};
    defects.forEach(d => {
      if (d.assignee) {
        const key = d.assignee.username;
        byAssignee[key] = (byAssignee[key] || 0) + 1;
      } else {
        byAssignee['Не назначен'] = (byAssignee['Не назначен'] || 0) + 1;
      }
    });

    res.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
        stage: project.stage
      },
      statistics: {
        totalDefects,
        completionRate,
        byStatus,
        byPriority,
        byAssignee
      },
      defects: defects.map(d => ({
        id: d.id,
        title: d.title,
        description: d.description,
        priority: d.priority,
        status: d.status,
        dueDate: d.dueDate,
        assignee: d.assignee ? d.assignee.username : null,
        createdBy: d.createdBy ? d.createdBy.username : null,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt
      }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Экспорт дефектов проекта в CSV
exports.exportProjectDefectsCSV = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }

    const defects = await Defect.findAll({
      where: { projectId },
      include: [
        { model: User, as: 'assignee', attributes: ['username'] },
        { model: User, as: 'createdBy', attributes: ['username'] }
      ]
    });

    const csvData = defects.map(d => ({
      'ID': d.id,
      'Название': d.title,
      'Описание': d.description,
      'Приоритет': d.priority,
      'Статус': d.status,
      'Дата выполнения': d.dueDate || 'Не указана',
      'Назначен': d.assignee ? d.assignee.username : 'Не назначен',
      'Создал': d.createdBy ? d.createdBy.username : 'Неизвестно',
      'Создано': new Date(d.createdAt).toLocaleDateString('ru-RU'),
      'Обновлено': new Date(d.updatedAt).toLocaleDateString('ru-RU')
    }));

    const fields = ['ID', 'Название', 'Описание', 'Приоритет', 'Статус', 'Дата выполнения', 'Назначен', 'Создал', 'Создано', 'Обновлено'];
    const parser = new Parser({ fields });
    const csv = parser.parse(csvData);
    
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header('Content-Disposition', `attachment; filename="project_${projectId}_defects.csv"`);
    res.send('\uFEFF' + csv); // BOM для корректного отображения кириллицы в Excel
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Старый метод для совместимости
exports.exportDefectsCSV = async (req, res) => {
  try {
    const defects = await Defect.findAll({
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'assignee' }
      ]
    });
    const fields = ['id', 'title', 'description', 'priority', 'status', 'dueDate'];
    const parser = new Parser({ fields });
    const csv = parser.parse(defects.map(d => d.toJSON()));
    res.header('Content-Type', 'text/csv');
    res.attachment('defects.csv');
    res.send(csv);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};