import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Table } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ProjectDefectsPage = () => {
  const { projectId } = useParams();
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const { token } = useAuth();

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

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <Container>
      <h2 className="my-4">Дефекты проекта: {project?.name}</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Статус</th>
            <th>Приоритет</th>
            <th>Назначен</th>
          </tr>
        </thead>
        <tbody>
          {defects.map(defect => (
            <tr key={defect.id}>
              <td>{defect.id}</td>
              <td>{defect.title}</td>
              <td>{defect.status}</td>
              <td>{defect.priority}</td>
              <td>{defect.assignee?.username || 'Не назначен'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export { ProjectDefectsPage };