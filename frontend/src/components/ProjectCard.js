import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleViewDefects = () => {
    navigate(`/projects/${project.id}/defects`);
  };

  const handleViewReport = () => {
    navigate(`/projects/${project.id}/report`);
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{project.name}</Card.Title>
        <Card.Text>
          {project.description}
        </Card.Text>
        <Card.Text>
          <small className="text-muted">
            Этап: {project.stage}
          </small>
        </Card.Text>
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={handleViewDefects}>
            📋 Дефекты
          </Button>
          <Button variant="info" onClick={handleViewReport}>
            📊 Отчёт
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;