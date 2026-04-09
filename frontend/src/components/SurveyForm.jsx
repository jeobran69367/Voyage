import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SurveyForm.css';

const COUNTRIES = [
  'France', 'Espagne', 'Italie', 'Allemagne', 'Suisse', 'Belgique', 'Pays-Bas',
  'Portugal', 'Grèce', 'Croatie', 'Slovénie', 'Autriche', 'Pologne', 'République Tchèque',
  'Hongrie', 'Roumanie', 'Thaïlande', 'Japon', 'Corée du Sud', 'Vietnam',
  'Cambodge', 'Indonésie', 'Philippines', 'Malaisie', 'Singapour',
  'Mexique', 'Brésil', 'Argentine', 'Chili', 'Pérou', 'Colombie',
  'Canada', 'États-Unis', 'Maroc', 'Égypte', 'Afrique du Sud'
];

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const ACTIVITIES = [
  'Randonnée', 'Plage', 'Culture', 'Gastronomie', 'Shopping',
  'Aventure', 'Relaxation', 'Sports', 'Nature', 'Visite Musées'
];

function SurveyForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    month: '',
    duration: '',
    budget_min: '',
    budget_max: '',
    activities: [],
    comments: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSelectMonth = (month) => {
    setFormData(prev => ({
      ...prev,
      month: month
    }));
  };

  const handleSelectActivity = (activity) => {
    handleCheckboxChange('activities', activity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.country || !formData.month) {
      alert('Veuillez remplir tous les champs obligatoires (Nom, Pays, Mois)');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        activities: formData.activities.join(', ')
      };

      await axios.post('/api/surveys', submitData);
      setSubmitted(true);
      
      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setFormData({
          name: '',
          country: '',
          month: '',
          duration: '',
          budget_min: '',
          budget_max: '',
          activities: [],
          comments: ''
        });
        setSubmitted(false);
        onSubmit();
      }, 2000);
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Erreur lors de l\'envoi du sondage');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="form-container success-message">
        <div className="success-card">
          <h2>✅ Merci!</h2>
          <p>Votre réponse a été enregistrée avec succès!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="survey-form">
        <h2>Participez au sondage</h2>

        {/* Nom */}
        <div className="form-group">
          <label htmlFor="name">Votre Nom *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Votre nom"
            required
          />
        </div>

        {/* Pays */}
        <div className="form-group">
          <label htmlFor="country">Pays Préféré *</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          >
            <option value="">Sélectionnez un pays...</option>
            {COUNTRIES.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Mois */}
        <div className="form-group">
          <label>Mois Préféré *</label>
          <div className="checkbox-grid">
            {MONTHS.map(month => (
              <label key={month} className="checkbox-label">
                <input
                  type="radio"
                  name="month"
                  checked={formData.month === month}
                  onChange={() => handleSelectMonth(month)}
                />
                {month}
              </label>
            ))}
          </div>
        </div>

        {/* Durée */}
        <div className="form-group">
          <label htmlFor="duration">Durée (jours)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="Nombre de jours"
            min="1"
          />
        </div>

        {/* Budget */}
        <div className="form-group budget-group">
          <div>
            <label htmlFor="budget_min">Budget Min (€)</label>
            <input
              type="number"
              id="budget_min"
              name="budget_min"
              value={formData.budget_min}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="budget_max">Budget Max (€)</label>
            <input
              type="number"
              id="budget_max"
              name="budget_max"
              value={formData.budget_max}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Activités */}
        <div className="form-group">
          <label>Activités Intéressantes</label>
          <div className="checkbox-grid">
            {ACTIVITIES.map(activity => (
              <label key={activity} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.activities.includes(activity)}
                  onChange={() => handleSelectActivity(activity)}
                />
                {activity}
              </label>
            ))}
          </div>
        </div>

        {/* Commentaires */}
        <div className="form-group">
          <label htmlFor="comments">Commentaires Supplémentaires</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            placeholder="Partagez vos idées ou contraintes supplémentaires..."
            rows="4"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'En cours...' : 'Soumettre'}
        </button>
      </form>
    </div>
  );
}

export default SurveyForm;
