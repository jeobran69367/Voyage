# 🚀 Déploiement Rapide sur Vercel

## 3 Étapes Simplifiées

### 1️⃣ Préparez GitHub
```bash
# À la racine du projet
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2️⃣ Créez le Projet Vercel
1. Allez sur https://vercel.com/new
2. Sélectionnez votre repo
3. Cliquez "Import"

### 3️⃣ Configurez & Déployez
- **Framework**: Vue/Next (ignored)
- **Build**: `cd frontend && npm install && npm run build`
- **Output**: `frontend/dist`
- **Root**: `.`
- **Env Variables**: 
  - `NODE_ENV=production`
  - `VITE_API_URL=` (rempli automatiquement une fois déployé)

Cliquez "Deploy" ✨

## Votre App en Live

Une fois déployée:
- 🌐 **Site**: `https://your-project.vercel.app`
- 📡 **API**: `https://your-project.vercel.app/api`
- ✅ **Health**: `https://your-project.vercel.app/api/health`

## ⚙️ Configuration Post-Déploiement

Si vous avez des erreurs, allez à Project Settings:

1. **Build & Deployment** → Rebuild si nécessaire
2. **Environment Variables** → Ajoutez les variables
3. **Deployments** → Voir les logs

## 🎯 Pro Tips

- Les builds prennent ~2-3 min
- Chaque push vers `main` redéploie automatiquement
- Consultez les logs en temps réel sur Vercel
- Le SQLite fonctionne mais ne persiste pas - utilisez une DB cloud pour la production

---

**C'est tout!** Votre app Voyage Survey tourne sur Vercel! 🌍✈️
