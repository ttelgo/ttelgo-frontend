# Fast Deployment - Only uploads changed files using rsync
# Usage: .\deploy-fast.ps1

param(
    [string]$PemKeyPath = "D:\tiktel\ttelgo.pem",
    [string]$ServerUser = "ubuntu",
    [string]$ServerIP = "3.88.101.239",
    [string]$ProjectPath = "D:\tiktel\front-end\TTelGoWeb2",
    [string]$CommitMessage = ""
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fast Deployment (Incremental)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $PemKeyPath)) {
    Write-Host "ERROR: PEM key not found!" -ForegroundColor Red
    exit 1
}

Set-Location $ProjectPath

# Git commit and push
Write-Host "Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
$hasUncommitted = $gitStatus -ne $null -and $gitStatus.Length -gt 0

# Check if there are unpushed commits
$branchInfo = git status -sb 2>$null
$hasUnpushed = $branchInfo -match 'ahead'

if ($hasUncommitted) {
    Write-Host "Staging all changes..." -ForegroundColor Yellow
    git add -A
    
    if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $CommitMessage = "Deploy: $timestamp"
    }
    
    Write-Host "Committing changes: $CommitMessage" -ForegroundColor Yellow
    git commit -m $CommitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Commit failed or no changes to commit!" -ForegroundColor Yellow
    } else {
        Write-Host "Pushing to origin..." -ForegroundColor Yellow
        git push origin main
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Push failed!" -ForegroundColor Red
            exit 1
        }
        Write-Host "Git push successful!" -ForegroundColor Green
    }
} elseif ($hasUnpushed) {
    Write-Host "Pushing existing commits to origin..." -ForegroundColor Yellow
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Push failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Git push successful!" -ForegroundColor Green
} else {
    Write-Host "No changes to commit or push, skipping git operations..." -ForegroundColor Gray
}

# Build locally (production build)
Write-Host "Building for production..." -ForegroundColor Yellow
npm run build:production
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Upload using rsync (only changed files, with compression)
Write-Host "Uploading changed files to server..." -ForegroundColor Yellow
Write-Host "This will only upload files that have changed..." -ForegroundColor Gray

# Use rsync via SSH for incremental sync
$rsyncCmd = "rsync -avz --delete -e `"ssh -i $PemKeyPath -o StrictHostKeyChecking=no`" `"$ProjectPath\dist\`" ${ServerUser}@${ServerIP}:~/TTelGoWeb2/dist-upload/"

# Check if rsync is available (it might not be on Windows by default)
try {
    $rsyncCheck = Get-Command rsync -ErrorAction Stop
    Invoke-Expression $rsyncCmd
} catch {
    Write-Host "rsync not found, using scp with compression..." -ForegroundColor Yellow
    # Fallback to scp with compression
    & scp.exe -i $PemKeyPath -o StrictHostKeyChecking=no -C -r "$ProjectPath\dist\*" "${ServerUser}@${ServerIP}:~/TTelGoWeb2/dist-upload/"
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "Upload failed!" -ForegroundColor Red
    exit 1
}

# Deploy
Write-Host "Deploying to production..." -ForegroundColor Yellow
$cmd = 'sudo rm -rf /var/www/ttelgo/*; sudo cp -r ~/TTelGoWeb2/dist-upload/* /var/www/ttelgo/; sudo chown -R www-data:www-data /var/www/ttelgo; sudo chmod -R 755 /var/www/ttelgo; sudo systemctl reload nginx; echo "DONE"'
$result = & ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" $cmd

if ($result -match 'DONE') {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Deployment Successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Website: https://www.ttelgo.com" -ForegroundColor Cyan
} else {
    Write-Host "Deployment Failed!" -ForegroundColor Red
    exit 1
}





