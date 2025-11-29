# AWS S3 + CloudFront Deployment Script
# Usage: .\deploy-s3-cloudfront.ps1 -BucketName "ttelgo-web-app" -DistributionId "E1234567890ABC"

param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,
    
    [Parameter(Mandatory=$false)]
    [string]$DistributionId,
    
    [string]$Region = "us-east-1",
    [string]$Profile = "default",
    [string]$ProjectPath = $PSScriptRoot
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AWS S3 + CloudFront Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check AWS CLI
try {
    $awsVersion = aws --version
    Write-Host "AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: AWS CLI not found. Please install AWS CLI." -ForegroundColor Red
    exit 1
}

Set-Location $ProjectPath

# Check if .env.production exists
if (Test-Path ".env.production") {
    Write-Host "Found .env.production file" -ForegroundColor Green
} else {
    Write-Host "WARNING: .env.production not found. Using default API URL." -ForegroundColor Yellow
    Write-Host "Create .env.production with VITE_API_BASE_URL for production API" -ForegroundColor Yellow
}

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "ERROR: dist folder not found after build!" -ForegroundColor Red
    exit 1
}

# Deploy to S3
Write-Host "Deploying to S3 bucket: $BucketName" -ForegroundColor Yellow

$awsProfile = if ($Profile -ne "default") { "--profile $Profile" } else { "" }
$awsRegion = "--region $Region"

# Sync files to S3
$syncCmd = "aws s3 sync dist/ s3://$BucketName --delete $awsRegion $awsProfile"
Invoke-Expression $syncCmd

if ($LASTEXITCODE -ne 0) {
    Write-Host "S3 sync failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Files uploaded to S3 successfully!" -ForegroundColor Green

# Invalidate CloudFront cache if DistributionId provided
if ($DistributionId) {
    Write-Host "Invalidating CloudFront cache..." -ForegroundColor Yellow
    
    $invalidationId = aws cloudfront create-invalidation `
        --distribution-id $DistributionId `
        --paths "/*" `
        --query 'Invalidation.Id' `
        --output text `
        $awsProfile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "CloudFront invalidation created: $invalidationId" -ForegroundColor Green
        Write-Host "Cache will be cleared in a few minutes..." -ForegroundColor Yellow
    } else {
        Write-Host "WARNING: CloudFront invalidation failed. Cache may be stale." -ForegroundColor Yellow
    }
} else {
    Write-Host "No CloudFront Distribution ID provided. Skipping cache invalidation." -ForegroundColor Yellow
    Write-Host "To invalidate cache, provide -DistributionId parameter" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment Successful!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "Bucket: s3://$BucketName" -ForegroundColor Cyan
if ($DistributionId) {
    Write-Host "CloudFront: Distribution $DistributionId" -ForegroundColor Cyan
}
Write-Host ""

