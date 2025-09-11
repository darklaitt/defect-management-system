import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import {ProjectsPage} from './pages/Projects/ProjectsPage';
import {DefectsPage} from './pages/Defects/DefectsPage';
import {ReportsPage} from './pages/Reports/ReportsPage';
import {LoginPage} from './pages/Auth/LoginPage';
import './styles/App.css';

function Home() {
  return (
    <main className="container">
      <h1>Управляйте<br />дефектами и проектами<br />просто и современно</h1>
      <div className="subtitle">
        Современный инструмент для отслеживания дефектов, управления проектами и создания отчетов.<br />
        Минималистичный дизайн, максимум эффективности.
      </div>
      <a href="/login" className="button" style={{marginBottom: 24}}>Начать работу</a>
    </main>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/defects" element={<DefectsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
