import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleViewDefects = () => {
    navigate(`/projects/${project.id}/defects`);
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
        <Button variant="primary" onClick={handleViewDefects}>
          Просмотреть дефекты
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;