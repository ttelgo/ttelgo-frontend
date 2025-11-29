# 🚀 AWS Deployment Guide for TTelGo Web Application

This guide provides multiple deployment options for your React/Vite application on AWS.

## 📋 Table of Contents

1. [Option 1: S3 + CloudFront (Recommended)](#option-1-s3--cloudfront-recommended)
2. [Option 2: EC2 with Nginx (Current Setup)](#option-2-ec2-with-nginx-current-setup)
3. [Option 3: AWS Amplify (Easiest)](#option-3-aws-amplify-easiest)
4. [Environment Configuration](#environment-configuration)
5. [Troubleshooting](#troubleshooting)

---

## Option 1: S3 + CloudFront (Recommended)

**Best for:** Static websites, global CDN, low cost, high performance

### Prerequisites
- AWS CLI installed and configured
- AWS account with appropriate permissions
- Domain name (optional, for custom domain)

### Step 1: Create S3 Bucket

```bash
# Create bucket (replace with your bucket name)
aws s3 mb s3://ttelgo-web-app --region us-east-1

# Enable static website hosting
aws s3 website s3://ttelgo-web-app \
  --index-document index.html \
  --error-document index.html
```

### Step 2: Configure Bucket Policy

Create `s3-bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ttelgo-web-app/*"
    }
  ]
}
```

Apply policy:
```bash
aws s3api put-bucket-policy --bucket ttelgo-web-app --policy file://s3-bucket-policy.json
```

### Step 3: Build and Deploy

```bash
# Build the application
npm run build

# Deploy to S3
aws s3 sync dist/ s3://ttelgo-web-app --delete
```

### Step 4: Create CloudFront Distribution

1. Go to AWS Console → CloudFront
2. Create Distribution
3. Origin Domain: Select your S3 bucket
4. Viewer Protocol Policy: Redirect HTTP to HTTPS
5. Default Root Object: `index.html`
6. Error Pages:
   - 403 → 200 → `/index.html`
   - 404 → 200 → `/index.html`
7. Create Distribution

### Step 5: Configure Custom Domain (Optional)

1. Request SSL certificate in AWS Certificate Manager
2. Add CNAME record in your DNS pointing to CloudFront domain
3. Update CloudFront distribution with custom domain

### Automated Deployment Script

Use the provided `deploy-s3-cloudfront.ps1` script for automated deployment.

---

## Option 2: EC2 with Nginx (Current Setup)

**Best for:** Full control, existing infrastructure, custom server requirements

### Prerequisites
- EC2 instance running Ubuntu
- Nginx installed
- SSH access configured

### Current Setup

You already have a deployment script (`deploy-fast.ps1`). Here's how to improve it:

### Step 1: Update Environment Variables

Create `.env.production` file:
```env
VITE_API_BASE_URL=https://api.ttelgo.com/api
```

### Step 2: Build with Production Environment

```bash
npm run build:production
```

### Step 3: Deploy Using Script

```powershell
.\deploy-fast.ps1
```

### Step 4: Configure Nginx (if not already done)

Create `/etc/nginx/sites-available/ttelgo`:

```nginx
server {
    listen 80;
    server_name www.ttelgo.com ttelgo.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.ttelgo.com ttelgo.com;
    
    ssl_certificate /etc/letsencrypt/live/ttelgo.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ttelgo.com/privkey.pem;
    
    root /var/www/ttelgo;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # SPA routing - all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy (if backend is on same server)
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/ttelgo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d ttelgo.com -d www.ttelgo.com
```

---

## Option 3: AWS Amplify (Easiest)

**Best for:** Quick setup, automatic CI/CD, built-in hosting

### Step 1: Prepare Repository

Ensure your code is in GitHub, GitLab, or Bitbucket.

### Step 2: Create Amplify App

1. Go to AWS Console → Amplify
2. Click "New app" → "Host web app"
3. Connect your repository
4. Select branch (main/master)

### Step 3: Configure Build Settings

Amplify will auto-detect Vite. Update build settings if needed:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 4: Environment Variables

Add in Amplify Console:
- `VITE_API_BASE_URL`: Your production API URL

### Step 5: Deploy

Amplify will automatically:
- Build on every push
- Deploy to a unique URL
- Provide SSL certificate
- Enable custom domain

---

## Environment Configuration

### Development

Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Production

Create `.env.production`:
```env
VITE_API_BASE_URL=https://api.ttelgo.com/api
```

### Build Commands

The build process automatically uses the correct environment:

```bash
# Development build
npm run build

# Production build (uses .env.production)
npm run build:production
```

---

## Deployment Scripts

### S3 + CloudFront Deployment

Use `deploy-s3-cloudfront.ps1`:
```powershell
.\deploy-s3-cloudfront.ps1 -BucketName "ttelgo-web-app" -DistributionId "E1234567890ABC"
```

### EC2 Deployment

Use existing `deploy-fast.ps1`:
```powershell
.\deploy-fast.ps1 -PemKeyPath "path/to/key.pem" -ServerIP "your-ec2-ip"
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working

- Ensure `.env.production` exists for production builds
- Vite requires `VITE_` prefix for environment variables
- Rebuild after changing environment variables

### 404 Errors on Routes

- Ensure server is configured to serve `index.html` for all routes
- Check Nginx/CloudFront error page configuration

### API Calls Failing

- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS settings on backend
- Ensure API endpoint is accessible from production domain

### SSL Certificate Issues

- Verify domain DNS records
- Check certificate expiration
- Ensure certificate covers all domains (www and non-www)

---

## Cost Comparison

| Option | Monthly Cost (approx) | Best For |
|--------|----------------------|----------|
| S3 + CloudFront | $1-5 | Static sites, global audience |
| EC2 | $10-50 | Full control, custom requirements |
| Amplify | $0-15 | Quick setup, CI/CD needed |

---

## Security Best Practices

1. **Enable HTTPS** - Always use SSL/TLS
2. **Security Headers** - Add security headers in Nginx/CloudFront
3. **CORS** - Configure CORS properly on backend
4. **Environment Variables** - Never commit `.env` files
5. **API Keys** - Store sensitive keys in AWS Secrets Manager

---

## Next Steps

1. Choose your deployment option
2. Set up environment variables
3. Configure your backend API CORS
4. Test the deployment
5. Set up monitoring and alerts

---

## Support

For issues or questions:
- Check AWS documentation
- Review application logs
- Test API connectivity
- Verify environment variables

