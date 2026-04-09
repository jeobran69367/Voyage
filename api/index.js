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

// Initialize database
await createTablesIfNotExists();

// Routes
app.use('/api', surveyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running on Vercel' });
});

export default app;
