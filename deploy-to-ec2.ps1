# TTelGo Web Deployment Script
# This script deploys your React app to AWS EC2

param(
    [string]$PemKeyPath = "C:\Users\Zia\Desktop\Video\ttelgo.pem",
    [string]$ServerUser = "ubuntu",
    [string]$ServerIP = "3.88.101.239",
    [string]$ProjectPath = "C:\Users\Zia\Desktop\TTelGoWeb2",
    [switch]$SkipGit = $false
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TTelGo Web Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
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

# Git operations (optional)
if (-not $SkipGit) {
    Write-Host ""
    Write-Host "Checking git status..." -ForegroundColor Yellow
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "You have uncommitted changes. Do you want to commit and push? (Y/N)" -ForegroundColor Yellow
        $response = Read-Host
        if ($response -eq "Y" -or $response -eq "y") {
            Write-Host "Staging changes..." -ForegroundColor Yellow
            git add .
            
            Write-Host "Enter commit message:" -ForegroundColor Yellow
            $commitMessage = Read-Host
            if ([string]::IsNullOrWhiteSpace($commitMessage)) {
                $commitMessage = "Deployment update - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            }
            
            Write-Host "Committing changes..." -ForegroundColor Yellow
            git commit -m $commitMessage
            
            Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
            git push
            
            if ($LASTEXITCODE -ne 0) {
                Write-Host "ERROR: Git push failed!" -ForegroundColor Red
                exit 1
            }
            Write-Host "Git push successful!" -ForegroundColor Green
        }
    } else {
        Write-Host "No uncommitted changes. Skipping git operations." -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploying to EC2 Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# SSH into server and run deployment commands (all in one line)
Write-Host "Connecting to EC2 server ($ServerUser@$ServerIP)..." -ForegroundColor Yellow
Write-Host ""

# Single-line deployment command
$deployCommand = "cd ~/TTelGoWeb2 && git pull && npm install && npm run build && sudo rm -rf /var/www/ttelgo/* && sudo cp -r dist/* /var/www/ttelgo/ && sudo chown -R www-data:www-data /var/www/ttelgo && sudo chmod -R 755 /var/www/ttelgo && sudo systemctl reload nginx && echo 'SUCCESS: Deployment completed!'"

try {
    # Execute SSH command
    Write-Host "Executing deployment commands..." -ForegroundColor Yellow
    Write-Host ""
    
    # Use ssh.exe directly with proper escaping
    & ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" $deployCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Deployment Successful!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your website should be live at: https://www.ttelgo.com" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "Deployment Failed!" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "Please check the error messages above." -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to execute SSH command" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Deployment script completed!" -ForegroundColor Green
