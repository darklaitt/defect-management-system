import React, { useState } from 'react';

const DefectsPage = () => {
  // Mock-данные для дефектов
  const [defects, setDefects] = useState([
    { id: 1, title: 'Трещина в фундаменте', status: 'Новая', priority: 'Высокий' },
    { id: 2, title: 'Неровная кладка стен', status: 'В работе', priority: 'Средний' },
    { id: 3, title: 'Протечка кровли', status: 'Закрыта', priority: 'Критический' }
  ]);

  const [newDefect, setNewDefect] = useState({ title: '', status: 'Новая', priority: 'Средний' });

  const handleCreate = () => {
    // Простая логика создания
    const defect = { ...newDefect, id: Date.now() };
    setDefects([...defects, defect]);
    setNewDefect({ title: '', status: 'Новая', priority: 'Средний' }); // Сброс формы
  };

  const handleDelete = (id) => {
    setDefects(defects.filter(defect => defect.id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Управление дефектами</h2>

      {/* Форма создания */}
      <div>
        <h3>Добавить новый дефект</h3>
        <input
          type="text"
          placeholder="Название дефекта"
          value={newDefect.title}
          onChange={(e) => setNewDefect({...newDefect, title: e.target.value})}
        />
        <button onClick={handleCreate}>Добавить</button>
      </div>

      {/* Список дефектов */}
      <div>
        <h3>Список дефектов</h3>
        <ul>
          {defects.map(defect => (
            <li key={defect.id}>
              <strong>{defect.title}</strong> - {defect.status} ({defect.priority})
              <button onClick={() => handleDelete(defect.id)} style={{ marginLeft: '1rem' }}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export {DefectsPage};