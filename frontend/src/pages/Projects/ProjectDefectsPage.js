import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Table, Form, Button, Row, Col, Badge, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { translateStatus, translatePriority, getStatusColor, getPriorityColor } from '../../utils/localization';

const ProjectDefectsPage = () => {
  const { projectId } = useParams();
  const [defects, setDefects] = useState([]);
  const [filteredDefects, setFilteredDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const { token, user } = useAuth();
  const [newDefect, setNewDefect] = useState({ 
    title: '', 
    description: '',
    priority: 'medium' 
  });

  // Простой поиск только по названию
  const [searchText, setSearchText] = useState('');

  // Проверка прав: engineer и manager могут создавать/удалять
  const canManageDefects = user && (user.role === 'engineer' || user.role === 'manager');
  // Только manager может делать отчёты (уже реализовано на странице отчёта)

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Необходима авторизация');
        setLoading(false);
        return;
      }

      try {
        // Загружаем информацию о проекте
        const projectResponse = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!projectResponse.ok) {
          throw new Error('Ошибка при загрузке информации о проекте');
        }
        const projectData = await projectResponse.json();
        setProject(projectData);

        // Загружаем дефекты проекта (используем общий эндпоинт с фильтром)
        const defectsResponse = await fetch(`http://localhost:5000/api/defects`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!defectsResponse.ok) {
          throw new Error('Ошибка при загрузке дефектов');
        }
        const allDefects = await defectsResponse.json();
        
        // Проверяем, что allDefects - это массив
        if (!Array.isArray(allDefects)) {
          console.error('Ответ API не является массивом:', allDefects);
          setDefects([]);
          setFilteredDefects([]);
          setLoading(false);
          return;
        }
        
        // Фильтруем дефекты по проекту
        const defectsData = allDefects.filter(d => d.projectId === parseInt(projectId));
        
        console.log('Все дефекты:', allDefects);
        console.log('ProjectId из URL:', projectId, 'как число:', parseInt(projectId));
        console.log('Дефекты проекта:', defectsData);
        
        setDefects(defectsData);
        setFilteredDefects(defectsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, token]);

  // Простой поиск только по названию
  useEffect(() => {
    if (!searchText) {
      setFilteredDefects(defects);
    } else {
      const filtered = defects.filter(d => 
        d.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredDefects(filtered);
    }
  }, [defects, searchText]);

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
        body: JSON.stringify({
          ...newDefect,
          projectId: parseInt(projectId),
          status: 'new'
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании дефекта');
      }

      const createdDefect = await response.json();
      const updatedDefects = [...defects, createdDefect];
      setDefects(updatedDefects);
      setNewDefect({ title: '', description: '', priority: 'medium' });
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

      const updatedDefects = defects.filter(defect => defect.id !== id);
      setDefects(updatedDefects);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (defectId, newStatus) => {
    if (!token || !canManageDefects) {
      setError('Недостаточно прав');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/defects/${defectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Ошибка при изменении статуса');
      }

      const updatedDefects = defects.map(d => 
        d.id === defectId ? { ...d, status: newStatus } : d
      );
      setDefects(updatedDefects);
    } catch (err) {
      setError(err.message);
    }
  };

  // Разделяем дефекты на активные и завершённые
  const activeDefects = filteredDefects.filter(d => d.status !== 'closed' && d.status !== 'cancelled');
  const completedDefects = filteredDefects.filter(d => d.status === 'closed' || d.status === 'cancelled');

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <Container>
      <h2 className="my-4">Дефекты проекта: {project?.name}</h2>

      {canManageDefects && (
        <Form className="mb-4 p-4 border rounded bg-light">
          <h5 className="mb-3">Добавить новый дефект</h5>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Название дефекта *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите название дефекта"
                value={newDefect.title}
                onChange={(e) => setNewDefect({...newDefect, title: e.target.value})}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
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
          </Col>
        </Row>

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

          <Button variant="primary" onClick={handleCreate}>
            Добавить дефект
          </Button>
        </Form>
      )}

      {/* Простой поиск */}
      <div className="mb-4">
        <Form.Group>
          <Form.Label>🔍 Поиск по названию</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Поиск дефектов по названию..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button 
              variant="outline-secondary" 
              onClick={() => setSearchText('')}
              disabled={!searchText}
            >
              ✕
            </Button>
          </InputGroup>
          {searchText && (
            <Form.Text className="text-muted">
              Найдено: <strong>{filteredDefects.length}</strong> из {defects.length}
            </Form.Text>
          )}
        </Form.Group>
      </div>

      {/* Активные дефекты */}
      <h4 className="mt-4 mb-3">Активные дефекты ({activeDefects.length})</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Название</th>
            <th>Статус</th>
            <th>Приоритет</th>
            <th>Назначен</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {activeDefects.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                {defects.length === 0 
                  ? 'Дефектов пока нет. Создайте первый!' 
                  : 'Нет активных дефектов по поиску'
                }
              </td>
            </tr>
          ) : (
            activeDefects.map(defect => (
              <tr key={defect.id}>
                <td>{defect.title}</td>
                <td>
                  {canManageDefects ? (
                    <Form.Select
                      size="sm"
                      value={defect.status}
                      onChange={(e) => handleStatusChange(defect.id, e.target.value)}
                      style={{width: 'auto', display: 'inline-block'}}
                    >
                      <option value="new">🆕 Новый</option>
                      <option value="in_progress">🔧 В работе</option>
                      <option value="review">👀 На проверке</option>
                      <option value="closed">✅ Закрыт</option>
                      <option value="cancelled">❌ Отменён</option>
                    </Form.Select>
                  ) : (
                    <Badge bg={getStatusColor(defect.status)}>
                      {translateStatus(defect.status)}
                    </Badge>
                  )}
                </td>
                <td>
                  <Badge bg={getPriorityColor(defect.priority)}>
                    {translatePriority(defect.priority)}
                  </Badge>
                </td>
                <td>{defect.assignee?.username || 'Не назначен'}</td>
                <td>
                  {canManageDefects ? (
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDelete(defect.id)}
                    >
                      Удалить
                    </Button>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Завершённые дефекты */}
      {completedDefects.length > 0 && (
        <>
          <h4 className="mt-5 mb-3">Завершённые дефекты ({completedDefects.length})</h4>
          <Table striped bordered hover className="table-secondary">
            <thead>
              <tr>
                <th>Название</th>
                <th>Статус</th>
                <th>Приоритет</th>
                <th>Назначен</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {completedDefects.map(defect => (
                <tr key={defect.id}>
                  <td className="text-muted">{defect.title}</td>
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
                  <td className="text-muted">{defect.assignee?.username || 'Не назначен'}</td>
                  <td>
                    {canManageDefects ? (
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDelete(defect.id)}
                      >
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

export { ProjectDefectsPage };