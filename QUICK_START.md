# 🚀 YojanaSaathi AI - Quick Start Guide

## Current Status

✅ **Admin Panel** - Fully working  
✅ **AI Chatbot** - Integrated (needs API key)  
✅ **Backend** - Running on port 3000  
✅ **Frontend** - Running on port 5174  

---

## 1️⃣ Start Servers

**Easiest Way:**
```
Double-click: START_SERVERS.bat
```

**Manual Way:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 2️⃣ Access Admin Panel

### Login:
- URL: http://localhost:5174/auth
- Email: `subh@gmail.com`
- Password: `Subh@8617`

### After Login:
- Look for orange "Admin" button in header (top right)
- Click it to access admin dashboard
- Add/edit/delete government schemes

---

## 3️⃣ Setup AI Chatbot

### Get API Key:
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Create API key
4. Copy it

### Add to .env:
```bash
# Open: frontend/.env
# Add this line:
VITE_GEMINI_API_KEY=your_api_key_here
```

### Restart Frontend:
```bash
cd frontend
npm run dev
```

### Test Chatbot:
- Look for orange floating button (bottom-right)
- Click it to open chat
- Ask: "What is PM-KISAN scheme?"

---

## 📁 Important Files

### Documentation:
- `ADMIN_PANEL_COMPLETE_GUIDE.md` - Full admin panel guide
- `AI_CHATBOT_SETUP_GUIDE.md` - Complete chatbot setup
- `ADMIN_LOGIN_CREDENTIALS.md` - Login details
- `START_SERVERS.bat` - Easy server startup

### Configuration:
- `backend/.env` - Backend config (MySQL, JWT)
- `frontend/.env` - Frontend config (API URLs, Gemini key)

---

## 🎯 What You Can Do

### As Admin:
1. ✅ View dashboard statistics
2. ✅ Add new government schemes
3. ✅ Edit existing schemes
4. ✅ Delete schemes
5. ✅ View all applications
6. ✅ View all users

### As User:
1. ✅ Register and login
2. ✅ Create profile
3. ✅ Browse schemes
4. ✅ Apply for schemes
5. ✅ Track applications
6. ✅ Chat with AI assistant

---

## 🔧 Troubleshooting

### Servers not starting?
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Wait 2 seconds, then use START_SERVERS.bat
```

### Admin button not showing?
1. Logout
2. Login again with subh@gmail.com
3. Button should appear

### Chatbot not responding?
1. Add VITE_GEMINI_API_KEY to frontend/.env
2. Restart frontend server
3. Check browser console (F12)

---

## 📞 Quick Links

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:3000/api
- **Backend Health**: http://localhost:3000/health
- **Admin Panel**: http://localhost:5174/admin
- **Get Gemini Key**: https://makersuite.google.com/app/apikey

---

## ✅ Checklist

- [ ] Servers running (START_SERVERS.bat)
- [ ] Can login as admin (subh@gmail.com / Subh@8617)
- [ ] Admin button visible in header
- [ ] Can access admin panel
- [ ] Gemini API key added to .env
- [ ] Chatbot responding to questions

---

**Everything is ready! Follow the steps above to get started.** 🎉
