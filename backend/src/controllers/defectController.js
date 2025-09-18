const { Defect, Project, User, Comment, Attachment } = require('../models');

exports.getAllDefects = async (req, res) => {
  try {
    const defects = await Defect.findAll({
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'assignee', attributes: ['id', 'username', 'fullName'] },
        { model: User, as: 'createdBy', attributes: ['id', 'username', 'fullName'] }
      ]
    });
    res.json(defects);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getDefectById = async (req, res) => {
  try {
    const defect = await Defect.findByPk(req.params.id, {
      include: [
        { model: Project, as: 'project' },
        { model: User, as: 'assignee', attributes: ['id', 'username', 'fullName'] },
        { model: User, as: 'createdBy', attributes: ['id', 'username', 'fullName'] },
        { model: Comment, include: [{ model: User, attributes: ['id', 'username', 'fullName'] }] },
        { model: Attachment }
      ]
    });
    if (!defect) return res.status(404).json({ error: 'Дефект не найден.' });
    res.json(defect);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createDefect = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, projectId, assigneeId } = req.body;
    const defect = await Defect.create({
      title, description, priority, status, dueDate,
      projectId, assigneeId, createdById: req.user.id
    });
    res.status(201).json(defect);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateDefect = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, assigneeId } = req.body;
    const defect = await Defect.findByPk(req.params.id);
    if (!defect) return res.status(404).json({ error: 'Дефект не найден.' });
    await defect.update({ title, description, priority, status, dueDate, assigneeId });
    res.json(defect);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteDefect = async (req, res) => {
  try {
    const defect = await Defect.findByPk(req.params.id);
    if (!defect) return res.status(404).json({ error: 'Дефект не найден.' });
    await defect.destroy();
    res.json({ message: 'Дефект удалён.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};