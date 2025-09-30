import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Container, Row, Col } from 'react-bootstrap';
import ProjectCard from '../../components/ProjectCard';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const fetchProjects = async () => {
    if (!token) {
      setError('Необходима авторизация');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
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

  useEffect(() => {
    fetchProjects();
  }, [token]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <Container>
      <h2 className="my-4">Проекты</h2>
      <Row>
        {projects.map(project => (
          <Col key={project.id} md={4}>
            <ProjectCard project={project} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export { ProjectsPage };