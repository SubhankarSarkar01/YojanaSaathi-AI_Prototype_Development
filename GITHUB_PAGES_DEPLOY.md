# 🚀 Deploying YojanaSaathi AI on GitHub Pages

> **Important:** GitHub Pages only hosts **static files** (HTML, CSS, JS). It can deploy the **frontend** only. The backend (Node.js) and AI services (Python/FastAPI) must be hosted separately (e.g., Render, Railway, Vercel Serverless, AWS).

---

## 📋 Table of Contents

1. [Prerequisites](#-prerequisites)
2. [Security Checklist](#-security-checklist-before-deploying)
3. [Step 1 — Configure Vite for GitHub Pages](#step-1--configure-vite-for-github-pages)
4. [Step 2 — Switch to HashRouter](#step-2--switch-to-hashrouter)
5. [Step 3 — Create GitHub Actions Workflow](#step-3--create-github-actions-workflow)
6. [Step 4 — Push and Enable GitHub Pages](#step-4--push-and-enable-github-pages)
7. [Step 5 — Connect to Backend (Optional)](#step-5--connect-to-a-deployed-backend-optional)
8. [Troubleshooting](#-troubleshooting)

---

## 📌 Prerequisites

- A GitHub account and a repository (e.g., `SubhankarSarkar01/AiForBharat_HackaThon-YojanaSaathi-AI-`)
- Node.js (v18+) and npm installed locally
- Git installed and configured

---

## 🔒 Security Checklist (Before Deploying)

> [!CAUTION]
> **Never commit API keys, passwords, or secrets to a public repository!**

### ✅ What's Already Good

| Item | Status |
|------|--------|
| `.gitignore` excludes `.env`, `.env.local`, `*.env` | ✅ Safe |
| `.env` files are **NOT** tracked in git history | ✅ Safe |
| No hardcoded API keys in source code (`frontend/src/`) | ✅ Safe |
| Backend uses `process.env` for DB passwords & JWT secrets | ✅ Safe |
| GitHub Actions workflow uses `${{ secrets.* }}` for AWS keys | ✅ Safe |

### ⚠️ Items That Need Attention

| Item | Risk | Action Required |
|------|------|-----------------|
| `frontend/.env` contains a **real Gemini API key** (`AIzaSyAM3Y...`) | 🟡 Medium | This key is NOT in git, but **rotate it** if you ever accidentally committed it. Delete it from `frontend/.env` since the frontend doesn't use it directly — API calls go through the backend. |
| `backend/.env` contains a **real DB password** (`Subh@8617`) and **Gemini API key** | 🟡 Medium | Not in git, but ensure it stays that way. Never share this file. |
| `backend/.env` has a **placeholder JWT secret** (`your-super-secret-jwt-key-change-this-in-production`) | 🟠 High | Change this to a strong random string before going to production. |
| `docker-compose.yml` has default passwords (`password`) | 🟢 Low | Acceptable for local dev. Don't use in production. |
| `VITE_GEMINI_API_KEY` in `frontend/.env` | 🟠 High | **Remove it.** Any `VITE_` prefixed env var gets **bundled into the frontend build** and is visible to anyone in the browser. The Gemini API should only be called from the backend. |

### 🛡️ Action Items Before Deploy

1. **Delete `VITE_GEMINI_API_KEY`** from `frontend/.env` — it's not used in the frontend code but would be exposed in the build if referenced.
2. **Rotate your Gemini API keys** as a precaution: [Google AI Studio](https://makersuite.google.com/app/apikey)
3. **Generate a strong JWT secret** for production:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

---

## Step 1 — Configure Vite for GitHub Pages

Edit `frontend/vite.config.ts` to add the `base` path:

```ts
// frontend/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  // 👇 Add this line — use your GitHub repo name
  base: '/AiForBharat_HackaThon-YojanaSaathi-AI-/',

  plugins: [
    react(),
    // Remove or keep VitePWA as needed
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
```

> **Note:** Replace `AiForBharat_HackaThon-YojanaSaathi-AI-` with your actual GitHub repository name.

---

## Step 2 — Switch to HashRouter

GitHub Pages doesn't support client-side routing with `BrowserRouter`. Switch to `HashRouter`:

Edit `frontend/src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter } from 'react-router-dom'  // ← Changed from BrowserRouter
import App from './App'
import './index.css'
import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>         {/* ← Changed from BrowserRouter */}
        <App />
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
```

---

## Step 3 — Create GitHub Actions Workflow

Create the file `.github/workflows/deploy-gh-pages.yml`:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches:
      - main

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm install
        working-directory: frontend

      - name: Build
        run: npm run build
        working-directory: frontend
        env:
          VITE_API_URL: https://your-backend-url.com/api
          VITE_AI_API_URL: https://your-ai-service-url.com/api

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> [!IMPORTANT]
> Replace `https://your-backend-url.com/api` and `https://your-ai-service-url.com/api` with your actual deployed backend URLs. If you don't have a backend deployed yet, the frontend will work but API-dependent features (chatbot, auth, schemes loading) won't function.

---

## Step 4 — Push and Enable GitHub Pages

### 4.1 Commit and Push

```bash
git add .
git commit -m "Configure frontend for GitHub Pages deployment"
git push origin main
```

### 4.2 Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub: `https://github.com/SubhankarSarkar01/AiForBharat_HackaThon-YojanaSaathi-AI-`
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **GitHub Actions**
4. The deployment will trigger automatically on the next push to `main`

### 4.3 Access Your Site

Your site will be available at:
```
https://subhankarsarkar01.github.io/AiForBharat_HackaThon-YojanaSaathi-AI-/
```

---

## Step 5 — Connect to a Deployed Backend (Optional)

Since GitHub Pages only serves static files, for full functionality you need to deploy the backend separately:

### Free Hosting Options for Backend

| Service | Best For | Free Tier |
|---------|----------|-----------|
| [Render](https://render.com) | Node.js backend | 750 hrs/month |
| [Railway](https://railway.app) | Full-stack | $5 credit/month |
| [Vercel](https://vercel.com) | Serverless functions | Generous free tier |
| [Fly.io](https://fly.io) | Docker containers | 3 shared VMs free |

After deploying the backend, update the `VITE_API_URL` in the GitHub Actions workflow (Step 3) with your backend's URL.

---

## 🔧 Troubleshooting

### Blank Page After Deploy
- Ensure `base` in `vite.config.ts` matches your repo name exactly (with leading and trailing `/`)
- Make sure you switched to `HashRouter`

### 404 on Page Refresh
- This is expected with `BrowserRouter` — that's why we use `HashRouter`
- URLs will look like: `https://your-site.github.io/repo/#/schemes`

### Assets Not Loading
- Check that image/font paths are relative, not absolute
- Ensure `vite.config.ts` has the correct `base` path

### API Calls Failing
- GitHub Pages is static-only — API calls need a deployed backend
- Check browser console for CORS errors
- Ensure your backend allows CORS from your GitHub Pages domain

### Build Fails in GitHub Actions
- Check the Actions tab for error logs
- Ensure `frontend/package-lock.json` is committed (required for `npm ci`)
- Verify TypeScript has no compilation errors locally first:
  ```bash
  cd frontend
  npx tsc --noEmit
  ```

---

## 📁 Summary of Files to Change

| File | Change |
|------|--------|
| `frontend/vite.config.ts` | Add `base: '/repo-name/'` |
| `frontend/src/main.tsx` | Switch `BrowserRouter` → `HashRouter` |
| `frontend/.env` | Remove `VITE_GEMINI_API_KEY` line |
| `.github/workflows/deploy-gh-pages.yml` | **New file** — GitHub Actions for Pages deployment |

---

*Created for YojanaSaathi AI — Government Schemes Platform*
