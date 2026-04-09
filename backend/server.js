import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import surveyRoutes from './src/routes/surveyRoutes.js';
import { createTablesIfNotExists } from './src/models/Survey.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Créer les tables au démarrage
await createTablesIfNotExists();

// Routes
app.use('/api', surveyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Route d'accueil
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Voyage Survey API' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
