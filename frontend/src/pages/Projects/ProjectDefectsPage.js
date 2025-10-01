import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Table, Form, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { translateStatus, translatePriority } from '../../utils/localization';

const ProjectDefectsPage = () => {
  const { projectId } = useParams();
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const { token } = useAuth();
  const [newDefect, setNewDefect] = useState({ 
    title: '', 
    description: '',
    priority: 'medium' 
  });

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
        // Фильтруем дефекты по проекту
        const defectsData = allDefects.filter(d => d.projectId === parseInt(projectId));
        setDefects(defectsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, token]);

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
      setDefects([...defects, createdDefect]);
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

      setDefects(defects.filter(defect => defect.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <Container>
      <h2 className="my-4">Дефекты проекта: {project?.name}</h2>

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
          {defects.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                Дефектов пока нет. Создайте первый!
              </td>
            </tr>
          ) : (
            defects.map(defect => (
              <tr key={defect.id}>
                <td>{defect.title}</td>
                <td>{translateStatus(defect.status)}</td>
                <td>{translatePriority(defect.priority)}</td>
                <td>{defect.assignee?.username || 'Не назначен'}</td>
                <td>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(defect.id)}
                  >
                    Удалить
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export { ProjectDefectsPage };