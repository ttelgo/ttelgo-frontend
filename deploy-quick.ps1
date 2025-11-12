# Quick Deploy Script (No Git Operations)
# Use this if you've already committed and pushed your changes
# Usage: .\deploy-quick.ps1

param(
    [string]$PemKeyPath = "C:\Users\Zia\Desktop\Video\ttelgo.pem",
    [string]$ServerUser = "ubuntu",
    [string]$ServerIP = "3.88.101.239"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Quick Deployment to EC2" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PEM key exists
if (-not (Test-Path $PemKeyPath)) {
    Write-Host "ERROR: PEM key file not found at: $PemKeyPath" -ForegroundColor Red
    Write-Host "Please update the PemKeyPath in the script." -ForegroundColor Yellow
    exit 1
}

Write-Host "Deploying to $ServerUser@$ServerIP..." -ForegroundColor Yellow
Write-Host ""

# Optimized: Skip npm install if package.json hasn't changed (saves data!)
# Only runs npm install if package.json or package-lock.json changed
$deployCommand = "cd ~/TTelGoWeb2 && git pull && if [ package.json -nt node_modules/.package-lock.json ] || [ ! -f node_modules/.package-lock.json ]; then npm ci; fi && npm run build && sudo rm -rf /var/www/ttelgo/* && sudo cp -r dist/* /var/www/ttelgo/ && sudo chown -R www-data:www-data /var/www/ttelgo && sudo chmod -R 755 /var/www/ttelgo && sudo systemctl reload nginx && echo '✅ SUCCESS: Deployment completed!'"

try {
    # Execute SSH command
    & ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" $deployCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✅ Deployment Successful!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Website: https://www.ttelgo.com" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "❌ Deployment Failed!" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
