# Data-Efficient Deployment Script
# Builds locally and only uploads the dist folder (saves mobile data!)
# Usage: .\deploy-data-efficient.ps1

param(
    [string]$PemKeyPath = "C:\Users\Zia\Desktop\Video\ttelgo.pem",
    [string]$ServerUser = "ubuntu",
    [string]$ServerIP = "3.88.101.239",
    [string]$ProjectPath = "C:\Users\Zia\Desktop\TTelGoWeb2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Data-Efficient Deployment to EC2" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script builds locally and only uploads dist folder" -ForegroundColor Yellow
Write-Host "This saves mobile data by avoiding npm install on server!" -ForegroundColor Green
Write-Host ""

# Check if PEM key exists
if (-not (Test-Path $PemKeyPath)) {
    Write-Host "ERROR: PEM key file not found at: $PemKeyPath" -ForegroundColor Red
    Write-Host "Please update the PemKeyPath parameter in the script." -ForegroundColor Yellow
    exit 1
}

# Change to project directory
Write-Host "Changing to project directory..." -ForegroundColor Yellow
Set-Location $ProjectPath

# Step 1: Build locally (uses local WiFi/data, not mobile hotspot)
Write-Host ""
Write-Host "Step 1: Building locally..." -ForegroundColor Cyan
Write-Host "This uses your local internet connection (WiFi recommended)" -ForegroundColor Yellow

try {
    # Check if node_modules exists, if not install first
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing dependencies locally (first time only)..." -ForegroundColor Yellow
        npm install
    }
    
    # Build the project
    Write-Host "Building production version..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Build failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Local build successful!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Build failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Upload only dist folder to server (minimal data usage)
Write-Host ""
Write-Host "Step 2: Uploading dist folder to server..." -ForegroundColor Cyan
Write-Host "This only uploads the built files (~500KB-1MB)" -ForegroundColor Yellow

try {
    # Create a temporary directory on server
    $uploadCommand = "mkdir -p ~/TTelGoWeb2/dist-upload && rm -rf ~/TTelGoWeb2/dist-upload/*"
    & ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" $uploadCommand
    
    # Upload dist folder using SCP (only uploads what's needed)
    Write-Host "Uploading files..." -ForegroundColor Yellow
    & scp.exe -i $PemKeyPath -r -o StrictHostKeyChecking=no "$ProjectPath\dist\*" "${ServerUser}@${ServerIP}:~/TTelGoWeb2/dist-upload/"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: File upload failed!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Files uploaded successfully!" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Upload failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Deploy on server (no npm install needed!)
Write-Host ""
Write-Host "Step 3: Deploying on server..." -ForegroundColor Cyan
Write-Host "This step uses minimal data (just moving files)" -ForegroundColor Yellow

$deployCommand = "sudo rm -rf /var/www/ttelgo/* && sudo cp -r ~/TTelGoWeb2/dist-upload/* /var/www/ttelgo/ && sudo chown -R www-data:www-data /var/www/ttelgo && sudo chmod -R 755 /var/www/ttelgo && sudo systemctl reload nginx && echo '✅ SUCCESS: Deployment completed!'"

try {
    & ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" $deployCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✅ Deployment Successful!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Website: https://www.ttelgo.com" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Data saved: Only uploaded ~500KB-1MB instead of downloading npm packages!" -ForegroundColor Green
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

Write-Host ""
Write-Host "Deployment script completed!" -ForegroundColor Green

