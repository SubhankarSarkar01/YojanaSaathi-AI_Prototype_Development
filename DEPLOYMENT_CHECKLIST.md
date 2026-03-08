# ✅ Deployment Checklist

## 📦 What Was Done

### ✅ Backend Preparation (Completed)
- [x] Updated MySQL connection to use 127.0.0.1
- [x] Added connection pooling and timeout settings
- [x] Disabled synchronize in production
- [x] Updated CORS to include GitHub Pages URL
- [x] Created .env.production with EC2 configuration
- [x] Created .env.example template
- [x] Created deploy.sh (full deployment script)
- [x] Created quick-deploy.sh (quick update script)
- [x] Added deployment scripts to package.json
- [x] Verified all TypeScript files compile without errors

### ✅ Frontend Preparation (Completed)
- [x] Updated API URL to EC2 IP (13.235.103.82:3000)
- [x] Created .env.production with production API URLs
- [x] Created build script for GitHub Pages
- [x] Created GitHub Actions workflow for auto-deploy
- [x] Verified all TypeScript files compile without errors

### ✅ Documentation (Completed)
- [x] Created DEPLOYMENT_GUIDE.md (detailed steps)
- [x] Created DEPLOYMENT_SUMMARY.md (quick overview)
- [x] Created backend/README_DEPLOYMENT.md (quick reference)
- [x] Created this checklist

---

## 🎯 Your Next Steps

### STEP 1: Deploy Backend to EC2

```bash
# 1. SSH into your EC2 instance
ssh -i "your-key.pem" ubuntu@13.235.103.82

# 2. Clone repository
git clone https://github.com/SubhankarSarkar01/YojanaSaathi-AI_Prototype_Development.git
cd YojanaSaathi-AI_Prototype_Development/backend

# 3. Setup environment
cp .env.production .env

# 4. Run deployment script
chmod +x deploy.sh
./deploy.sh

# 5. Verify it's running
pm2 status
curl http://localhost:3000/health
```

### STEP 2: Configure AWS Security Group

Go to AWS Console and add these inbound rules:

| Type       | Port | Source    | Description   |
|------------|------|-----------|---------------|
| Custom TCP | 3000 | 0.0.0.0/0 | Backend API   |
| HTTP       | 80   | 0.0.0.0/0 | HTTP Traffic  |
| SSH        | 22   | My IP     | SSH Access    |

**⚠️ DO NOT open port 3306 (MySQL)**

### STEP 3: Test Backend API

```bash
# From your browser or terminal:
curl http://13.235.103.82:3000/health
curl http://13.235.103.82:3000/api/schemes
```

Expected: JSON responses

### STEP 4: Build and Deploy Frontend

```bash
# On your local machine
cd frontend
npm install
npm run build

# The build will be in frontend/dist/
```

Then deploy to GitHub Pages:
- **Option A**: Push dist/ contents to gh-pages branch
- **Option B**: Use GitHub Actions (already configured - just push to main)
- **Option C**: Manual upload via GitHub web interface

### STEP 5: Configure GitHub Pages

1. Go to: https://github.com/SubhankarSarkar01/YojanaSaathi-AI_Prototype_Development/settings/pages
2. Source: **GitHub Actions** (recommended) or **Deploy from branch**
3. If using branch: Select **gh-pages** or **main** branch
4. Save

### STEP 6: Test Full Application

Open: https://subhankarsarkar01.github.io/YojanaSaathi-AI_Prototype_Development/

Test:
- [ ] Homepage loads
- [ ] Can browse schemes
- [ ] Can login/register
- [ ] Can create profile
- [ ] Chatbot works
- [ ] Voice search works
- [ ] Language switching works

---

## 📋 Files You Need to Copy to EC2

Only these files need to be on EC2:
1. `.env` (created from .env.production)
2. All backend source code (via git clone)

Everything else is handled by the deployment scripts!

---

## 🔄 Update Workflow (After Code Changes)

```bash
# 1. Push changes to GitHub
git add .
git commit -m "Your changes"
git push origin main

# 2. SSH into EC2
ssh -i "your-key.pem" ubuntu@13.235.103.82

# 3. Update and restart
cd ~/YojanaSaathi-AI_Prototype_Development/backend
git pull
./quick-deploy.sh

# 4. Frontend auto-deploys via GitHub Actions
# (or manually build and push to gh-pages branch)
```

---

## 🎉 Success Indicators

You'll know deployment is successful when:

1. ✅ `pm2 status` shows app running
2. ✅ `curl http://localhost:3000/health` returns `{"status":"ok"}`
3. ✅ `curl http://13.235.103.82:3000/health` returns `{"status":"ok"}`
4. ✅ GitHub Pages site loads without errors
5. ✅ Can login and use all features

---

## 📞 Need Help?

Check these in order:
1. PM2 logs: `pm2 logs yojanasaathi-backend`
2. MySQL status: `sudo systemctl status mysql`
3. Security Group settings in AWS Console
4. Browser console for frontend errors

---

**Ready to deploy! Start with DEPLOYMENT_GUIDE.md for detailed instructions.** 🚀
