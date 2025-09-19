require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.sync(); // создаёт таблицы по моделям, если их нет
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.error('Failed to start server:', e);
  }
})();