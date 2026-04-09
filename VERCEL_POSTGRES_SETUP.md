# ✅ Configuration Rapide Vercel Postgres

Le déploiement actuel a une page blanche car **SQLite ne fonctionne pas sur Vercel** (pas de système de fichiers persistant).

## 🚀 Solution: Vercel Postgres (Gratuit!)

### Étape 1: Lier votre projet Vercel

```bash
vercel link
```

### Étape 2: Ajouter Vercel Postgres à votre projet

Dans le dashboard Vercel:
1. Allez à **Storage** → **Create database** → **Postgres**
2. Nommez-la `voyage` et validez
3. Cela crée automatiquement les variables d'environnement

### Étape 3: Extraire les variables d'environnement

```bash
vercel env pull
```

Cela va créer `.env.local` avec `POSTGRES_URLPRIVATE`

### Étape 4: Tester localement

```bash
# Backend en local (va utiliser Postgres maintenant)
cd backend
npm run dev
```

### Étape 5: Redéployer

```bash
git add .
git commit -m "Add Vercel Postgres support"
git push
```

Vercel va automatiquement redéployer avec la base de données configurée!

## 📝 Variables d'environnement Vercel

Una fois Vercel Postgres configuré, ces variables seront disponibles:
- `POSTGRES_URLPRIVATE` - Connection string
- `POSTGRES_URL` - Public connection string
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DATABASE` - Database name
- `POSTGRES_HOST` - Database host

## 🔄 Status actuel

✅ Frontend - Pages statiques (HTML, CSS, JS)  
✅ API Routes - Endpoints de base implémentées  
⏳ Database - À connecter à Vercel Postgres  

Dès que vous configurez Vercel Postgres, la base de données sera automatiquement initialisée!

## 🆘 Troubleshooting

**Vercel Postgres pas disponible?**
- Utilisez Supabase (https://supabase.com) - gratuit et facile
- Ou Redis + JSON pour le cache
- Ou MongoDB Atlas (entièrement gratuit)

**Besoin d'aide?**
```bash
# Vérifier la connexion Postgres
npx vercel env ls
```
