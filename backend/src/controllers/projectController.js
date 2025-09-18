const { Project } = require('../models');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Проект не найден.' });
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description, stage } = req.body;
    const project = await Project.create({ name, description, stage });
    res.status(201).json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description, stage } = req.body;
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Проект не найден.' });
    await project.update({ name, description, stage });
    res.json(project);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Проект не найден.' });
    await project.destroy();
    res.json({ message: 'Проект удалён.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};