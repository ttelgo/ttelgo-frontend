# Efficient Deployment - Only uploads changed files (Mobile Hotspot Friendly!)
# Compares file sizes and only uploads what changed
# Usage: .\deploy-efficient.ps1

param(
    [string]$PemKeyPath = "C:\Users\Zia\Desktop\Video\ttelgo.pem",
    [string]$ServerUser = "ubuntu",
    [string]$ServerIP = "3.88.101.239",
    [string]$ProjectPath = "C:\Users\Zia\Desktop\TTelGoWeb2"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Efficient Deployment (Data Saver!)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PEM key exists
if (-not (Test-Path $PemKeyPath)) {
    Write-Host "ERROR: PEM key file not found at: $PemKeyPath" -ForegroundColor Red
    exit 1
}

Set-Location $ProjectPath

# Build locally (saves data - no npm install on server!)
Write-Host "📦 Building locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""

# Smart file comparison - only upload changed files
Write-Host "🔍 Checking for changed files..." -ForegroundColor Yellow

# Get local files with sizes
$localFiles = @{}
Get-ChildItem -Path "$ProjectPath\dist" -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Replace("$ProjectPath\dist\", "").Replace('\', '/')
    $localFiles[$relativePath] = @{
        FullPath = $_.FullName
        Size = $_.Length
    }
}

Write-Host "   Found $($localFiles.Count) files in dist folder" -ForegroundColor Gray

# Get server files with sizes
Write-Host "🔍 Comparing with server..." -ForegroundColor Yellow
$serverCheck = "test -d ~/TTelGoWeb2/dist-upload && find ~/TTelGoWeb2/dist-upload -type f -exec stat -c '%s|%n' {} \; 2>/dev/null | sed 's|~/TTelGoWeb2/dist-upload/||' || echo 'NO_DIR'"
$serverOutput = & ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" $serverCheck 2>&1

$serverFiles = @{}
if ($serverOutput -notmatch 'NO_DIR' -and $serverOutput) {
    $serverOutput | ForEach-Object {
        if ($_ -match '^(\d+)\|(.+)$') {
            $size = [int]$matches[1]
            $path = $matches[2].Trim()
            $serverFiles[$path] = $size
        }
    }
    Write-Host "   Found $($serverFiles.Count) files on server" -ForegroundColor Gray
} else {
    Write-Host "   No existing files on server (first deployment)" -ForegroundColor Gray
    & ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" "mkdir -p ~/TTelGoWeb2/dist-upload" | Out-Null
}

# Find files that need uploading
$filesToUpload = @()
$totalSize = 0

foreach ($filePath in $localFiles.Keys) {
    $localFile = $localFiles[$filePath]
    $needsUpload = $true
    
    if ($serverFiles.ContainsKey($filePath)) {
        if ($serverFiles[$filePath] -eq $localFile.Size) {
            $needsUpload = $false
        }
    }
    
    if ($needsUpload) {
        $filesToUpload += $localFile
        $totalSize += $localFile.Size
    }
}

Write-Host ""
if ($filesToUpload.Count -eq 0) {
    Write-Host "✅ No changes detected! Nothing to upload." -ForegroundColor Green
    Write-Host "   Data saved: 0 MB transferred" -ForegroundColor Green
} else {
    $sizeMB = [math]::Round($totalSize / 1MB, 2)
    Write-Host "📤 Uploading $($filesToUpload.Count) changed files (~$sizeMB MB)..." -ForegroundColor Yellow
    
    $uploaded = 0
    foreach ($file in $filesToUpload) {
        $relativePath = ($file.FullPath.Replace("$ProjectPath\dist\", "")).Replace('\', '/')
        $remotePath = "~/TTelGoWeb2/dist-upload/$relativePath"
        $remoteDir = $remotePath.Substring(0, $remotePath.LastIndexOf('/'))
        
        # Create directory on server
        & ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" "mkdir -p `"$remoteDir`"" | Out-Null
        
        # Upload file
        & scp.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$($file.FullPath)" "${ServerUser}@${ServerIP}:$remotePath" | Out-Null
        
        $uploaded++
        if ($uploaded % 10 -eq 0) {
            Write-Host "   Uploaded $uploaded/$($filesToUpload.Count) files..." -ForegroundColor Gray
        }
    }
    
    Write-Host "✅ Upload complete! ($uploaded files, ~$sizeMB MB)" -ForegroundColor Green
}

# Deploy to web server
Write-Host ""
Write-Host "🚀 Deploying to web server..." -ForegroundColor Yellow
$deployCommand = "sudo rm -rf /var/www/ttelgo/* && sudo cp -r ~/TTelGoWeb2/dist-upload/* /var/www/ttelgo/ && sudo chown -R www-data:www-data /var/www/ttelgo && sudo chmod -R 755 /var/www/ttelgo && sudo systemctl reload nginx && echo 'DEPLOY_SUCCESS'"
$deployResult = & ssh.exe -i $PemKeyPath -o StrictHostKeyChecking=no "$ServerUser@$ServerIP" $deployCommand

if ($deployResult -match 'DEPLOY_SUCCESS') {
    Write-Host ""
    Write-Host "✅ Deployment Successful!" -ForegroundColor Green
    Write-Host "🌐 Website: https://www.ttelgo.com" -ForegroundColor Cyan
    Write-Host ""
    if ($filesToUpload.Count -gt 0) {
        Write-Host "💾 Data transferred: ~$sizeMB MB (only changed files!)" -ForegroundColor Green
    } else {
        Write-Host "💾 Data transferred: 0 MB (no changes needed!)" -ForegroundColor Green
    }
} else {
    Write-Host "❌ Deployment Failed!" -ForegroundColor Red
    exit 1
}

