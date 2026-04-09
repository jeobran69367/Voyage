import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SurveyForm from './components/SurveyForm';
import Dashboard from './components/Dashboard';

function App() {
  const [view, setView] = useState('form'); // 'form' or 'results'
  const [surveys, setSurveys] = useState([]);
  const [statistics, setStatistics] = useState(null);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get('/api/surveys');
      setSurveys(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/api/surveys/stats');
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSurveySubmitted = () => {
    fetchSurveys();
    fetchStatistics();
  };

  const downloadExcel = async () => {
    try {
      const response = await axios.get('/api/export/excel', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'voyage-survey-results.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  useEffect(() => {
    fetchSurveys();
    fetchStatistics();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌍 Voyage Survey - Planifiez votre voyage ensemble!</h1>
        <nav className="navbar">
          <button 
            className={`nav-btn ${view === 'form' ? 'active' : ''}`}
            onClick={() => setView('form')}
          >
            Sondage
          </button>
          <button 
            className={`nav-btn ${view === 'results' ? 'active' : ''}`}
            onClick={() => setView('results')}
          >
            Résultats
          </button>
          <button className="nav-btn download-btn" onClick={downloadExcel}>
            📥 Télécharger Excel
          </button>
        </nav>
      </header>

      <main className="app-main">
        {view === 'form' ? (
          <SurveyForm onSubmit={handleSurveySubmitted} />
        ) : (
          <Dashboard surveys={surveys} statistics={statistics} />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2025 Voyage Survey - Créé avec ❤️ pour organiser vos voyages</p>
      </footer>
    </div>
  );
}

export default App;
