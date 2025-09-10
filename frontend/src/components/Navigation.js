import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Вход</Link>
      <Link to="/defects" style={{ marginRight: '1rem' }}>Дефекты</Link>
      <Link to="/projects" style={{ marginRight: '1rem' }}>Проекты</Link>
      <Link to="/reports">Отчеты</Link>
    </nav>
  );
};

export {Navigation};