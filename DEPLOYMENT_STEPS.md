# 🚀 Step-by-Step Deployment Guide

## Current Status
✅ SSH connection established
✅ Project directory exists: `~/TTelGoWeb2`

## Step-by-Step Deployment Process

### Step 1: Check Project Status on Server
```bash
cd ~/TTelGoWeb2
ls -la
git status
```

### Step 2: Check if Node.js and npm are installed
```bash
node --version
npm --version
```

### Step 3: Check Nginx Configuration
```bash
sudo systemctl status nginx
ls -la /var/www/ttelgo/
```

### Step 4: Pull Latest Code (if using Git)
```bash
cd ~/TTelGoWeb2
git pull origin main
```

### Step 5: Install/Update Dependencies
```bash
npm install
```

### Step 6: Create Production Environment File
```bash
nano .env.production
```
Add:
```
VITE_API_BASE_URL=https://api.ttelgo.com/api
```
(Replace with your actual production API URL)

### Step 7: Build for Production
```bash
npm run build:production
```

### Step 8: Deploy to Web Directory
```bash
sudo rm -rf /var/www/ttelgo/*
sudo cp -r dist/* /var/www/ttelgo/
sudo chown -R www-data:www-data /var/www/ttelgo
sudo chmod -R 755 /var/www/ttelgo
```

### Step 9: Reload Nginx
```bash
sudo systemctl reload nginx
```

### Step 10: Verify Deployment
```bash
ls -la /var/www/ttelgo/
curl http://localhost
```

---

## Or Use Automated Deployment

From your local machine, run:
```powershell
.\deploy-fast.ps1
```

This will:
1. Build locally
2. Upload to server
3. Deploy automatically

