#!/bin/bash

echo "========================================="
echo "  YojanaSaathi Backend Deployment"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}[1/8] Updating system packages...${NC}"
sudo apt update -y
sudo apt upgrade -y

echo -e "${YELLOW}[2/8] Installing Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
echo -e "${GREEN}✓ Node.js version:${NC}"
node -v
echo -e "${GREEN}✓ NPM version:${NC}"
npm -v

echo -e "${YELLOW}[3/8] Installing PM2 globally...${NC}"
sudo npm install -g pm2
pm2 -v

echo -e "${YELLOW}[4/8] Installing project dependencies...${NC}"
npm install

echo -e "${YELLOW}[5/8] Building TypeScript project...${NC}"
npm run build

echo -e "${YELLOW}[6/8] Checking .env file...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}✗ .env file not found!${NC}"
    echo -e "${YELLOW}Creating .env from .env.production...${NC}"
    cp .env.production .env
fi
echo -e "${GREEN}✓ .env file exists${NC}"

echo -e "${YELLOW}[7/8] Starting application with PM2...${NC}"
pm2 stop yojanasaathi-backend 2>/dev/null || true
pm2 delete yojanasaathi-backend 2>/dev/null || true
pm2 start dist/server.js --name "yojanasaathi-backend"
pm2 save

echo -e "${YELLOW}[8/8] Configuring PM2 to start on boot...${NC}"
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
pm2 save

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${GREEN}✓ Application Status:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}Testing API endpoint...${NC}"
sleep 3
curl http://localhost:3000/health || echo -e "${RED}API not responding yet${NC}"

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}  Next Steps:${NC}"
echo -e "${GREEN}=========================================${NC}"
echo "1. Check PM2 logs: pm2 logs yojanasaathi-backend"
echo "2. Test API: curl http://localhost:3000/health"
echo "3. Open AWS Security Group ports (3000, 80)"
echo "4. Test from browser: http://13.235.103.82:3000/health"
echo ""
