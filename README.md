# 🌍 Voyage Survey - Application de Sondage de Voyage

Une application fullstack moderne pour créer et gérer des sondages de voyage avec vos amis. Planifiez vos voyages ensemble, votez pour vos destinations préférées, et exportez les résultats en Excel pour une analyse facile!

## 📋 Caractéristiques

- ✅ **Formulaire interactif** - Collectez les préférences de voyage (nom, pays, mois, durée, budget, activités)
- 📊 **Dashboard en temps réel** - Visualisez les résultats et statistiques des sondages
- 📥 **Export Excel** - Téléchargez tous les résultats dans un classeur Excel multi-feuilles
- 🎨 **Interface moderne** - Design professionnel avec React et CSS responsif
- 🗄️ **Base de données SQLite** - Stockage local sans configuration
- 🚀 **Stack technique moderne** - Node.js, Express, React, Vite

## 🏗️ Architecture du Projet

```
Voyage/
├── backend/                    # API Express
│   ├── src/
│   │   ├── controllers/       # Contrôleurs API
│   │   ├── routes/            # Définition des routes
│   │   ├── models/            # Modèles de base de données
│   │   ├── utils/             # Utilitaires (export Excel)
│   │   └── db.js              # Configuration SQLite
│   ├── server.js              # Point d'entrée
│   ├── package.json
│   └── .env                   # Variables d'environnement
│
├── frontend/                   # Application React
│   ├── src/
│   │   ├── components/        # Composants React
│   │   │   ├── SurveyForm.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── styles/            # Fichiers CSS
│   │   ├── App.jsx            # Composant principal
│   │   ├── main.jsx           # Point d'entrée
│   │   └── index.css          # Styles globaux
│   ├── vite.config.js
│   ├── package.json
│   └── .env                   # Variables d'environnement
│
├── docker-compose.yml         # Configuration PostgreSQL
└── README.md
```

## 🚀 Installation et Configuration

### Prérequis

