import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { translateStatus, translatePriority } from '../../utils/localization';

const ProjectReportPage = () => {
  const { projectId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useAuth();

  // Только manager может экспортировать отчёты
  const canExportReports = user && user.role === 'manager';

  useEffect(() => {
    fetchReport();
  }, [projectId, token]);

  const fetchReport = async () => {
    if (!token) {
      setError('Необходима авторизация');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reports/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при загрузке отчёта');
      }

      const data = await response.json();
      setReport(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const url = `http://localhost:5000/api/reports/projects/${projectId}/csv`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `project_${projectId}_report.csv`);
    
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(err => {
      setError('Ошибка при экспорте: ' + err.message);
    });
  };

  if (loading) return <Container className="mt-4"><div>Загрузка...</div></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">Ошибка: {error}</Alert></Container>;
  if (!report) return <Container className="mt-4"><div>Нет данных</div></Container>;

  const { project, statistics, defects } = report;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Отчёт по проекту: {project.name}</h2>
        {canExportReports && (
          <Button variant="success" onClick={handleExportCSV}>
            📥 Экспорт в CSV
          </Button>
        )}
      </div>

      {project.description && (
        <p className="text-muted">{project.description}</p>
      )}

      {/* Общая статистика */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5>Всего дефектов</h5>
              <h2 className="text-primary">{statistics.totalDefects}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5>Процент выполнения</h5>
              <h2 className="text-success">{statistics.completionRate}%</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5>Активных</h5>
              <h2 className="text-warning">
                {statistics.byStatus.new + statistics.byStatus.in_progress + statistics.byStatus.review}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5>Закрыто</h5>
              <h2 className="text-secondary">{statistics.byStatus.closed}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Детальная статистика */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header><strong>По статусам</strong></Card.Header>
            <Card.Body>
              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>🆕 Новый:</span>
                  <strong>{statistics.byStatus.new}</strong>
                </div>
                <div className="progress" style={{height: '10px'}}>
                  <div 
                    className="progress-bar bg-info" 
                    style={{width: `${(statistics.byStatus.new / statistics.totalDefects * 100)}%`}}
                  ></div>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>🔧 В работе:</span>
                  <strong>{statistics.byStatus.in_progress}</strong>
                </div>
                <div className="progress" style={{height: '10px'}}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{width: `${(statistics.byStatus.in_progress / statistics.totalDefects * 100)}%`}}
                  ></div>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>👀 На проверке:</span>
                  <strong>{statistics.byStatus.review}</strong>
                </div>
                <div className="progress" style={{height: '10px'}}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{width: `${(statistics.byStatus.review / statistics.totalDefects * 100)}%`}}
                  ></div>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>✅ Закрыт:</span>
                  <strong>{statistics.byStatus.closed}</strong>
                </div>
                <div className="progress" style={{height: '10px'}}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{width: `${(statistics.byStatus.closed / statistics.totalDefects * 100)}%`}}
                  ></div>
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>❌ Отменён:</span>
                  <strong>{statistics.byStatus.cancelled}</strong>
                </div>
                <div className="progress" style={{height: '10px'}}>
                  <div 
                    className="progress-bar bg-secondary" 
                    style={{width: `${(statistics.byStatus.cancelled / statistics.totalDefects * 100)}%`}}
                  ></div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header><strong>По приоритетам</strong></Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>🔴 Высокий:</span>
                  <strong>{statistics.byPriority.high}</strong>
                </div>
                <div className="progress" style={{height: '15px'}}>
                  <div 
                    className="progress-bar bg-danger" 
                    style={{width: `${(statistics.byPriority.high / statistics.totalDefects * 100)}%`}}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>🟡 Средний:</span>
                  <strong>{statistics.byPriority.medium}</strong>
                </div>
                <div className="progress" style={{height: '15px'}}>
                  <div 
                    className="progress-bar bg-warning" 
                    style={{width: `${(statistics.byPriority.medium / statistics.totalDefects * 100)}%`}}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>🟢 Низкий:</span>
                  <strong>{statistics.byPriority.low}</strong>
                </div>
                <div className="progress" style={{height: '15px'}}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{width: `${(statistics.byPriority.low / statistics.totalDefects * 100)}%`}}
                  ></div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Дефекты по исполнителям */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header><strong>По исполнителям</strong></Card.Header>
            <Card.Body>
              <Table striped bordered size="sm">
                <thead>
                  <tr>
                    <th>Исполнитель</th>
                    <th className="text-end">Количество дефектов</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(statistics.byAssignee).map(([assignee, count]) => (
                    <tr key={assignee}>
                      <td>{assignee}</td>
                      <td className="text-end"><strong>{count}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Таблица дефектов */}
      <h4 className="mb-3">Список дефектов</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Название</th>
            <th>Статус</th>
            <th>Приоритет</th>
            <th>Назначен</th>
            <th>Создал</th>
            <th>Дата создания</th>
          </tr>
        </thead>
        <tbody>
          {defects.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                Дефектов пока нет
              </td>
            </tr>
          ) : (
            defects.map(defect => (
              <tr key={defect.id}>
                <td>{defect.title}</td>
                <td>{translateStatus(defect.status)}</td>
                <td>{translatePriority(defect.priority)}</td>
                <td>{defect.assignee || 'Не назначен'}</td>
                <td>{defect.createdBy || 'Неизвестно'}</td>
                <td>{new Date(defect.createdAt).toLocaleDateString('ru-RU')}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export { ProjectReportPage };
