# Railway Deployment Guide - YojanaSaathi

## Prerequisites
- Railway account (https://railway.app)
- GitHub repository connected to Railway
- MySQL database service added in Railway

## Step 1: Create Railway Project

1. Go to https://railway.app and login
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `YojanaSaathi-AI_Prototype_Development` repository
5. Select the `backend` folder as the root directory

## Step 2: Add MySQL Database

1. In your Railway project, click "New Service"
2. Select "Database" → "MySQL"
3. Railway will automatically create a MySQL instance
4. Note: Railway provides these variables automatically:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

## Step 3: Configure Environment Variables

In Railway project settings, add these variables:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=yojanasaathi-super-secret-2024
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://subhankarsarkar01.github.io
GEMINI_API_KEY=AIzaSyDUSE8AbokZf7fPm7WMh0xfS-Om7ngGljQ
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
GEMINI_MODEL=gemini-2.5-flash
```

**Note**: Database variables (DB_HOST, DB_PORT, etc.) are automatically injected by Railway from the MySQL service.

## Step 4: Configure Build Settings

Railway should auto-detect your Node.js project. Verify these settings:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `backend` (if deploying from monorepo)

## Step 5: Deploy

1. Railway will automatically deploy when you push to GitHub
2. Monitor the deployment logs in Railway dashboard
3. Once deployed, Railway will provide a public URL like: `https://your-app.up.railway.app`

## Step 6: Run Database Migrations

After first deployment, run migrations:

1. In Railway dashboard, go to your backend service
2. Click "Settings" → "Variables"
3. Open the service shell/terminal
4. Run: `npm run migrate`

Or use Railway CLI:
```bash
railway run npm run migrate
```

## Step 7: Update Frontend API URL

Update your frontend to use the Railway backend URL:

1. Edit `frontend/.env.production`:
```
VITE_API_URL=https://your-app.up.railway.app/api
VITE_GEMINI_API_KEY=AIzaSyAM3YLcJUSa32oVpv-G0C3CoiCfnCvHkYE
```

2. Rebuild and redeploy frontend to GitHub Pages:
```bash
cd frontend
npm run build
git add dist -f
git commit -m "Update API URL for Railway"
git push
```

## Step 8: Test the Deployment

Test your API endpoints:

```bash
# Health check
curl https://your-app.up.railway.app/health

# Test login
curl -X POST https://your-app.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"subh@gmail.com","password":"Subh@8617"}'
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL service is running in Railway
- Check that database variables are properly linked
- Review logs: Railway Dashboard → Service → Deployments → View Logs

### Build Failures
- Ensure `tsconfig.json` is properly configured
- Check that all dependencies are in `package.json`
- Verify TypeScript compiles locally: `npm run build`

### CORS Errors
- Verify `FRONTEND_URL` matches your GitHub Pages URL exactly
- Check Railway logs for CORS-related errors
- Ensure credentials are enabled in CORS config

### Port Issues
- Railway automatically assigns PORT via environment variable
- Your app must listen on `process.env.PORT` (already configured)

## Railway-Specific Notes

1. **Automatic Deployments**: Railway auto-deploys on git push
2. **Environment Variables**: Railway injects MySQL variables automatically when services are linked
3. **Logs**: Access via Railway Dashboard → Service → Deployments
4. **Custom Domain**: Can add custom domain in Railway settings
5. **Scaling**: Railway handles scaling automatically

## Cost Considerations

- Railway offers $5 free credit per month
- MySQL database and backend service will consume credits
- Monitor usage in Railway dashboard
- Consider upgrading to paid plan for production use

## Next Steps After Deployment

1. Test all API endpoints
2. Verify database migrations ran successfully
3. Test authentication flow
4. Test file uploads (documents)
5. Test admin panel functionality
6. Test AI chatbot integration
7. Monitor Railway logs for any errors

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project Issues: GitHub repository issues page
