const { Defect, Project, User } = require('../models');
const { Parser } = require('json2csv');

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