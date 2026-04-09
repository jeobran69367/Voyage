import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Données en mémoire
let surveysData = [];
let surveyId = 1;

// POST - Ajouter un sondage
app.post('/api/surveys', (req, res) => {
  try {
    const { name, country, month, duration, budget_min, budget_max, activities, comments } = req.body;

    if (!name || !country || !month) {
      return res.status(400).json({ error: 'Name, country, and month are required' });
    }

    const newSurvey = {
      id: surveyId++,
      name,
      country,
      month,
      duration: duration || null,
      budget_min: budget_min || null,
      budget_max: budget_max || null,
      activities: activities || null,
      comments: comments || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    surveysData.push(newSurvey);
    res.status(201).json(newSurvey);
  } catch (error) {
    console.error('Error adding survey:', error);
    res.status(500).json({ error: 'Failed to add survey', details: error.message });
  }
});

// GET - Récupérer tous les sondages
app.get('/api/surveys', (req, res) => {
  try {
    res.json(surveysData);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
});

// GET - Statistiques
app.get('/api/surveys/stats', (req, res) => {
  try {
    if (surveysData.length === 0) {
      return res.json({
        totalSurveys: 0,
        countries: [],
        months: [],
        budget_stats: { avg_min: 0, avg_max: 0, min_budget: 0, max_budget: 0 }
      });
    }

    const countryCounts = {};
    const monthCounts = {};
    let budgetMins = [];
    let budgetMaxs = [];

    surveysData.forEach(survey => {
      countryCounts[survey.country] = (countryCounts[survey.country] || 0) + 1;

      if (survey.month) {
        const months = survey.month.split(',').map(m => m.trim());
        months.forEach(m => {
          monthCounts[m] = (monthCounts[m] || 0) + 1;
        });
      }

      if (survey.budget_min) budgetMins.push(survey.budget_min);
      if (survey.budget_max) budgetMaxs.push(survey.budget_max);
    });

    const countries = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    const months = Object.entries(monthCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => b.count - a.count);

    const avgMin = budgetMins.length > 0 ? Math.round(budgetMins.reduce((a, b) => a + b, 0) / budgetMins.length) : 0;
    const avgMax = budgetMaxs.length > 0 ? Math.round(budgetMaxs.reduce((a, b) => a + b, 0) / budgetMaxs.length) : 0;

    res.json({
      totalSurveys: surveysData.length,
      countries,
      months,
      budget_stats: {
        avg_min: avgMin,
        avg_max: avgMax,
        min_budget: budgetMins.length ? Math.min(...budgetMins) : 0,
        max_budget: budgetMaxs.length ? Math.max(...budgetMaxs) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET - Vue d'ensemble
app.get('/api/surveys/overview', (req, res) => {
  try {
    res.json({
      totalResponses: surveysData.length,
      topCountry: surveysData.length > 0 ? surveysData[0].country : null,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// IMPORTANT: Export as handler function for Vercel, not as Express app
export default (req, res) => app(req, res);

