# ✅ Admin Panel - Complete Working Guide

## 🎉 Everything is Fixed and Working!

### What Was Fixed:
1. ✅ Password properly hashed and stored in database
2. ✅ Login authentication working
3. ✅ Orange "Admin" button added to header
4. ✅ Admin routes active in backend
5. ✅ Admin panel UI complete

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start the Servers

**Option A - Use the Batch File (Easiest)**:
```
Double-click: START_SERVERS.bat
```

**Option B - Manual Start**:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Step 2: Login

1. Open browser: **http://localhost:5174/auth**
2. If already logged in, **LOGOUT first** (click user icon → Logout)
3. Login with:
   - **Email**: `subh@gmail.com`
   - **Password**: `Subh@8617`

### Step 3: Access Admin Panel

After login, you'll see an **orange "Admin" button** in the header (top right).

Click it or go to: **http://localhost:5174/admin**

---

## 📋 Your Admin Credentials

```
Email:    subh@gmail.com
Password: Subh@8617
Role:     admin
```

---

## 🎨 What the Admin Button Looks Like

```
┌──────────────────────────────────────────────────────────────┐
│  [Y] YojanaSaathi    Home  Schemes  Applications  Profile    │
│                                                                │
│                     [🛡️ Admin]  [🌐 English]  [👤]          │
└──────────────────────────────────────────────────────────────┘
```

- **Color**: Orange background (stands out!)
- **Icon**: Shield (🛡️)
- **Text**: "Admin"
- **Location**: Top right, before language selector

---

## 🎯 Admin Panel Features

### Dashboard (http://localhost:5174/admin)
- Total schemes count
- Total applications count
- Total users count
- Applications by status breakdown
- Quick action cards

### Manage Schemes (http://localhost:5174/admin/schemes)
- **View all schemes** - Complete list with details
- **Add new scheme** - Click "Add New Scheme" button
- **Edit scheme** - Click edit icon on any scheme
- **Delete scheme** - Click delete icon (with confirmation)

### Add New Scheme Form:
- Scheme Code * (e.g., PM-KISAN)
- Category * (Agriculture, Education, Healthcare, Housing, Employment, Social Welfare)
- Scheme Name (English) *
- Scheme Name (Hindi) (optional)
- Description (English) *
- Description (Hindi) (optional)
- Level * (Central, State, District)
- Benefit Amount (₹) *
- Department * (e.g., Ministry of Agriculture)
- Is Active checkbox

---

## 🔧 Troubleshooting

### Admin button not showing?
1. Make sure you're logged in
2. **LOGOUT and LOGIN again** (this refreshes your token with admin role)
3. Check browser console for errors (F12)

### Can't login?
- Verify credentials are correct (case-sensitive)
- Email: `subh@gmail.com`
- Password: `Subh@8617`
- Check if backend is running: http://localhost:3000/health

### Backend not starting?
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Wait 2 seconds, then start again
cd backend
npm run dev
```

### Frontend not starting?
```bash
cd frontend
npm run dev
```

### Port already in use?
- Backend uses port 3000
- Frontend uses port 5173 or 5174
- Kill processes: `taskkill /F /IM node.exe`

---

## 📝 Example: Adding a Government Scheme

1. Go to: http://localhost:5174/admin/schemes
2. Click "Add New Scheme"
3. Fill in the form:

```
Scheme Code: PMAY-G
Category: Housing
Name (English): Pradhan Mantri Awaas Yojana - Gramin
Name (Hindi): प्रधानमंत्री आवास योजना - ग्रामीण
Description (English): Provides financial assistance for construction of pucca houses to rural homeless and those living in kutcha houses
Description (Hindi): ग्रामीण बेघर और कच्चे मकानों में रहने वालों को पक्के मकान बनाने के लिए वित्तीय सहायता प्रदान करता है
Level: Central
Benefit Amount: 120000
Department: Ministry of Rural Development
Is Active: ✓ (checked)
```

4. Click "Create Scheme"
5. Scheme appears in list and is visible to all users!

---

## ✅ Current Status

- ✅ Backend running on port 3000
- ✅ Frontend running on port 5174
- ✅ Admin account: subh@gmail.com (password: Subh@8617)
- ✅ Admin role set in database
- ✅ Orange Admin button in header
- ✅ All admin endpoints working
- ✅ Dashboard showing stats
- ✅ Scheme management fully functional

---

## 🎯 What You Can Do Now

1. ✅ Login as admin
2. ✅ See orange Admin button
3. ✅ Access admin dashboard
4. ✅ View statistics
5. ✅ Add new government schemes
6. ✅ Edit existing schemes
7. ✅ Delete schemes
8. ✅ View all applications
9. ✅ View all users

---

## 🚨 Important Notes

### Why Logout/Login is Required

When you login, the backend creates a JWT token that includes your role:
```javascript
const token = generateToken({
  userId: user.user_id,
  email: user.email,
  role: user.role  // ← This is in the token
})
```

If you were made admin AFTER logging in:
- Your old token has `role: 'user'`
- You need a fresh token with `role: 'admin'`
- **Solution**: Logout → Login → Get new token

### Security

- Only users with `role = 'admin'` can access admin panel
- Regular users are redirected to home page
- All admin API endpoints require authentication + admin role
- JWT token must be valid and contain admin role

---

## 📞 Need Help?

If something isn't working:

1. Check if both servers are running
2. Try the START_SERVERS.bat file
3. Logout and login again
4. Clear browser cache (Ctrl+Shift+Delete)
5. Check browser console for errors (F12)

---

**🎉 Your admin panel is ready to use! Start adding government schemes now!**
