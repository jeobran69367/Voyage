import XLSX from 'xlsx';
import pool from '../db.js';

export const exportToExcel = async () => {
  try {
    // Récupérer tous les sondages
    const result = pool.query(`
      SELECT 
        id, 
        name, 
        country, 
        month, 
        duration, 
        budget_min, 
        budget_max, 
        activities, 
        comments, 
        created_at 
      FROM surveys 
      ORDER BY created_at DESC
    `);

    const data = result.rows;
    const statistics = getStatistics();

    // Créer un workbook avec plusieurs sheets
    const wb = XLSX.utils.book_new();

    // Sheet 1: Résultats détaillés
    const ws1 = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws1, 'Sondages');

    // Sheet 2: Statistiques
    const statsData = [
      { Métrique: 'Total de réponses', Valeur: statistics.total_votes },
      { Métrique: 'Pays intéressés', Valeur: statistics.countries.length },
      { Métrique: 'Mois disponibles', Valeur: statistics.months.length },
      { Métrique: 'Budget moyen min', Valeur: Math.round(statistics.budget_stats?.avg_min || 0) },
      { Métrique: 'Budget moyen max', Valeur: Math.round(statistics.budget_stats?.avg_max || 0) },
    ];
    const ws2 = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Statistiques');

    // Sheet 3: Pays populaires
    const ws3 = XLSX.utils.json_to_sheet(statistics.countries);
    XLSX.utils.book_append_sheet(wb, ws3, 'Pays');

    // Sheet 4: Mois disponibles
    const ws4 = XLSX.utils.json_to_sheet(statistics.months);
    XLSX.utils.book_append_sheet(wb, ws4, 'Mois');

    return wb;
  } catch (err) {
    console.error('Error exporting to Excel:', err);
    throw err;
  }
};

function getStatistics() {
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
  const budgetStats = pool.query(`
    SELECT 
      AVG(budget_min) as avg_min,
      AVG(budget_max) as avg_max,
      MIN(budget_min) as min_budget,
      MAX(budget_max) as max_budget
    FROM surveys
    WHERE budget_min IS NOT NULL AND budget_max IS NOT NULL
  `);

  return {
    total_votes: totalVotes.rows[0]?.count || 0,
    countries: countries.rows || [],
    months: months.rows || [],
    budget_stats: budgetStats.rows[0] || {}
  };
}
