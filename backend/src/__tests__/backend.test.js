const { sequelize, User, Project, Defect } = require('./setup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Backend Tests - 7 Tests', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  afterEach(async () => {
    await User.destroy({ where: {}, force: true });
    await Project.destroy({ where: {}, force: true });
    await Defect.destroy({ where: {}, force: true });
  });

  // Test 1: User Model - Создание пользователя
  test('1. Должен создать пользователя с корректными данными', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await User.create({
      username: 'testuser',
      password: hashedPassword,
      role: 'engineer',
      fullName: 'Test User',
      email: 'test@example.com'
    });

    expect(user.username).toBe('testuser');
    expect(user.role).toBe('engineer');
    expect(user.email).toBe('test@example.com');
    expect(user.id).toBeDefined();
  });

  // Test 2: User Model - Проверка хеширования пароля
  test('2. Должен правильно хешировать и проверять пароль', async () => {
    const plainPassword = 'mySecretPassword';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    const user = await User.create({
      username: 'secureuser',
      password: hashedPassword,
      role: 'observer'
    });

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    expect(isMatch).toBe(true);
    
    const wrongMatch = await bcrypt.compare('wrongpassword', user.password);
    expect(wrongMatch).toBe(false);
  });

  // Test 3: JWT Authentication - Генерация токена
  test('3. Должен сгенерировать и проверить JWT токен', async () => {
    const user = await User.create({
      username: 'jwtuser',
      password: await bcrypt.hash('password', 10),
      role: 'manager'
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      'test_secret',
      { expiresIn: '1h' }
    );

    expect(token).toBeDefined();
    
    const decoded = jwt.verify(token, 'test_secret');
    expect(decoded.username).toBe('jwtuser');
    expect(decoded.role).toBe('manager');
  });

  // Test 4: Project Model - Создание и обновление проекта
  test('4. Должен создать и обновить проект', async () => {
    const project = await Project.create({
      name: 'Test Project',
      description: 'Initial description',
      stage: 'development'
    });

    expect(project.name).toBe('Test Project');
    
    await project.update({ stage: 'testing', name: 'Updated Project' });
    
    const updatedProject = await Project.findByPk(project.id);
    expect(updatedProject.name).toBe('Updated Project');
    expect(updatedProject.stage).toBe('testing');
  });

  // Test 5: Defect Model - Создание дефекта с связями
  test('5. Должен создать дефект со связями User и Project', async () => {
    const user = await User.create({
      username: 'developer',
      password: await bcrypt.hash('pass', 10),
      role: 'engineer'
    });

    const project = await Project.create({
      name: 'Defect Project',
      description: 'Project for defects'
    });

    const defect = await Defect.create({
      title: 'Critical Bug',
      description: 'System crashes on startup',
      priority: 'high',
      status: 'new',
      projectId: project.id,
      assigneeId: user.id,
      createdById: user.id
    });

    expect(defect.title).toBe('Critical Bug');
    expect(defect.priority).toBe('high');
    expect(defect.projectId).toBe(project.id);
    expect(defect.assigneeId).toBe(user.id);
  });

  // Test 6: Defect Model - Фильтрация по статусу
  test('6. Должен фильтровать дефекты по статусу', async () => {
    const user = await User.create({
      username: 'tester',
      password: await bcrypt.hash('pass', 10),
      role: 'engineer'
    });

    const project = await Project.create({
      name: 'Test Project'
    });

    await Defect.create({
      title: 'Open Bug 1',
      status: 'new',
      priority: 'medium',
      projectId: project.id,
      createdById: user.id
    });

    await Defect.create({
      title: 'Open Bug 2',
      status: 'new',
      priority: 'low',
      projectId: project.id,
      createdById: user.id
    });

    await Defect.create({
      title: 'Closed Bug',
      status: 'closed',
      priority: 'high',
      projectId: project.id,
      createdById: user.id
    });

    const newDefects = await Defect.findAll({ where: { status: 'new' } });
    const closedDefects = await Defect.findAll({ where: { status: 'closed' } });

    expect(newDefects).toHaveLength(2);
    expect(closedDefects).toHaveLength(1);
  });

  // Test 7: Business Logic - Статистика дефектов для отчета
  test('7. Должен подсчитать статистику дефектов для отчета', async () => {
    const user = await User.create({
      username: 'manager',
      password: await bcrypt.hash('pass', 10),
      role: 'manager'
    });

    const project = await Project.create({
      name: 'Report Project'
    });

    await Defect.create({
      title: 'Bug 1',
      status: 'new',
      priority: 'high',
      projectId: project.id,
      createdById: user.id
    });

    await Defect.create({
      title: 'Bug 2',
      status: 'in_progress',
      priority: 'medium',
      projectId: project.id,
      createdById: user.id
    });

    await Defect.create({
      title: 'Bug 3',
      status: 'closed',
      priority: 'low',
      projectId: project.id,
      createdById: user.id
    });

    const allDefects = await Defect.findAll({ where: { projectId: project.id } });
    
    const stats = {
      total: allDefects.length,
      byStatus: {
        new: allDefects.filter(d => d.status === 'new').length,
        in_progress: allDefects.filter(d => d.status === 'in_progress').length,
        closed: allDefects.filter(d => d.status === 'closed').length
      },
      byPriority: {
        high: allDefects.filter(d => d.priority === 'high').length,
        medium: allDefects.filter(d => d.priority === 'medium').length,
        low: allDefects.filter(d => d.priority === 'low').length
      }
    };

    expect(stats.total).toBe(3);
    expect(stats.byStatus.new).toBe(1);
    expect(stats.byStatus.in_progress).toBe(1);
    expect(stats.byStatus.closed).toBe(1);
    expect(stats.byPriority.high).toBe(1);
    expect(stats.byPriority.medium).toBe(1);
    expect(stats.byPriority.low).toBe(1);
  });
});
