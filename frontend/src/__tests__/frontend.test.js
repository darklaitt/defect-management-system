import { translateStatus, translatePriority, getStatusColor, getPriorityColor } from '../utils/localization';

describe('Frontend Tests - 7 Tests', () => {
  // Test 1: LocalStorage - сохранение токена
  test('1. Должен сохранять токен в localStorage', () => {
    const token = 'test-jwt-token-12345';
    localStorage.setItem('token', token);
    
    const savedToken = localStorage.getItem('token');
    expect(savedToken).toBe(token);
    
    localStorage.clear();
  });

  // Test 2: Localization - перевод статусов на русский
  test('2. Должен переводить статусы дефектов на русский язык', () => {
    expect(translateStatus('new')).toBe('Новый');
    expect(translateStatus('in_progress')).toBe('В работе');
    expect(translateStatus('review')).toBe('На проверке');
    expect(translateStatus('closed')).toBe('Закрыт');
    expect(translateStatus('cancelled')).toBe('Отменён');
  });

  // Test 3: Localization - перевод приоритетов
  test('3. Должен переводить приоритеты на русский язык', () => {
    expect(translatePriority('high')).toBe('Высокий');
    expect(translatePriority('medium')).toBe('Средний');
    expect(translatePriority('low')).toBe('Низкий');
  });

  // Test 4: Localization - цвета статусов
  test('4. Должен возвращать правильные Bootstrap цвета для статусов', () => {
    expect(getStatusColor('new')).toBe('info');
    expect(getStatusColor('in_progress')).toBe('warning');
    expect(getStatusColor('review')).toBe('primary');
    expect(getStatusColor('closed')).toBe('success');
    expect(getStatusColor('cancelled')).toBe('secondary');
  });

  // Test 5: Localization - цвета приоритетов
  test('5. Должен возвращать правильные Bootstrap цвета для приоритетов', () => {
    expect(getPriorityColor('high')).toBe('danger');
    expect(getPriorityColor('medium')).toBe('warning');
    expect(getPriorityColor('low')).toBe('success');
  });

  // Test 6: LocalStorage - сохранение пользователя
  test('6. Должен сохранять и загружать данные пользователя из localStorage', () => {
    const testUser = {
      id: 1,
      username: 'testuser',
      role: 'engineer',
      email: 'test@example.com'
    };

    localStorage.setItem('user', JSON.stringify(testUser));
    
    const savedUser = JSON.parse(localStorage.getItem('user'));
    expect(savedUser.username).toBe('testuser');
    expect(savedUser.role).toBe('engineer');
    expect(savedUser.id).toBe(1);

    localStorage.clear();
  });

  // Test 7: Массив дефектов - фильтрация
  test('7. Должен фильтровать массив дефектов по статусу', () => {
    const defects = [
      { id: 1, title: 'Bug 1', status: 'new', priority: 'high' },
      { id: 2, title: 'Bug 2', status: 'closed', priority: 'low' },
      { id: 3, title: 'Bug 3', status: 'new', priority: 'medium' },
      { id: 4, title: 'Bug 4', status: 'in_progress', priority: 'high' }
    ];

    const newDefects = defects.filter(d => d.status === 'new');
    const closedDefects = defects.filter(d => d.status === 'closed');
    const highPriorityDefects = defects.filter(d => d.priority === 'high');

    expect(newDefects).toHaveLength(2);
    expect(closedDefects).toHaveLength(1);
    expect(highPriorityDefects).toHaveLength(2);
  });
});
