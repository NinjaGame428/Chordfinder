# Deploy Everything Script (PowerShell)
# This script helps deploy database to Neon and push code to GitHub

Write-Host "🚀 Starting deployment process..." -ForegroundColor Cyan
Write-Host ""

# Check if Neon connection string is set
$neonUrl = $env:NEON_DATABASE_URL
if ([string]::IsNullOrEmpty($neonUrl)) {
    $neonUrl = $env:DATABASE_URL
}

if ([string]::IsNullOrEmpty($neonUrl)) {
    Write-Host "⚠️  Warning: NEON_DATABASE_URL or DATABASE_URL not set" -ForegroundColor Yellow
    Write-Host "   Please set your Neon connection string:" -ForegroundColor Yellow
    Write-Host "   `$env:NEON_DATABASE_URL='postgresql://user:password@host/database?sslmode=require'" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Do you want to continue with GitHub deployment only? (y/n)"
    if ($continue -ne 'y' -and $continue -ne 'Y') {
        exit 1
    }
}

# Step 1: Deploy database to Neon
if (-not [string]::IsNullOrEmpty($neonUrl)) {
    Write-Host "📦 Step 1: Deploying database schema to Neon..." -ForegroundColor Cyan
    
    if (Get-Command psql -ErrorAction SilentlyContinue) {
        Write-Host "   Using psql to deploy..." -ForegroundColor Gray
        $sqlFile = Join-Path $PSScriptRoot "..\neon\neon-migration.sql"
        psql $neonUrl -f $sqlFile
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Database migration completed!" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Database migration had errors. Check manually." -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  psql not found. Please deploy manually:" -ForegroundColor Yellow
        Write-Host "   1. Go to https://console.neon.tech" -ForegroundColor Gray
        Write-Host "   2. Open SQL Editor" -ForegroundColor Gray
        Write-Host "   3. Copy contents of neon/neon-migration.sql" -ForegroundColor Gray
        Write-Host "   4. Paste and run" -ForegroundColor Gray
    }
    Write-Host ""
}

# Step 2: Check git status
Write-Host "📋 Step 2: Checking git status..." -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
    Write-Host "   ⚠️  Not a git repository. Initializing..." -ForegroundColor Yellow
    git init
}

# Step 3: Add all files
Write-Host "📁 Step 3: Staging files..." -ForegroundColor Cyan
git add .
Write-Host "   ✅ Files staged" -ForegroundColor Green

# Step 4: Commit
Write-Host "💾 Step 4: Committing changes..." -ForegroundColor Cyan
$commitMsg = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrEmpty($commitMsg)) {
    $commitMsg = "Deploy to Neon and GitHub - $(Get-Date -Format 'yyyy-MM-dd')"
}
git commit -m $commitMsg
Write-Host "   ✅ Committed: $commitMsg" -ForegroundColor Green

# Step 5: Push to GitHub
Write-Host "🚀 Step 5: Pushing to GitHub..." -ForegroundColor Cyan
$remoteUrl = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "   Remote origin exists" -ForegroundColor Gray
    $push = Read-Host "Push to main branch? (y/n)"
    if ($push -eq 'y' -or $push -eq 'Y') {
        git push -u origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Pushed to GitHub successfully!" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Push failed. Check your remote configuration." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "   ⚠️  No remote origin found" -ForegroundColor Yellow
    $repoUrl = Read-Host "Enter GitHub repository URL (or press Enter to skip)"
    if (-not [string]::IsNullOrEmpty($repoUrl)) {
        git remote add origin $repoUrl
        git branch -M main
        git push -u origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Pushed to GitHub successfully!" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Push failed. Check your repository URL and permissions." -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "✅ Deployment process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Verify database in Neon console: https://console.neon.tech"
Write-Host "2. Check GitHub repository for pushed code"
Write-Host "3. Set up environment variables in your hosting platform"
Write-Host "4. Deploy to Vercel/Netlify if needed"

