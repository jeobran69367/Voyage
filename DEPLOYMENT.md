# 🚀 Guide de Déploiement sur Vercel

## Prérequis
- Compte Vercel ([signup](https://vercel.com/signup))
- Code poussé sur GitHub

## Étapes de Déploiement

### 1. Pousser sur GitHub

```bash
# Si pas encore fait
git init
git add .
git commit -m "Initial commit: Voyage Survey App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/voyage-survey.git
git push -u origin main
```

### 2. Connecter à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "New Project"
3. Sélectionnez votre repo GitHub
4. Cliquez sur "Import"

### 3. Configurer le Projet

**Framework**: Vite
**Build Command**: `cd frontend && npm install && npm run build`
**Output Directory**: `frontend/dist`
**Root Directory**: `.` (racine)

### 4. Ajouter les Variables d'Environnement

Dans les paramètres du projet Vercel, allez à "Settings" → "Environment Variables" et ajoutez:

```
NODE_ENV=production
DATABASE_TYPE=sqlite
```

### 5. Déployer

Cliquez sur "Deploy" - Vercel construira et déploiera automatiquement!

## Architecture de Déploiement

```
Frontend (React/Vite)
  ↓
  Déployé sur Vercel CDN (auto-scaling)
  ↓
  API appelle → /api/*
  ↓
Backend (Express) 
  ↓
  Déployé comme Serverless Functions
  ↓
SQLite (local)
```

## URLs Après Déploiement

- **Frontend**: `https://your-project.vercel.app`
- **API**: `https://your-project.vercel.app/api`
- **Health Check**: `https://your-project.vercel.app/api/health`

## Limitations à Connaître

### SQLite sur Vercel
- ✅ Fonctionne pour le développement
- ⚠️ Données perdues à chaque redéploiement (fs éphémère)
- ❌ Pas idéal pour la production

### Solution pour la Production

Remplacez SQLite par PostgreSQL:

1. Créez une base PostgreSQL gratuite sur [Render](https://render.com) ou [Railway](https://railway.app)
2. Mettez à jour le backend pour utiliser PostgreSQL
3. Ajoutez la `DATABASE_URL` aux variables d'environnement Vercel

```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## Dépannage

### Erreur "Module not found"
```bash
# Vérifier que tous les imports sont relatifs
# Vérifier package.json dans backend et frontend
```

### API retourne 503
- Vérifier les logs Vercel
- S'assurer que la DB est accessible
- Augmenter le timeout serverless

### Données perdues après déploiement
- SQLite ne persist pas entre redéploiements
- Utiliser une DB cloud externe

## Commandes Utiles

```bash
# Test local avant déploiement
npm run build

# Vérifier la configuration Vercel
cat vercel.json

# Voir les logs de déploiement
vercel logs --follow
```

---

Bon déploiement! 🎉
