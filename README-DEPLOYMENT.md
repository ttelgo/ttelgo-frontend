# Deployment Scripts

This repository includes PowerShell scripts to automate deployment to AWS EC2.

## Scripts

### 1. `deploy-to-ec2.ps1` (Full Deployment)
- Checks for uncommitted changes
- Optionally commits and pushes to GitHub
- Deploys to EC2 server
- Includes npm install step

**Usage:**
```powershell
.\deploy-to-ec2.ps1
```

**With parameters:**
```powershell
.\deploy-to-ec2.ps1 -PemKeyPath "C:\path\to\key.pem" -ServerIP "1.2.3.4" -SkipGit
```

### 2. `deploy-quick.ps1` (Quick Deployment)
- Skips git operations
- Directly deploys to EC2
- Faster for when you've already pushed changes

**Usage:**
```powershell
.\deploy-quick.ps1
```

## Configuration

Update the following variables in the scripts if needed:

- `$PemKeyPath`: Path to your PEM key file (default: `C:\Users\Zia\Desktop\Video\ttelgo.pem`)
- `$ServerUser`: SSH username (default: `ubuntu`)
- `$ServerIP`: EC2 server IP address (default: `3.88.101.239`)
- `$ProjectPath`: Local project path (default: `C:\Users\Zia\Desktop\TTelGoWeb2`)

## What the Scripts Do

1. **Git Pull**: Pulls latest changes from GitHub
2. **npm install**: Installs/updates dependencies
3. **npm run build**: Builds the production version
4. **Copy Files**: Copies built files to `/var/www/ttelgo/`
5. **Set Permissions**: Sets proper file permissions
6. **Reload Nginx**: Reloads Nginx web server

## Requirements

- PowerShell 5.1 or later
- OpenSSH client (usually pre-installed on Windows 10/11)
- Valid PEM key file
- SSH access to EC2 server

## Troubleshooting

### Permission Denied
- Make sure your PEM key has correct permissions
- On Windows, you may need to run: `icacls.exe key.pem /inheritance:r /grant:r "%username%:R"`

### SSH Connection Failed
- Verify the server IP address is correct
- Check that your security group allows SSH (port 22)
- Ensure the PEM key path is correct

### Build Fails
- Check for TypeScript errors: `npm run build`
- Verify all dependencies are installed
- Check server has enough disk space

### Nginx Reload Fails
- Check Nginx configuration: `sudo nginx -t`
- Verify Nginx is running: `sudo systemctl status nginx`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

## Manual Deployment

If the scripts don't work, you can manually run:

```bash
cd ~/TTelGoWeb2
git pull
npm install
npm run build
sudo rm -rf /var/www/ttelgo/*
sudo cp -r dist/* /var/www/ttelgo/
sudo chown -R www-data:www-data /var/www/ttelgo
sudo chmod -R 755 /var/www/ttelgo
sudo systemctl reload nginx
```

## Notes

- The scripts assume you're using Ubuntu on EC2
- Make sure your EC2 security group allows SSH from your IP
- The website will be available at `https://www.ttelgo.com` after deployment

