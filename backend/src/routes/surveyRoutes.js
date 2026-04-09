import express from 'express';
import * as surveyController from '../controllers/surveyController.js';
import { exportToExcel } from '../utils/excelExport.js';
import XLSX from 'xlsx';

const router = express.Router();

// Ajouter un sondage
router.post('/surveys', surveyController.addSurvey);

// Obtenir tous les sondages
router.get('/surveys', surveyController.getAllSurveys);

// Obtenir les statistiques
router.get('/surveys/stats', surveyController.getStatistics);

// Obtenir la vue d'ensemble
router.get('/surveys/overview', surveyController.getSurveyOverview);

// Exporter en Excel
router.get('/export/excel', async (req, res) => {
  try {
    const wb = await exportToExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="voyage-survey-results.xlsx"');
    
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: 'Error exporting to Excel', error: err.message });
  }
});

export default router;
