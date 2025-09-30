import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/projects');
      } else {
        setError('Неверное имя пользователя или пароль');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-5">
      <div className="w-100" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h2 className="text-center mb-4">Вход в систему</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Имя пользователя</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mb-3">
            Войти
          </Button>

          <div className="text-center">
            <span>Нет аккаунта? </span>
            <Link to="/register">Зарегистрироваться</Link>
          </div>
        </Form>
      </div>
    </Container>
  );
};


export { LoginPage };