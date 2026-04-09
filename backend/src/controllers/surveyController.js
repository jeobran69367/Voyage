import pool from '../db.js';

// Ajouter un nouveau sondage
export const addSurvey = async (req, res) => {
  const { name, country, month, duration, budget_min, budget_max, activities, comments } = req.body;

  if (!name || !country || !month) {
    return res.status(400).json({ message: 'Name, country, and month are required' });
  }

  try {
    const result = pool.query(
      `INSERT INTO surveys (name, country, month, duration, budget_min, budget_max, activities, comments)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, country, month, duration || null, budget_min || null, budget_max || null, activities || null, comments || null]
    );
    
    // Get the inserted row
    const rows = pool.query('SELECT * FROM surveys WHERE id = ?', [result.rows[0]?.id || 1]);
    res.status(201).json(rows.rows[0]);
  } catch (err) {
    console.error('Error adding survey:', err);
    res.status(500).json({ message: 'Error adding survey', error: err.message });
  }
};

// Obtenir tous les sondages
export const getAllSurveys = async (req, res) => {
  try {
    const result = pool.query('SELECT * FROM surveys ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching surveys:', err);
    res.status(500).json({ message: 'Error fetching surveys', error: err.message });
  }
};

// Obtenir les statistiques du sondage
export const getStatistics = async (req, res) => {
  try {
    const totalVotes = pool.query('SELECT COUNT(*) as count FROM surveys');
    const countries = pool.query(`
      SELECT country, COUNT(*) as count 
      FROM surveys 
      GROUP BY country 
      ORDER BY count DESC
    `);
    const months = pool.query(`
      SELECT month, COUNT(*) as count 
      FROM surveys 
      GROUP BY month 
      ORDER BY count DESC
    `);
    const activities = pool.query(`
      SELECT activities, COUNT(*) as count 
      FROM surveys 
      WHERE activities IS NOT NULL
      GROUP BY activities
    `);
    const budgetStats = pool.query(`
      SELECT 
        AVG(budget_min) as avg_min,
        AVG(budget_max) as avg_max,
        MIN(budget_min) as min_budget,
        MAX(budget_max) as max_budget
      FROM surveys
      WHERE budget_min IS NOT NULL AND budget_max IS NOT NULL
    `);

    res.json({
      total_votes: totalVotes.rows[0]?.count || 0,
      countries: countries.rows,
      months: months.rows,
      activities: activities.rows,
      budget_stats: budgetStats.rows[0] || {}
    });
  } catch (err) {
    console.error('Error fetching statistics:', err);
    res.status(500).json({ message: 'Error fetching statistics', error: err.message });
  }
};

// Obtenir une vue d'ensemble
export const getSurveyOverview = async (req, res) => {
  try {
    const result = pool.query(`
      SELECT 
        COUNT(*) as total_responses,
        COUNT(DISTINCT country) as countries_interested,
        COUNT(DISTINCT month) as months_available
      FROM surveys
    `);
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Error fetching overview:', err);
    res.status(500).json({ message: 'Error fetching overview', error: err.message });
  }
};
