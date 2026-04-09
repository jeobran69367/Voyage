import React from 'react';
import '../styles/Dashboard.css';

function Dashboard({ surveys, statistics }) {
  if (!surveys || surveys.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <h2>Pas encore de réponses</h2>
          <p>Les résultats apparaîtront ici une fois que les gens auront participé au sondage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>📊 Résultats du Sondage</h2>
        <p className="total-responses">Total de réponses: <strong>{surveys.length}</strong></p>
      </div>

      {/* Statistiques */}
      {statistics && (
        <div className="stats-overview">
          <div className="stat-card">
            <h3>🌍 Pays Populaires</h3>
            <ul className="stat-list">
              {statistics.countries && statistics.countries.slice(0, 5).map((country, idx) => (
                <li key={idx}>
                  <span className="rank">{idx + 1}.</span>
                  <span className="name">{country.country}</span>
                  <span className="count">{country.count} votes</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="stat-card">
            <h3>📅 Mois Populaires</h3>
            <ul className="stat-list">
              {statistics.months && statistics.months.slice(0, 5).map((month, idx) => (
                <li key={idx}>
                  <span className="rank">{idx + 1}.</span>
                  <span className="name">{month.month}</span>
                  <span className="count">{month.count} votes</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="stat-card">
            <h3>💰 Budget Moyen</h3>
            {statistics.budget_stats && (
              <div className="budget-stats">
                <p><strong>Min:</strong> €{statistics.budget_stats.avg_min || 'N/A'}</p>
                <p><strong>Max:</strong> €{statistics.budget_stats.avg_max || 'N/A'}</p>
                <p><strong>Range:</strong> €{statistics.budget_stats.min_budget || 'N/A'} - €{statistics.budget_stats.max_budget || 'N/A'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Détails des réponses */}
      <div className="responses-section">
        <h3>📝 Détails des Réponses</h3>
        <div className="responses-table">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Pays</th>
                <th>Mois</th>
                <th>Durée (jours)</th>
                <th>Budget</th>
                <th>Activités</th>
                <th>Commentaires</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey, idx) => (
                <tr key={idx}>
                  <td><strong>{survey.name}</strong></td>
                  <td>{survey.country}</td>
                  <td><span className="months-tag">{survey.month}</span></td>
                  <td>{survey.duration || '-'}</td>
                  <td>
                    {survey.budget_min && survey.budget_max 
                      ? `€${survey.budget_min} - €${survey.budget_max}`
                      : '-'
                    }
                  </td>
                  <td>
                    {survey.activities 
                      ? <span className="activities">{survey.activities}</span>
                      : '-'
                    }
                  </td>
                  <td className="comments-cell">{survey.comments || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
