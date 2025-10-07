import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { translateStatus, translatePriority, getStatusColor, getPriorityColor } from '../../utils/localization';

const DefectsPage = () => {
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();
  const location = useLocation();

  // Получаем поисковый запрос из URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  // Проверка прав
  const canManageDefects = user && (user.role === 'engineer' || user.role === 'manager');

  const fetchDefects = async () => {
    if (!token) {
      setError('Необходима авторизация');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Построение query параметра для поиска из URL
      const queryParams = searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : '';
      
      const response = await fetch(`http://localhost:5000/api/defects${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке дефектов');
      }

      const data = await response.json();
      
      console.log('Ответ API дефектов:', data);
      
      // Убеждаемся, что данные - это массив
      if (Array.isArray(data)) {
        setDefects(data);
        console.log('Загружено дефектов:', data.length);
      } else {
        console.error('Ответ сервера не является массивом:', data);
        setDefects([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setDefects([]); // Устанавливаем пустой массив при ошибке
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefects();
  }, [token, searchQuery]); // Перезагружаем при изменении поискового запроса

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

      // Перезагружаем все дефекты
      fetchDefects();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Container className="mt-4"><div>Загрузка...</div></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">Ошибка: {error}</Alert></Container>;

  return (
    <Container>
      {searchQuery ? (
        <h2 className="my-4">Результаты поиска: "{searchQuery}"</h2>
      ) : (
        <h2 className="my-4">Все дефекты</h2>
      )}

      {!Array.isArray(defects) || defects.length === 0 ? (
        <Alert variant="info">
          <p className="mb-0">
            {searchQuery 
              ? `По запросу "${searchQuery}" дефекты не найдены. Попробуйте изменить поисковый запрос.`
              : 'Дефектов пока нет. Для создания дефекта перейдите в конкретный проект.'
            }
          </p>
        </Alert>
      ) : (
        <>
          {searchQuery && (
            <div className="mb-3">
              <span className="text-muted">
                Найдено дефектов: <strong>{defects.length}</strong>
              </span>
            </div>
          )}
          <Table striped bordered hover responsive>
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
                <td>
                  <Badge bg={getStatusColor(defect.status)}>
                    {translateStatus(defect.status)}
                  </Badge>
                </td>
                <td>
                  <Badge bg={getPriorityColor(defect.priority)}>
                    {translatePriority(defect.priority)}
                  </Badge>
                </td>
                <td>{defect.project?.name || 'Не указан'}</td>
                <td>{defect.assignee?.username || 'Не назначен'}</td>
                <td>
                  {canManageDefects ? (
                    <Button variant="danger" size="sm" onClick={() => handleDelete(defect.id)}>
                      Удалить
                    </Button>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </>
      )}
    </Container>
  );
};

export {DefectsPage};