import React, { useState, useEffect } from 'react';
import { Container, Table, Form, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const DefectsPage = () => {
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const [newDefect, setNewDefect] = useState({ 
    title: '', 
    description: '',
    status: 'new', 
    priority: 'medium' 
  });

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

  const handleCreate = async () => {
    if (!token) {
      setError('Необходима авторизация');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/defects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newDefect)
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании дефекта');
      }

      const createdDefect = await response.json();
      setDefects([...defects, createdDefect]);
      setNewDefect({ title: '', description: '', status: 'new', priority: 'medium' });
    } catch (err) {
      setError(err.message);
    }
  };

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
      <h2 className="my-4">Управление дефектами</h2>

      <Form className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Название дефекта</Form.Label>
          <Form.Control
            type="text"
            placeholder="Введите название дефекта"
            value={newDefect.title}
            onChange={(e) => setNewDefect({...newDefect, title: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Описание</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Введите описание дефекта"
            value={newDefect.description}
            onChange={(e) => setNewDefect({...newDefect, description: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Приоритет</Form.Label>
          <Form.Select
            value={newDefect.priority}
            onChange={(e) => setNewDefect({...newDefect, priority: e.target.value})}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" onClick={handleCreate}>
          Добавить дефект
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
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
              <td>{defect.id}</td>
              <td>{defect.title}</td>
              <td>{defect.status}</td>
              <td>{defect.priority}</td>
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