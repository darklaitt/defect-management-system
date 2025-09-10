import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/Auth/LoginPage';
import { DefectsPage } from './pages/Defects/DefectsPage';
import { ProjectsPage } from './pages/Projects/ProjectsPage';
import { ReportsPage } from './pages/Reports/ReportsPage';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<LoginPage />}  />
          <Route path="/Defects" element={<DefectsPage />} />
          <Route path="/Projects" element={<ProjectsPage />} />
          <Route path="/Reports" element={<ReportsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
