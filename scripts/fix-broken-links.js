#!/usr/bin/env node

/**
 * Fix broken links with correct URLs found via web search
 */

async function fixBrokenLinks() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('\\n🔧 Fixing broken links with correct URLs...\\n');

  const fixes = {
    'Holly Moeller': {
      labWebsite: 'https://moellerlab.org/'
    },
    'Adrian Stier': {
      labWebsite: 'https://www.oceanrecoveries.com/'
    },
    "Carla D'Antonio": {
      googleScholar: 'https://scholar.google.com/citations?user=qYym6p0AAAAJ&hl=en'
    },
    'Halley Froehlich': {
      googleScholar: 'https://scholar.google.com/citations?user=072ktIQAAAAJ&hl=en'
    },
    'Scott Hodges': {
      googleScholar: 'https://scholar.google.com/citations?user=JC1kXi4AAAAJ&hl=en'
    },
    'Samuel Sweet': {
      googleScholar: 'https://scholar.google.com/citations?user=t07iyOAAAAAJ'
    },
    'William Rice': {
      googleScholar: 'https://scholar.google.com/citations?user=m6QhNykAAAAJ&hl=en'
    },
    'Russell Schmitt': {
      googleScholar: 'https://scholar.google.com/citations?user=f3Yzdp8AAAAJ&hl=en'
    }
  };

  // Fetch all faculty
  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  let updated = 0;
  let notFound = 0;

  for (const [name, updates] of Object.entries(fixes)) {
    console.log(`\\n👤 ${name}`);

    const person = faculty.find(f => f.attributes.fullName === name);

    if (!person) {
      console.log('   ❌ Not found in database');
      notFound++;
      continue;
    }

    console.log('   ✓ Found in database');

    if (updates.labWebsite) {
      console.log(`   🌐 Updating lab website: ${updates.labWebsite}`);
    }
    if (updates.googleScholar) {
      console.log(`   🎓 Updating Google Scholar: ${updates.googleScholar}`);
    }

    const updateResponse = await fetch(`${API_URL}/faculties/${person.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: updates })
    });

    if (updateResponse.ok) {
      console.log('   ✅ Updated successfully');
      updated++;
    } else {
      const errorText = await updateResponse.text();
      console.log(`   ❌ Failed: ${errorText}`);
    }
  }

  console.log('\\n\\n═══════════════════════════════════════════════════════════');
  console.log('📊 SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   ✅ Fixed: ${updated}`);
  console.log(`   ❌ Not found: ${notFound}`);
  console.log(`   📝 Total: ${Object.keys(fixes).length}`);
  console.log('═══════════════════════════════════════════════════════════\\n');

  console.log('✨ Done! Broken links have been fixed.\\n');
}

fixBrokenLinks().catch(console.error);
