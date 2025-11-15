#!/usr/bin/env node

/**
 * Remove placeholder and suspicious links from faculty database
 * - Remove policy.ucsb.edu/terms-of-use links
 * - Remove example.com links
 * - Remove fake ORCID IDs
 */

async function removePlaceholderLinks() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('\\n🧹 Removing placeholder and suspicious links...\\n');

  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  let cleaned = 0;
  let skipped = 0;

  for (const person of faculty) {
    const attrs = person.attributes;
    const name = attrs.fullName;
    let needsUpdate = false;
    const updates = {};

    // Check for suspicious lab website
    if (attrs.labWebsite) {
      if (attrs.labWebsite.includes('policy.ucsb.edu') ||
          attrs.labWebsite.includes('example.com') ||
          attrs.labWebsite.includes('terms-of-use')) {
        console.log(`\\n👤 ${name}`);
        console.log(`   🗑️  Removing suspicious lab website: ${attrs.labWebsite}`);
        updates.labWebsite = null;
        needsUpdate = true;
      }
    }

    // Check for fake ORCID (all except the 2 valid ones)
    if (attrs.orcid &&
        attrs.orcid !== '0000-0002-0427-0484' &&  // Deron Burkepile
        attrs.orcid !== '0000-0003-2503-8219') {  // Alyson Santoro
      if (!console.log.lastPerson) {
        console.log(`\\n👤 ${name}`);
      }
      console.log(`   🗑️  Removing fake ORCID: ${attrs.orcid}`);
      updates.orcid = null;
      needsUpdate = true;
    }

    if (needsUpdate) {
      const updateResponse = await fetch(`${API_URL}/faculties/${person.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: updates })
      });

      if (updateResponse.ok) {
        console.log(`   ✅ Cleaned`);
        cleaned++;
      } else {
        console.log(`   ❌ Failed`);
      }
    } else {
      skipped++;
    }
  }

  console.log('\\n\\n═══════════════════════════════════════════════════════════');
  console.log('📊 CLEANUP SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   ✅ Cleaned: ${cleaned}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   📝 Total: ${faculty.length}`);
  console.log('═══════════════════════════════════════════════════════════\\n');

  console.log('✨ Done! Placeholder links have been removed.\\n');
}

removePlaceholderLinks().catch(console.error);
