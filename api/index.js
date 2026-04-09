import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import surveyRoutes from '../backend/src/routes/surveyRoutes.js';
import { createTablesIfNotExists } from '../backend/src/models/Survey.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize database on first call
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await createTablesIfNotExists();
      dbInitialized = true;
    } catch (err) {
      console.error('DB init error:', err);
    }
  }
  next();
});

// API Routes
app.use('/api', surveyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API running on Vercel' });
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Voyage Survey API - running on Vercel Serverless' });
});

export default app;

