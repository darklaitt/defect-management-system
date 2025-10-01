import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SSRProvider } from 'react-bootstrap';
import Navigation from './components/Navigation';
import {ProjectsPage} from './pages/Projects/ProjectsPage';
import {ProjectDefectsPage} from './pages/Projects/ProjectDefectsPage';
import {DefectsPage} from './pages/Defects/DefectsPage';
import {ReportsPage} from './pages/Reports/ReportsPage';
import {ProjectReportPage} from './pages/Reports/ProjectReportPage';
import {LoginPage} from './pages/Auth/LoginPage';
import {RegisterPage} from './pages/Auth/RegisterPage';
import './styles/App.css';

function Home() {
  const { user } = useAuth();
  
  return (
    <main className="container">
      <h1>Управляйте<br />дефектами и проектами<br />просто и современно</h1>
      <div className="subtitle">
        Современный инструмент для отслеживания дефектов, управления проектами и создания отчетов.<br />
        Минималистичный дизайн, максимум эффективности.
      </div>
      <a href={user ? "/projects" : "/login"} className="button" style={{marginBottom: 24}}>Начать работу</a>
    </main>
  );
}

function App() {
  return (
    <SSRProvider>
      <AuthProvider>
        <Router>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId/defects" element={<ProjectDefectsPage />} />
            <Route path="/projects/:projectId/report" element={<ProjectReportPage />} />
            <Route path="/defects" element={<DefectsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </SSRProvider>
  );
}

export default App;
