#!/usr/bin/env node

/**
 * Add sample social/academic links to a few faculty members to demonstrate the icons
 */

async function addSampleSocialLinks() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('🔍 Fetching faculty to add sample social links...\n');

  // Get all faculty
  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  console.log(`Found ${faculty.length} faculty members\n`);

  // Add links to first 5 faculty as a demo
  const sampleLinks = [
    {
      labWebsite: 'https://www.example.com/lab',
      googleScholar: 'https://scholar.google.com/citations?user=SAMPLE',
      orcid: '0000-0001-2345-6789'
    }
  ];

  for (let i = 0; i < Math.min(5, faculty.length); i++) {
    const person = faculty[i];

    console.log(`Updating ${person.attributes.fullName}...`);

    const updateResponse = await fetch(`${API_URL}/faculties/${person.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          labWebsite: `https://www.example.com/${person.attributes.slug || 'lab'}`,
          googleScholar: 'https://scholar.google.com/citations?user=SAMPLE123',
          orcid: `0000-0001-2345-${6789 + i}`
        }
      })
    });

    if (updateResponse.ok) {
      console.log(`✅ Added social links to ${person.attributes.fullName}\n`);
    } else {
      const errorText = await updateResponse.text();
      console.log(`❌ Failed to update ${person.attributes.fullName}:`, updateResponse.status, errorText, '\n');
    }
  }

  console.log('\n✨ Sample social links added! Refresh your browser to see the icons.');
}

addSampleSocialLinks().catch(console.error);
