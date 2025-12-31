# 🚀 Quick Deployment Guide

## Choose Your Deployment Method

### Option 1: S3 + CloudFront (Recommended - Best Performance)

**Quick Start:**
```powershell
# 1. Set up production environment
# Create .env.production file with:
# VITE_API_BASE_URL=https://api.ttelgo.com/api

# 2. Build and deploy
.\deploy-s3-cloudfront.ps1 -BucketName "ttelgo-web-app" -DistributionId "YOUR_DISTRIBUTION_ID"
```

**First Time Setup:**
1. Create S3 bucket: `aws s3 mb s3://ttelgo-web-app`
2. Enable static website hosting
3. Create CloudFront distribution
4. Get Distribution ID from CloudFront console
5. Run deployment script

---

### Option 2: EC2 (Current Setup)

**Quick Start:**
```powershell
.\deploy-fast.ps1
```

**Configuration:**
- Update `deploy-fast.ps1` with your EC2 details
- Ensure `.env.production` exists with production API URL
- Script handles: build → upload → deploy

---

### Option 3: AWS Amplify (Easiest)

1. Push code to GitHub/GitLab
2. Go to AWS Console → Amplify
3. Connect repository
4. Add environment variable: `VITE_API_BASE_URL`
5. Deploy automatically on every push

---

## Environment Setup

### Before First Deployment

1. **Create `.env.production` file:**
   ```env
   VITE_API_BASE_URL=https://api.ttelgo.com/api
   ```

2. **Build for production:**
   ```bash
   npm run build:production
   ```

3. **Test locally:**
   ```bash
   npm run preview
   ```

---

## Common Issues

**Build fails:**
- Run `npm install` first
- Check TypeScript errors: `npm run build`

**Environment variables not working:**
- Ensure file is named `.env.production` (not `.env.prod`)
- Rebuild after changing environment variables
- Variables must start with `VITE_`

**API calls failing:**
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings on backend
- Ensure API is accessible from production domain

---

## Next Steps

1. Choose deployment method
2. Set up environment variables
3. Configure backend CORS
4. Deploy!
5. Test the live site

For detailed instructions, see [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)

