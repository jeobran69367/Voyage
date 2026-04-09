#!/bin/bash

# Script pour démarrer l'application Voyage Survey

echo "🌍 Démarrage de l'application Voyage Survey..."
echo ""

# Démarrer PostgreSQL avec Docker Compose
echo "📦 Démarrage de PostgreSQL..."
docker-compose up -d postgres

# Attendre que la base de données soit prête
echo "⏳ Attendre que la base de données soit prête..."
sleep 5

# Démarrer le backend dans un nouveau terminal
echo "🚀 Démarrage du backend..."
cd backend
npm run dev &
BACKEND_PID=$!

# Petit délai pour que le backend démarre
sleep 3

# Démarrer le frontend dans un nouveau terminal
echo "🎨 Démarrage du frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application en cours de démarrage!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔌 Backend API: http://localhost:5000"
echo "🗄️ PostgreSQL: localhost:5432"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter tous les services"
echo ""

# Attendre que les deux processus se terminent
wait $BACKEND_PID $FRONTEND_PID
