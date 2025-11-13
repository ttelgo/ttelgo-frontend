# Simple Efficient Deployment - Only uploads changed files
# Usage: .\deploy.ps1

param(
    [string]$PemKeyPath = "C:\Users\Zia\Desktop\Video\ttelgo.pem",
    [string]$ServerUser = "ubuntu",
    [string]$ServerIP = "3.88.101.239",
    [string]$ProjectPath = "C:\Users\Zia\Desktop\TTelGoWeb2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Efficient Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $PemKeyPath)) {
    Write-Host "ERROR: PEM key not found!" -ForegroundColor Red
    exit 1
}

Set-Location $ProjectPath

# Build locally
Write-Host "Building..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Upload dist folder (scp will only transfer changed files efficiently)
Write-Host "Uploading to server..." -ForegroundColor Yellow
& scp.exe -i $PemKeyPath -o StrictHostKeyChecking=no -r "$ProjectPath\dist\*" "${ServerUser}@${ServerIP}:~/TTelGoWeb2/dist-upload/"

# Deploy
Write-Host "Deploying..." -ForegroundColor Yellow
$cmd = 'sudo rm -rf /var/www/ttelgo/*; sudo cp -r ~/TTelGoWeb2/dist-upload/* /var/www/ttelgo/; sudo chown -R www-data:www-data /var/www/ttelgo; sudo chmod -R 755 /var/www/ttelgo; sudo systemctl reload nginx; echo "DONE"'
$result = & ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" $cmd

if ($result -match 'DONE') {
    Write-Host "Deployment Successful!" -ForegroundColor Green
    Write-Host "Website: https://www.ttelgo.com" -ForegroundColor Cyan
} else {
    Write-Host "Deployment Failed!" -ForegroundColor Red
    exit 1
}

