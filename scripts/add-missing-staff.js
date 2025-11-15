#!/usr/bin/env node

/**
 * Add Oscar Perez and Patrick White to staff_members table
 */

async function addMissingStaff() {
  console.log('🔄 Adding missing staff members...\n');

  const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  const staffToAdd = [
    {
      firstName: 'Oscar',
      lastName: 'Perez',
      fullName: 'Oscar Perez',
      email: 'oscar.perez@eemb.ucsb.edu',
      phone: '805.893.3357',
      office: '1118 Biological Sciences Instructional Facility',
      slug: 'oscar-perez'
    },
    {
      firstName: 'Patrick',
      lastName: 'White',
      fullName: 'Patrick White',
      email: 'patrick.white@eemb.ucsb.edu',
      phone: '805.893.2974',
      office: '1255 Bio Shop',
      slug: 'patrick-white'
    }
  ];

  for (const person of staffToAdd) {
    try {
      console.log(`Adding ${person.fullName}...`);

      const response = await fetch(`${API_URL}/staff-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: person })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`   ❌ Failed: ${response.statusText}`);
        console.error(`   Response: ${errorText}`);
      } else {
        console.log(`   ✅ Added ${person.fullName}`);
      }
    } catch (error) {
      console.error(`   ❌ Error adding ${person.fullName}:`, error.message);
    }
  }

  console.log('\n✨ Done!\n');
}

addMissingStaff().catch(console.error);
