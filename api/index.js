import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test/Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API ready', environment: process.env.NODE_ENV });
});

// Default API response
app.get('/', (req, res) => {
  res.json({ message: 'Voyage Survey API' });
});

// Placeholder for surveys endpoints (TODO: Connect to database)
app.get('/api/surveys', (req, res) => {
  // TODO: Connect to Vercel Postgres
  res.json([]);
});

app.post('/api/surveys', (req, res) => {
  // TODO: Connect to Vercel Postgres
  res.json({ message: 'Survey submitted' });
});

app.get('/api/surveys/stats', (req, res) => {
  // TODO: Connect to Vercel Postgres
  res.json({
    totalSurveys: 0,
    countries: [],
    months: [],
    budgetStats: { min: 0, max: 0, average: 0 }
  });
});

app.get('/api/surveys/overview', (req, res) => {
  res.json({ overview: 'No data yet' });
});

app.get('/api/export/excel', (req, res) => {
  res.status(501).json({ message: 'Excel export not yet implemented' });
});

// Fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;

