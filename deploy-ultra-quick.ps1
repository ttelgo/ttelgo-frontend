# Ultra-Quick Deployment (No Git, No npm install on server)
# Builds locally and uploads only dist folder
# Use this when you've already committed/pushed and want to save data
# Usage: .\deploy-ultra-quick.ps1

param(
    [string]$PemKeyPath = "C:\Users\Zia\Desktop\Video\ttelgo.pem",
    [string]$ServerUser = "ubuntu",
    [string]$ServerIP = "3.88.101.239",
    [string]$ProjectPath = "C:\Users\Zia\Desktop\TTelGoWeb2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ultra-Quick Deployment (Data Efficient)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PEM key exists
if (-not (Test-Path $PemKeyPath)) {
    Write-Host "ERROR: PEM key file not found!" -ForegroundColor Red
    exit 1
}

Set-Location $ProjectPath

# Build locally
Write-Host "Building locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Create upload directory on server and upload dist folder
Write-Host "Preparing server and uploading dist folder..." -ForegroundColor Yellow
$prepareCommand = "mkdir -p ~/TTelGoWeb2/dist-upload && rm -rf ~/TTelGoWeb2/dist-upload/*"
& ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" $prepareCommand

Write-Host "Uploading files..." -ForegroundColor Yellow
& scp.exe -i $PemKeyPath -r -o StrictHostKeyChecking=no "$ProjectPath\dist\*" "${ServerUser}@${ServerIP}:~/TTelGoWeb2/dist-upload/"

# Deploy
$deployCommand = "sudo rm -rf /var/www/ttelgo/* && sudo cp -r ~/TTelGoWeb2/dist-upload/* /var/www/ttelgo/ && sudo chown -R www-data:www-data /var/www/ttelgo && sudo chmod -R 755 /var/www/ttelgo && sudo systemctl reload nginx && echo '✅ SUCCESS!'"
& ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" $deployCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment Successful!" -ForegroundColor Green
    Write-Host "Website: https://www.ttelgo.com" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment Failed!" -ForegroundColor Red
    exit 1
}

