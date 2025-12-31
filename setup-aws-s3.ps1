# AWS S3 Setup Script - First Time Configuration
# This script sets up S3 bucket and CloudFront for static website hosting
# Usage: .\setup-aws-s3.ps1 -BucketName "ttelgo-web-app" -Region "us-east-1"

param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,
    
    [string]$Region = "us-east-1",
    [string]$Profile = "default"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AWS S3 + CloudFront Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check AWS CLI
try {
    $awsVersion = aws --version
    Write-Host "AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
    Write-Host "Download from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

$awsProfile = if ($Profile -ne "default") { "--profile $Profile" } else { "" }
$awsRegion = "--region $Region"

# Step 1: Create S3 bucket
Write-Host "Step 1: Creating S3 bucket..." -ForegroundColor Yellow
$createBucket = aws s3 mb s3://$BucketName $awsRegion $awsProfile 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ S3 bucket created: s3://$BucketName" -ForegroundColor Green
} else {
    if ($createBucket -match "BucketAlreadyExists") {
        Write-Host "✓ Bucket already exists: s3://$BucketName" -ForegroundColor Yellow
    } else {
        Write-Host "ERROR: Failed to create bucket" -ForegroundColor Red
        Write-Host $createBucket -ForegroundColor Red
        exit 1
    }
}

# Step 2: Enable static website hosting
Write-Host "Step 2: Enabling static website hosting..." -ForegroundColor Yellow
$websiteConfig = @"
{
    "IndexDocument": {
        "Suffix": "index.html"
    },
    "ErrorDocument": {
        "Key": "index.html"
    }
}
"@

$websiteConfig | Out-File -FilePath "website-config.json" -Encoding UTF8
aws s3api put-bucket-website --bucket $BucketName --website-configuration file://website-config.json $awsProfile
Remove-Item "website-config.json"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Static website hosting enabled" -ForegroundColor Green
} else {
    Write-Host "WARNING: Failed to enable static website hosting" -ForegroundColor Yellow
}

# Step 3: Create bucket policy
Write-Host "Step 3: Creating bucket policy..." -ForegroundColor Yellow
$bucketPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BucketName/*"
        }
    ]
}
"@

$bucketPolicy | Out-File -FilePath "bucket-policy.json" -Encoding UTF8
aws s3api put-bucket-policy --bucket $BucketName --policy file://bucket-policy.json $awsProfile
Remove-Item "bucket-policy.json"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Bucket policy created (public read access)" -ForegroundColor Green
} else {
    Write-Host "WARNING: Failed to create bucket policy" -ForegroundColor Yellow
}

# Step 4: Block public access settings (we need public read for website)
Write-Host "Step 4: Configuring public access settings..." -ForegroundColor Yellow
$publicAccessConfig = @"
{
    "BlockPublicAcls": false,
    "IgnorePublicAcls": false,
    "BlockPublicPolicy": false,
    "RestrictPublicBuckets": false
}
"@

$publicAccessConfig | Out-File -FilePath "public-access-config.json" -Encoding UTF8
aws s3api put-public-access-block --bucket $BucketName --public-access-block-configuration file://public-access-config.json $awsProfile
Remove-Item "public-access-config.json"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Public access configured" -ForegroundColor Green
} else {
    Write-Host "WARNING: Failed to configure public access" -ForegroundColor Yellow
}

# Step 5: Instructions for CloudFront
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "S3 Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Go to AWS Console → CloudFront" -ForegroundColor White
Write-Host "2. Create a new distribution" -ForegroundColor White
Write-Host "3. Origin Domain: Select $BucketName" -ForegroundColor White
Write-Host "4. Viewer Protocol Policy: Redirect HTTP to HTTPS" -ForegroundColor White
Write-Host "5. Default Root Object: index.html" -ForegroundColor White
Write-Host "6. Error Pages:" -ForegroundColor White
Write-Host "   - 403 → 200 → /index.html" -ForegroundColor Gray
Write-Host "   - 404 → 200 → /index.html" -ForegroundColor Gray
Write-Host "7. Create distribution and note the Distribution ID" -ForegroundColor White
Write-Host ""
Write-Host "Then deploy using:" -ForegroundColor Cyan
Write-Host ".\deploy-s3-cloudfront.ps1 -BucketName `"$BucketName`" -DistributionId `"YOUR_DISTRIBUTION_ID`"" -ForegroundColor Yellow
Write-Host ""

