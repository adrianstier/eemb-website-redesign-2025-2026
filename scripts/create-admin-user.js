#!/usr/bin/env node

/**
 * Create an admin user for the EEMB website
 * This creates a regular authenticated user (not a Strapi admin panel user)
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdminUser() {
  console.log('🔐 EEMB Admin User Registration\n');
  console.log('This will create an admin user for the EEMB website admin panel.\n');

  const username = await question('Username: ');
  const email = await question('Email: ');
  const password = await question('Password: ');

  console.log('\n🔄 Creating admin user...\n');

  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Failed to create user:', data.error?.message || 'Unknown error');
      if (data.error?.details) {
        console.error('\nDetails:', JSON.stringify(data.error.details, null, 2));
      }
      rl.close();
      process.exit(1);
    }

    console.log('✅ Admin user created successfully!\n');
    console.log('User Details:');
    console.log(`  Username: ${data.user.username}`);
    console.log(`  Email: ${data.user.email}`);
    console.log(`  ID: ${data.user.id}\n`);
    console.log('🎉 You can now login at http://localhost:3000/admin\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  rl.close();
}

createAdminUser();
