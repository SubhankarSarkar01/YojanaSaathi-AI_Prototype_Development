# Backend Deployment Quick Reference

## 🎯 Your Configuration

- **EC2 IP**: 13.235.103.82
- **API URL**: http://13.235.103.82:3000/api
- **GitHub Pages**: https://subhankarsarkar01.github.io/YojanaSaathi-AI_Prototype_Development/

## ⚡ Quick Commands

### First Time Deployment
```bash
ssh -i "your-key.pem" ubuntu@13.235.103.82
git clone https://github.com/SubhankarSarkar01/YojanaSaathi-AI_Prototype_Development.git
cd YojanaSaathi-AI_Prototype_Development/backend
cp .env.production .env
chmod +x deploy.sh
./deploy.sh
```

### Update Deployment
```bash
ssh -i "your-key.pem" ubuntu@13.235.103.82
cd ~/YojanaSaathi-AI_Prototype_Development/backend
git pull
chmod +x quick-deploy.sh
./quick-deploy.sh
```

### Check Status
```bash
pm2 status
pm2 logs yojanasaathi-backend
curl http://localhost:3000/health
```

### Restart Application
```bash
pm2 restart yojanasaathi-backend
```

## 🔒 Security Checklist

- [x] MySQL password in .env (not in code)
- [x] JWT secret configured
- [x] CORS configured for GitHub Pages
- [ ] AWS Security Group: Port 3000 open
- [ ] AWS Security Group: Port 3306 CLOSED to public
- [ ] SSH key permissions: chmod 400 your-key.pem

## 📊 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs yojanasaathi-backend --lines 100

# Check system resources
htop
```

## 🆘 Emergency Commands

```bash
# Stop everything
pm2 stop all

# Restart everything
pm2 restart all

# View all PM2 processes
pm2 list

# Clear PM2 logs
pm2 flush
```
