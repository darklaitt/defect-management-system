import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/App.css';

const Navigation = () => {
  const location = useLocation();
  return (
    <header>
      <div className="header-row">
        <div className="header-logo">Defect Manager</div>
        <nav className="header-nav">
          <Link to="/" className={`header-link${location.pathname === '/' ? ' active' : ''}`}>Home</Link>
          <Link to="/projects" className={`header-link${location.pathname === '/projects' ? ' active' : ''}`}>Projects</Link>
          <Link to="/defects" className={`header-link${location.pathname === '/defects' ? ' active' : ''}`}>Defects</Link>
          <Link to="/reports" className={`header-link${location.pathname === '/reports' ? ' active' : ''}`}>Reports</Link>
        </nav>
        <div className="header-actions">
          <span style={{fontSize: '1rem', color: '#888'}}>RU</span>
          <Link to="/login" className="button login_button" style={{padding: '10px 24px', fontSize: '1rem'}}>Войти</Link>
        </div>
      </div>
    </header>
  );
};

export default Navigation;