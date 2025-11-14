#!/usr/bin/env node

/**
 * Configure public permissions for Faculty API
 * Run this script after creating the faculty content type
 */

const axios = require('axios');

const API_URL = 'http://localhost:1337';

async function setupPermissions() {
  try {
    console.log('🔧 Setting up faculty permissions...');

    // First, let's manually update using direct database access through Strapi's internal endpoints
    // This is a workaround for development - in production, use the admin panel

    // Since we can't access internal Strapi functions from outside,
    // we'll need to do this through the admin panel or by directly modifying the database

    console.log('\n⚠️  IMPORTANT: Manual steps required!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('To enable public access to faculty data:');
    console.log('');
    console.log('1. Open Strapi Admin Panel: http://localhost:1337/admin');
    console.log('2. Go to Settings → Users & Permissions Plugin → Roles');
    console.log('3. Click on "Public" role');
    console.log('4. Under "Faculty" section, enable:');
    console.log('   ✓ find');
    console.log('   ✓ findOne');
    console.log('5. Click "Save"');
    console.log('');
    console.log('After completing these steps, run the import script again.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupPermissions();