import express from 'express';
import cors from 'cors';
import { sql } from '@vercel/postgres';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialiser la base de données
let dbInitialized = false;

async function initializeDatabase() {
  if (dbInitialized) return;
  
  try {
    // Créer la table si elle n'existe pas
    await sql`
      CREATE TABLE IF NOT EXISTS surveys (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        month VARCHAR(255) NOT NULL,
        duration INTEGER,
        budget_min INTEGER,
        budget_max INTEGER,
        activities TEXT,
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    dbInitialized = true;
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// POST - Ajouter un sondage
app.post('/api/surveys', async (req, res) => {
  try {
    await initializeDatabase();
    const { name, country, month, duration, budget_min, budget_max, activities, comments } = req.body;

    if (!name || !country || !month) {
      return res.status(400).json({ error: 'Name, country, and month are required' });
    }

    const result = await sql`
      INSERT INTO surveys (name, country, month, duration, budget_min, budget_max, activities, comments)
      VALUES (${name}, ${country}, ${month}, ${duration || null}, ${budget_min || null}, ${budget_max || null}, ${activities || null}, ${comments || null})
      RETURNING *;
    `;

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding survey:', error);
    res.status(500).json({ error: 'Failed to add survey', details: error.message });
  }
});

// GET - Récupérer tous les sondages
app.get('/api/surveys', async (req, res) => {
  try {
    await initializeDatabase();
    const result = await sql`SELECT * FROM surveys ORDER BY created_at DESC;`;
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
});

// GET - Statistiques
app.get('/api/surveys/stats', async (req, res) => {
  try {
    await initializeDatabase();
    
    // Total
    const countResult = await sql`SELECT COUNT(*) as total FROM surveys;`;
    const totalSurveys = parseInt(countResult.rows[0].total) || 0;

    if (totalSurveys === 0) {
      return res.json({
        totalSurveys: 0,
        countries: [],
        months: [],
        budget_stats: { avg_min: 0, avg_max: 0, min_budget: 0, max_budget: 0 }
      });
    }

    // Pays populaires
    const countriesResult = await sql`
      SELECT country, COUNT(*) as count
      FROM surveys
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10;
    `;
    const countries = countriesResult.rows.map(row => ({
      country: row.country,
      count: parseInt(row.count)
    }));

    // Mois populaires
    const monthsResult = await sql`
      SELECT month, COUNT(*) as count
      FROM surveys
      WHERE month IS NOT NULL AND month != ''
      GROUP BY month
      ORDER BY count DESC
      LIMIT 10;
    `;
    const months = monthsResult.rows.map(row => ({
      month: row.month,
      count: parseInt(row.count)
    }));

    // Budget stats
    const budgetResult = await sql`
      SELECT 
        ROUND(AVG(budget_min)) as avg_min,
        ROUND(AVG(budget_max)) as avg_max,
        MIN(budget_min) as min_budget,
        MAX(budget_max) as max_budget
      FROM surveys
      WHERE budget_min IS NOT NULL AND budget_max IS NOT NULL;
    `;
    const budgetData = budgetResult.rows[0];
    const budget_stats = {
      avg_min: parseInt(budgetData.avg_min) || 0,
      avg_max: parseInt(budgetData.avg_max) || 0,
      min_budget: parseInt(budgetData.min_budget) || 0,
      max_budget: parseInt(budgetData.max_budget) || 0
    };

    res.json({
      totalSurveys,
      countries,
      months,
      budget_stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET - Vue d'ensemble
app.get('/api/surveys/overview', async (req, res) => {
  try {
    await initializeDatabase();
    const result = await sql`
      SELECT COUNT(*) as total, MAX(created_at) as last_updated
      FROM surveys;
    `;
    const data = result.rows[0];
    
    res.json({
      totalResponses: parseInt(data.total) || 0,
      topCountry: null,
      lastUpdated: data.last_updated || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

// DELETE - Supprimer un sondage
app.delete('/api/surveys/:id', async (req, res) => {
  try {
    await initializeDatabase();
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Survey ID is required' });
    }

    const result = await sql`
      DELETE FROM surveys WHERE id = ${parseInt(id)}
      RETURNING *;
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Survey not found' });
    }

    res.json({ success: true, message: 'Survey deleted successfully', deleted: result.rows[0] });
  } catch (error) {
    console.error('Error deleting survey:', error);
    res.status(500).json({ error: 'Failed to delete survey', details: error.message });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// IMPORTANT: Export as handler function for Vercel, not as Express app
export default (req, res) => app(req, res);