- **Node.js** (v18 ou supérieur) - [Télécharger](https://nodejs.org/)
- C'est tout! SQLite est inclus et ne nécessite aucune configuration externe

### 1. Installation des dépendances

```bash
# Naviguer au répertoire racine
cd /Users/jeobrankombou/Dev/Perso/FULLSTACK/Voyage

# Installer les dépendances backend et frontend
cd backend && npm install
cd ../frontend && npm install
```

La base de données SQLite se créera automatiquement au premier lancement du serveur.

### 2. Démarrage du Backend

```bash
# Naviguer dans le dossier backend
cd backend

# Installer les dépendances (si pas encore fait)
npm install

# Démarrer le serveur (mode développement avec hot-reload)
npm run dev

# Ou pour le mode production
npm start
```

Le serveur sera disponible à `http://localhost:5001`

### 3. Démarrage du Frontend

Ouvrir un nouveau terminal:

```bash
# Naviguer dans le dossier frontend
cd frontend

# Installer les dépendances (si pas encore fait)
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera disponible à `http://localhost:5173`

## 📱 Utilisation

### Ajouter des réponses au sondage

1. Rendez-vous sur la page **"Sondage"**
2. Remplissez les champs:
   - **Nom** * (obligatoire)
   - **Pays** * (obligatoire)
   - **Mois Disponibles** * (sélectionnez au moins un)
   - Durée du voyage (optionnel)
   - Budget (optionnel)
   - Activités intéressantes (optionnel)
   - Commentaires (optionnel)
3. Cliquez sur **"Soumettre"**

### Consulter les résultats

1. Cliquez sur l'onglet **"Résultats"**
2. Visualisez:
   - **Pays Populaires** - Top 5 des destinations
   - **Mois Populaires** - Quand voyager ensemble?
   - **Budget Moyen** - Fourchette budgétaire
   - **Tableau détaillé** - Tous les sondages

### Exporter en Excel

1. Cliquez sur le bouton **"📥 Télécharger Excel"** en haut à droite
2. Un fichier `voyage-survey-results.xlsx` se téléchargera avec:
   - Feuille 1: Toutes les réponses détaillées
   - Feuille 2: Statistiques générales
   - Feuille 3: Pays populaires
   - Feuille 4: Mois disponibles

## 🔧 API Endpoints

### Sondages

- **POST** `/api/surveys` - Ajouter une nouvelle réponse
  ```json
  {
    "name": "Jean",
    "country": "France",
    "month": "Juillet, Août",
    "duration": 14,
    "budget_min": 1000,
    "budget_max": 2000,
    "activities": "Randonnée, Plage",
    "comments": "Flexibilité sur les dates après le 15 juillet"
  }
  ```

- **GET** `/api/surveys` - Récupérer toutes les réponses

- **GET** `/api/surveys/stats` - Récupérer les statistiques

- **GET** `/api/surveys/overview` - Vue d'ensemble des résultats

### Exports

- **GET** `/api/export/excel` - Télécharger les résultats en Excel

## 🛠️ Commandes Utiles

### Backend
```bash
cd backend

npm run dev        # Mode développement avec hot-reload
npm start          # Mode production
npm run db:setup   # Créer les tables
npm run db:seed    # Remplir avec des données de test (optionnel)
```

### Frontend
```bash
cd frontend

npm run dev        # Mode développement
npm run build      # Build pour production
npm run preview    # Prévisualiser le build
```

### Base de données
```bash
# Réinitialiser la base de données (supprimer data/survey.db)
rm data/survey.db

# La base de données sera recréée au prochain lancement du serveur
npm run dev
```

## 📊 Structure de la Base de Données

### Table `surveys`
```sql
CREATE TABLE surveys (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  month VARCHAR(50) NOT NULL,
  duration INT,
  budget_min INT,
  budget_max INT,
  activities TEXT,
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 Partager le Sondage

Une fois l'application démarrée:

1. Chaque participant avec accès à `http://localhost:5173` peut voter
2. Les résultats sont visibles en temps réel
3. Exportez en Excel pour partager les résultats

## 🐛 Dépannage

### La base de données ne se charge pas
```bash
# Supprimer la base de données SQLite corrompue
rm data/survey.db data/survey.db-shm data/survey.db-wal

# Relancer le serveur (la base sera recréée)
cd backend
npm run dev
```

### Le frontend ne peut pas accéder à l'API
- Vérifier que le backend est démarré sur le port 5001
- Vérifier que `vite.config.js` pointe vers `http://localhost:5001`
- Nettoyer le cache: Ctrl+Shift+R (force refresh)

### Espace disque insuffisant
```bash
# Nettoyer les caches npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf backend/node_modules frontend/node_modules
npm install
```

## 📦 Dépendances Principales

### Backend
- **express** - Framework web
- **better-sqlite3** - Base de données SQLite
- **xlsx** - Export Excel
- **cors** - Gestion CORS
- **dotenv** - Variables d'environnement
- **nodemon** - Hot-reload en développement

### Frontend
- **react** - Framework UI
- **axios** - Requêtes HTTP
- **vite** - Bundler et dev server

## 🚀 Déploiement

Pour déployer en production sur des services comme **Vercel**, **Heroku**, ou **Azure**:

1. **Frontend**: Construire avec `npm run build` et déployer le dossier `dist/`
2. **Backend**: Déployer sur un serveur Node.js avec la variable `NODE_ENV=production`
3. **Database**: Utiliser une instance PostgreSQL gérée (AWS RDS, Azure Database, Heroku Postgres)

## 📝 License

Ce projet est fourni à titre d'exemple éducatif.

## 👥 Support

Pour des questions ou problèmes, consultez la documentation ou contactez le développeur.

---

**Créé avec ❤️ pour organiser vos voyages entre amis! 🌍✈️**
