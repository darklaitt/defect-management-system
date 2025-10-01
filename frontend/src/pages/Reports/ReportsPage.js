import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ReportsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const fetchProjects = async () => {
    if (!token) {
      setError('Необходима авторизация');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке проектов');
      }

      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <Container className="mt-4"><div>Загрузка...</div></Container>;
  if (error) return <Container className="mt-4"><div>Ошибка: {error}</div></Container>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Отчёты по проектам</h2>
      <p className="text-muted mb-4">Выберите проект для просмотра детального отчёта и аналитики</p>
      
      <Row>
        {projects.map(project => (
          <Col key={project.id} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{project.name}</Card.Title>
                <Card.Text className="text-muted">
                  {project.description || 'Нет описания'}
                </Card.Text>
                <Card.Text>
                  <small className="text-muted">
                    Этап: {project.stage || 'Не указан'}
                  </small>
                </Card.Text>
                <Button 
                  variant="primary" 
                  onClick={() => navigate(`/projects/${project.id}/report`)}
                  className="w-100"
                >
                  📊 Открыть отчёт
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {projects.length === 0 && (
        <div className="text-center text-muted mt-4">
          <p>Проектов пока нет</p>
        </div>
      )}
    </Container>
  );
};

export {ReportsPage}