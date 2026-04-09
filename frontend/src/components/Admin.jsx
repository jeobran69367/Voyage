import React, { useState, useEffect } from 'react';
import '../styles/Admin.css';

function Admin({ surveys, onDeleteSurvey, onBack }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const ADMIN_PASSWORD = 'admin123'; // À changer!

  const filteredSurveys = surveys.filter(survey =>
    survey.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert('❌ Mot de passe incorrect');
      setPassword('');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce vote?')) {
      onDeleteSurvey(id);
      alert('✅ Vote supprimé');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(surveys, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'surveys-backup.json';
    link.click();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSearchTerm('');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-login">
          <h2>🔒 Accès Admin</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit">Connexion</button>
          </form>
          <button className="back-btn" onClick={onBack}>← Retour</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>⚙️ Panneau Admin</h2>
        <button className="logout-btn" onClick={handleLogout}>🚪 Déconnexion</button>
      </div>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Rechercher par nom ou pays..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="admin-buttons">
          <button onClick={exportData} className="export-btn">
            📥 Exporter JSON
          </button>
          <button onClick={onBack} className="back-btn">
            ← Retour
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <p>📊 Total: <strong>{surveys.length}</strong> votes</p>
        <p>🔍 Résultats: <strong>{filteredSurveys.length}</strong></p>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Pays</th>
              <th>Mois</th>
              <th>Durée</th>
              <th>Budget</th>
              <th>Activités</th>
              <th>Créé le</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSurveys.length > 0 ? (
              filteredSurveys.map((survey) => (
                <tr key={survey.id}>
                  <td>{survey.id}</td>
                  <td><strong>{survey.name}</strong></td>
                  <td>{survey.country}</td>
                  <td>{survey.month}</td>
                  <td>{survey.duration || '-'}</td>
                  <td>
                    {survey.budget_min && survey.budget_max
                      ? `€${survey.budget_min}-${survey.budget_max}`
                      : '-'}
                  </td>
                  <td>{survey.activities || '-'}</td>
                  <td>
                    {new Date(survey.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(survey.id)}
                      className="delete-btn"
                      title="Supprimer ce vote"
                    >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                  Aucun résultat trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
