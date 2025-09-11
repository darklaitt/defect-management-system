import React, { useState } from 'react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Заглушка для логики входа
    console.log('Данные для входа:', formData);
    alert('Заглушка: Попытка входа для пользователя ' + formData.username);
  };

  return (
    <div className="container">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Имя пользователя:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Пароль:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};


export { LoginPage };