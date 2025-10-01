import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { translateStatus, translatePriority } from '../../utils/localization';

const DefectsPage = () => {
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchDefects = async () => {
    if (!token) {
      setError('Необходима авторизация');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/defects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Ошибка при загрузке дефектов');
      }
      const data = await response.json();
      setDefects(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefects();
  }, [token]);

  const handleDelete = async (id) => {
    if (!token) {
      setError('Необходима авторизация');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/defects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении дефекта');
      }

      setDefects(defects.filter(defect => defect.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <Container>
      <h2 className="my-4">Все дефекты</h2>
      <p className="text-muted">Для создания нового дефекта перейдите в конкретный проект</p>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Название</th>
            <th>Статус</th>
            <th>Приоритет</th>
            <th>Проект</th>
            <th>Назначен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {defects.map(defect => (
            <tr key={defect.id}>
              <td>{defect.title}</td>
              <td>{translateStatus(defect.status)}</td>
              <td>{translatePriority(defect.priority)}</td>
              <td>{defect.project?.name || 'Не указан'}</td>
              <td>{defect.assignee?.username || 'Не назначен'}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(defect.id)}>
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export {DefectsPage};