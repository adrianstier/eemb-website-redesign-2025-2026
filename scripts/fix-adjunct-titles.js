#!/usr/bin/env node

/**
 * Fix Jenn Caselle and Kevin Lafferty - they're Adjunct faculty, not Research Professors
 */

async function fixAdjunctTitles() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('🔍 Finding Jenn Caselle and Kevin Lafferty...\n');

  // Get all faculty
  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  // Find Jenn Caselle and Kevin Lafferty
  const caselle = faculty.find(f => f.attributes.fullName.includes('Caselle'));
  const lafferty = faculty.find(f => f.attributes.fullName.includes('Lafferty'));

  const toUpdate = [
    { person: caselle, name: 'Jenn Caselle' },
    { person: lafferty, name: 'Kevin Lafferty' }
  ];

  for (const { person, name } of toUpdate) {
    if (!person) {
      console.log(`❌ ${name} not found`);
      continue;
    }

    console.log(`Found: ${person.attributes.fullName}`);
    console.log(`Current title: "${person.attributes.title}"\n`);

    // Update to Adjunct Professor
    const updateResponse = await fetch(`${API_URL}/faculties/${person.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          title: 'Adjunct Professor'
        }
      })
    });

    if (updateResponse.ok) {
      console.log(`✅ Updated ${person.attributes.fullName}'s title to "Adjunct Professor"\n`);
    } else {
      const errorText = await updateResponse.text();
      console.log(`❌ Failed to update ${name}:`, updateResponse.status, errorText, '\n');
    }
  }
}

fixAdjunctTitles().catch(console.error);
