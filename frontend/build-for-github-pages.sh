#!/bin/bash

echo "========================================="
echo "  Building Frontend for GitHub Pages"
echo "========================================="
echo ""

# Use production environment
export NODE_ENV=production

echo "[1/3] Installing dependencies..."
npm install

echo "[2/3] Building for production..."
npm run build

echo "[3/3] Build complete!"
echo ""
echo "✓ Build output is in: frontend/dist/"
echo ""
echo "Next steps:"
echo "1. Copy the contents of frontend/dist/ to your GitHub Pages branch"
echo "2. Or configure GitHub Actions to auto-deploy"
echo ""
echo "Your frontend will be available at:"
echo "https://subhankarsarkar01.github.io/YojanaSaathi-AI_Prototype_Development/"
echo ""
