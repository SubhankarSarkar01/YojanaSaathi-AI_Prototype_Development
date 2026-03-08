# YojanaSaathi AWS EC2 Deployment Guide

## 📋 Prerequisites
- AWS EC2 instance (Ubuntu) running
- MySQL installed on EC2
- SSH key (.pem file) for EC2 access
- GitHub repository with your code

## 🔧 Deployment Information
- **EC2 Public IP**: 13.235.103.82
- **GitHub Pages URL**: https://subhankarsarkar01.github.io/YojanaSaathi-AI_Prototype_Development/
- **GitHub Repo**: https://github.com/SubhankarSarkar01/YojanaSaathi-AI_Prototype_Development
- **Database**: yojanasaathi
- **Backend Port**: 3000

---

## 🚀 STEP 1: SSH Into Your EC2 Instance

```bash
ssh -i "your-key.pem" ubuntu@13.235.103.82
```

**Note**: Replace `your-key.pem` with your actual key file name.

---

## 📦 STEP 2: Clone Your Repository

```bash
cd ~
git clone https://github.com/SubhankarSarkar01/YojanaSaathi-AI_Prototype_Development.git
cd YojanaSaathi-AI_Prototype_Development/backend
```

---

## 🔐 STEP 3: Create .env File

Copy the production environment file:

```bash
cp .env.production .env
```

Or create it manually:

```bash
nano .env
```

Paste this content:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database (MySQL)
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=Subh@8617
DB_NAME=yojanasaathi

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-CHANGE-ME
JWT_EXPIRES_IN=7d

# Frontend URL (GitHub Pages)
FRONTEND_URL=https://subhankarsarkar01.github.io

# Redis (OPTIONAL)
REDIS_HOST=
REDIS_PORT=

# Gemini AI
GEMINI_API_KEY=AIzaSyDUSE8AbokZf7fPm7WMh0xfS-Om7ngGljQ
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
GEMINI_MODEL=gemini-2.5-flash
```

Save and exit: `Ctrl + X`, then `Y`, then `Enter`

---

## 🗄️ STEP 4: Setup MySQL Database

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database (if not exists)
CREATE DATABASE IF NOT EXISTS yojanasaathi;

# Create user and grant privileges (optional, for security)
CREATE USER IF NOT EXISTS 'yojana_user'@'localhost' IDENTIFIED BY 'Subh@8617';
GRANT ALL PRIVILEGES ON yojanasaathi.* TO 'yojana_user'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

---

## 🏗️ STEP 5: Run Deployment Script

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

This script will:
- Install Node.js 18
- Install PM2
- Install dependencies
- Build TypeScript project
- Start the application with PM2
- Configure PM2 to start on boot

---

## 🔍 STEP 6: Verify Deployment

Check if the app is running:

```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs yojanasaathi-backend --lines 50

# Test API locally
curl http://localhost:3000/health

# Test API from public IP
curl http://13.235.103.82:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-03-08T..."}
```

---

## 🔒 STEP 7: Configure AWS Security Group

**CRITICAL**: Open these ports in AWS Console:

1. Go to: **AWS Console → EC2 → Security Groups**
2. Select your instance's security group
3. Click **Edit Inbound Rules**
4. Add these rules:

| Type       | Protocol | Port | Source    | Description        |
|------------|----------|------|-----------|-------------------|
| Custom TCP | TCP      | 3000 | 0.0.0.0/0 | Backend API       |
| HTTP       | TCP      | 80   | 0.0.0.0/0 | HTTP Traffic      |
| SSH        | TCP      | 22   | My IP     | SSH Access        |

**⚠️ IMPORTANT**: 
- **DO NOT** open port 3306 (MySQL) to public
- Keep MySQL accessible only from localhost (127.0.0.1)

---

## 🌐 STEP 8: Test From Browser

Open your browser and test:

1. **Health Check**: http://13.235.103.82:3000/health
2. **API Endpoint**: http://13.235.103.82:3000/api/schemes

You should see JSON responses.

---

## 📱 STEP 9: Deploy Frontend to GitHub Pages

Your frontend is already configured to use the EC2 backend.

### Build and Deploy:

```bash
# On your local machine
cd frontend
npm run build

# The build output will be in frontend/dist/
# Deploy this to GitHub Pages
```

### GitHub Pages Setup:

1. Go to your repo: https://github.com/SubhankarSarkar01/YojanaSaathi-AI_Prototype_Development
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: **main** (or gh-pages)
5. Folder: **/ (root)** or **/docs** (depending on where you put the build)

**OR** use GitHub Actions to auto-deploy on push.

---

## 🔄 STEP 10: Update Application (After Code Changes)

When you push new code to GitHub:

```bash
# SSH into EC2
ssh -i "your-key.pem" ubuntu@13.235.103.82

# Navigate to project
cd ~/YojanaSaathi-AI_Prototype_Development/backend

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Rebuild TypeScript
npm run build

# Restart PM2
pm2 restart yojanasaathi-backend

# Check logs
pm2 logs yojanasaathi-backend --lines 30
```

---

## 🛠️ Useful PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs yojanasaathi-backend

# Restart app
pm2 restart yojanasaathi-backend

# Stop app
pm2 stop yojanasaathi-backend

# Delete app from PM2
pm2 delete yojanasaathi-backend

# Monitor in real-time
pm2 monit
```

---

## 🐛 Troubleshooting

### Issue: API not responding

```bash
# Check if app is running
pm2 status

# Check logs for errors
pm2 logs yojanasaathi-backend --lines 100

# Check if port 3000 is in use
sudo netstat -tulpn | grep 3000

# Restart the app
pm2 restart yojanasaathi-backend
```

### Issue: MySQL connection error

```bash
# Check MySQL status
sudo systemctl status mysql

# Test MySQL connection
mysql -u root -p -e "SHOW DATABASES;"

# Check if database exists
mysql -u root -p -e "USE yojanasaathi; SHOW TABLES;"
```

### Issue: CORS errors in browser

- Make sure FRONTEND_URL in .env matches your GitHub Pages URL exactly
- Check browser console for specific CORS error messages
- Verify Security Group allows port 3000

### Issue: Port 3000 already in use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process (replace PID with actual process ID)
sudo kill -9 PID

# Restart PM2
pm2 restart yojanasaathi-backend
```

---

## ✅ Deployment Checklist

- [ ] SSH into EC2 instance
- [ ] Clone GitHub repository
- [ ] Create .env file with correct values
- [ ] Run deploy.sh script
- [ ] Verify PM2 is running the app
- [ ] Open AWS Security Group ports (3000, 80, 22)
- [ ] Test API: http://13.235.103.82:3000/health
- [ ] Build frontend with production .env
- [ ] Deploy frontend to GitHub Pages
- [ ] Test full application from GitHub Pages URL

---

## 🎯 Final API URLs

**Backend API Base URL**: `http://13.235.103.82:3000/api`

**Frontend URL**: `https://subhankarsarkar01.github.io/YojanaSaathi-AI_Prototype_Development/`

**API Endpoints**:
- Health: http://13.235.103.82:3000/health
- Schemes: http://13.235.103.82:3000/api/schemes
- Auth: http://13.235.103.82:3000/api/auth/login
- Profile: http://13.235.103.82:3000/api/profile

---

## 📞 Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs yojanasaathi-backend`
2. Check MySQL status: `sudo systemctl status mysql`
3. Verify Security Group settings in AWS Console
4. Test API locally first: `curl http://localhost:3000/health`

---

**Good luck with your deployment! 🚀**
