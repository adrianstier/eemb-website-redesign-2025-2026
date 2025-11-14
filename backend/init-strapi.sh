#!/bin/bash

# EEMB Strapi Backend Initialization Script
# This script sets up the Strapi CMS with all content types
# Run this in Week 1 after environment setup

echo "🚀 EEMB Strapi Backend Setup"
echo "============================="
echo ""

# Check Node version
NODE_VERSION=$(node -v)
echo "✅ Node version: $NODE_VERSION"

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
  echo "⚠️  Creating new Strapi project..."

  # Create Strapi app with PostgreSQL
  npx create-strapi-app@latest . \
    --quickstart \
    --no-run \
    --dbclient=postgres \
    --dbhost=localhost \
    --dbport=5432 \
    --dbname=eemb_cms \
    --dbusername=postgres \
    --dbpassword=postgres

  echo "✅ Strapi project created"
else
  echo "✅ Strapi project already exists"
fi

# Install additional dependencies
echo ""
echo "📦 Installing additional packages..."
npm install --save \
  @strapi/provider-upload-cloudinary \
  pg \
  slugify \
  strapi-plugin-populate-deep \
  strapi-plugin-transformer

echo ""
echo "✅ Dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
  echo ""
  echo "📝 Creating .env file..."
  cat > .env << 'EOF'
HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeGenerated1,toBeGenerated2,toBeGenerated3,toBeGenerated4
API_TOKEN_SALT=toBeGenerated
ADMIN_JWT_SECRET=toBeGenerated
TRANSFER_TOKEN_SALT=toBeGenerated
JWT_SECRET=toBeGenerated

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=eemb_cms
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_SSL=false

# Cloudinary (update with your credentials)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_KEY=your_api_key
CLOUDINARY_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
EOF
  echo "✅ .env file created (update with real credentials)"
else
  echo "✅ .env file already exists"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Update .env with real database and Cloudinary credentials"
echo "2. Run: npm run develop"
echo "3. Create admin user at http://localhost:1337/admin"
echo "4. Run content-types creation script"
echo ""
echo "✅ Strapi initialization complete!"