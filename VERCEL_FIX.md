# 🚀 Déploiement Vercel - Guide Complet

## ⚠️ Problème Actuel

La page affiche vide car:
1. **SQLite ne fonctionne pas sur Vercel** - Pas de système de fichiers persistant
2. **API serverless retourne des données vides** - À attendre l'initialisation DB

## 🔧 Solution Immédiate (3 étapes)

### 1. **Tester Localement** ✅

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

Visitez http://localhost:5173 - L'app doit fonctionner normalement!

### 2. **Configurer Vercel Postgres** 

```bash
# Depuis la racine du projet
vercel link

# Ajouter Postgres dans le dashboard Vercel
# Storage → Create Database → Postgres → "voyage"

# Pull les variables d'environnement
vercel env pull
```

Cela crée `.env.local` avec:
```
POSTGRES_URLPRIVATE=postgres://...
```

### 3. **Redéployer**

```bash
git add .
git commit -m "Configure Vercel Postgres and fix deployment"
git push
```

Vercel verra `POSTGRES_URLPRIVATE` et:
- Activera automatiquement Postgres au lieu de SQLite
- Créera les tables automatiquement
- Répondra avec des données réelles!

## 📊 Architecture de Déploiement

```
Frontend (React + Vite)
    ↓
Vercel Static Output (/dist)
    ↓
Routes:
  /api/* → Serverless Function (Node.js)
  /* → index.html (SPA)
    ↓
Vercel Postgres (Cloud Database)
```

## ✅ Checklist

- [x] Frontend build optimisé
- [x] API serverless function prête
- [x] vercel.json correctement configuré
- [ ] Vercel Postgres connecté
- [ ] Tables créées
- [ ] Données persistes

## 🐛 Debugging

**Vercel logs:**
```bash
vercel logs --follow
```

**Local test API:**
```bash
curl http://localhost:5001/api/surveys
# Doit retourner: []
```

**Check Postgres:**
```bash
# Une fois Postgres configuré
vercel env ls
# Doit afficher POSTGRES_URLPRIVATE
```

## 🎯 Prochaines Étapes

1. ✅ Push le code actuel
2. ⏳ Configurer Vercel Postgres (3 min)
3. ⏳ Trigger rebuild Vercel
4. ✅ App prête!

---

**Notes techniques:**
- `db.js` détecte automatiquement l'environnement (SQLite local, Postgres prod)
- `api/index.js` gère les requêtes sans DB (retourne données vides)
- Routes Vercel routent correctement les chemins statiques et dynamiques
