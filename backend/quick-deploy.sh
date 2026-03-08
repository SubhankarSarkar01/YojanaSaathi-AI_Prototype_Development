#!/bin/bash
# Quick deployment script - Run this on EC2

set -e  # Exit on error

echo "🚀 Quick Deploy Script"
echo "====================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file first:"
    echo "  cp .env.production .env"
    echo "  nano .env  # Edit with your values"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build TypeScript
echo "🏗️  Building project..."
npm run build

# Restart PM2
echo "🔄 Restarting application..."
pm2 restart yojanasaathi-backend || pm2 start dist/server.js --name "yojanasaathi-backend"
pm2 save

# Show status
echo "✅ Deployment complete!"
pm2 status
pm2 logs yojanasaathi-backend --lines 20
