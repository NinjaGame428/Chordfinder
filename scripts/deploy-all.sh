#!/bin/bash

# Deploy Everything Script
# This script helps deploy database to Neon and push code to GitHub

echo "🚀 Starting deployment process..."
echo ""

# Check if Neon connection string is set
if [ -z "$NEON_DATABASE_URL" ] && [ -z "$DATABASE_URL" ]; then
    echo "⚠️  Warning: NEON_DATABASE_URL or DATABASE_URL not set"
    echo "   Please set your Neon connection string:"
    echo "   export NEON_DATABASE_URL='postgresql://user:password@host/database?sslmode=require'"
    echo ""
    read -p "Do you want to continue with GitHub deployment only? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Deploy database to Neon
if [ ! -z "$NEON_DATABASE_URL" ] || [ ! -z "$DATABASE_URL" ]; then
    echo "📦 Step 1: Deploying database schema to Neon..."
    
    if command -v psql &> /dev/null; then
        DB_URL=${NEON_DATABASE_URL:-$DATABASE_URL}
        echo "   Using psql to deploy..."
        psql "$DB_URL" -f neon/neon-migration.sql
        if [ $? -eq 0 ]; then
            echo "   ✅ Database migration completed!"
        else
            echo "   ⚠️  Database migration had errors. Check manually."
        fi
    else
        echo "   ⚠️  psql not found. Please deploy manually:"
        echo "   1. Go to https://console.neon.tech"
        echo "   2. Open SQL Editor"
        echo "   3. Copy contents of neon/neon-migration.sql"
        echo "   4. Paste and run"
    fi
    echo ""
fi

# Step 2: Check git status
echo "📋 Step 2: Checking git status..."
if [ ! -d ".git" ]; then
    echo "   ⚠️  Not a git repository. Initializing..."
    git init
fi

# Step 3: Add all files
echo "📁 Step 3: Staging files..."
git add .
echo "   ✅ Files staged"

# Step 4: Commit
echo "💾 Step 4: Committing changes..."
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Deploy to Neon and GitHub - $(date +%Y-%m-%d)"
fi
git commit -m "$commit_msg"
echo "   ✅ Committed: $commit_msg"

# Step 5: Push to GitHub
echo "🚀 Step 5: Pushing to GitHub..."
if git remote get-url origin &> /dev/null; then
    echo "   Remote origin exists"
    read -p "Push to main branch? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -u origin main
        if [ $? -eq 0 ]; then
            echo "   ✅ Pushed to GitHub successfully!"
        else
            echo "   ⚠️  Push failed. Check your remote configuration."
        fi
    fi
else
    echo "   ⚠️  No remote origin found"
    read -p "Enter GitHub repository URL (or press Enter to skip): " repo_url
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        git branch -M main
        git push -u origin main
        if [ $? -eq 0 ]; then
            echo "   ✅ Pushed to GitHub successfully!"
        else
            echo "   ⚠️  Push failed. Check your repository URL and permissions."
        fi
    fi
fi

echo ""
echo "✅ Deployment process completed!"
echo ""
echo "Next steps:"
echo "1. Verify database in Neon console: https://console.neon.tech"
echo "2. Check GitHub repository for pushed code"
echo "3. Set up environment variables in your hosting platform"
echo "4. Deploy to Vercel/Netlify if needed"

