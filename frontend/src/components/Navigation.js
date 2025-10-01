import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';
import '../styles/App.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Defect Manager</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/projects" active={location.pathname === '/projects'}>
              Проекты
            </Nav.Link>
            <Nav.Link as={Link} to="/defects" active={location.pathname === '/defects'}>
              Дефекты
            </Nav.Link>
            <Nav.Link as={Link} to="/reports" active={location.pathname === '/reports'}>
              Отчеты
            </Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  {user.username}
                </Navbar.Text>
                <Button variant="outline-primary" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" className="me-2">
                  Войти
                </Button>
                <Button as={Link} to="/register" variant="primary">
                  Регистрация
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;