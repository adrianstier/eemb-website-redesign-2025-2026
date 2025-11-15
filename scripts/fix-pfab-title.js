#!/usr/bin/env node

/**
 * Fix Ferdinand Pfab's title - he's a Postdoc, not Research Professor
 */

async function fixPfabTitle() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('🔍 Finding Ferdinand Pfab...\n');

  // Get all faculty
  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  // Find Ferdinand Pfab
  const pfab = faculty.find(f => f.attributes.fullName.includes('Pfab'));

  if (!pfab) {
    console.log('❌ Ferdinand Pfab not found');
    return;
  }

  console.log(`Found: ${pfab.attributes.fullName}`);
  console.log(`Current title: "${pfab.attributes.title}"\n`);

  // Update to Postdoctoral Researcher
  const updateResponse = await fetch(`${API_URL}/faculties/${pfab.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: {
        title: 'Postdoctoral Researcher'
      }
    })
  });

  if (updateResponse.ok) {
    console.log('✅ Updated Ferdinand Pfab\'s title to "Postdoctoral Researcher"');
  } else {
    const errorText = await updateResponse.text();
    console.log('❌ Failed to update:', updateResponse.status, errorText);
  }
}

fixPfabTitle().catch(console.error);
