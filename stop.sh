#!/bin/bash

# Script pour arrêter l'application

echo "🛑 Arrêt de l'application Voyage Survey..."

# Arrêter Docker Compose
docker-compose down

echo "✅ Application arrêtée!"
