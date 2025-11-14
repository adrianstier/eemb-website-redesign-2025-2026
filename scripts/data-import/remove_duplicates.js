#!/usr/bin/env node

/**
 * Remove duplicate people records from database
 * Keeps the most complete record (with slug, photo, bio, etc.)
 */

const STRAPI_URL = 'http://localhost:1337';

async function getAllFaculty() {
  const response = await fetch(`${STRAPI_URL}/api/faculties?pagination[limit]=200`);
  const data = await response.json();
  return data.data;
}

async function deleteFaculty(id) {
  const response = await fetch(`${STRAPI_URL}/api/faculties/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
}

function scoreRecord(record) {
  let score = 0;
  const attrs = record.attributes;

  // Prefer records with slug (these are the original ones)
  if (attrs.slug) score += 100;

  // Prefer records with photos
  if (attrs.photo_url) score += 50;

  // Prefer records with more complete data
  if (attrs.bio && attrs.bio.length > 100) score += 20;
  if (attrs.shortBio && attrs.shortBio.length > 20) score += 10;
  if (attrs.researchInterests && attrs.researchInterests.length > 0) score += 10;
  if (attrs.labWebsite) score += 5;
  if (attrs.googleScholar) score += 5;
  if (attrs.phone) score += 3;
  if (attrs.office) score += 3;

  // Prefer records with @ucsb.edu email
  if (attrs.email && attrs.email.includes('@ucsb.edu')) score += 30;

  // Prefer records with @lifesci.ucsb.edu email (more specific)
  if (attrs.email && attrs.email.includes('@lifesci.ucsb.edu')) score += 10;

  return score;
}

async function main() {
  console.log('🔍 Finding and Removing Duplicate Faculty Records\n');
  console.log('='.repeat(70));

  const allFaculty = await getAllFaculty();
  console.log(`\n📊 Total faculty records: ${allFaculty.length}`);

  // Group by full name
  const byName = new Map();
  for (const faculty of allFaculty) {
    const name = faculty.attributes.fullName;
    if (!byName.has(name)) {
      byName.set(name, []);
    }
    byName.get(name).push(faculty);
  }

  // Find duplicates
  const duplicates = Array.from(byName.entries()).filter(([name, records]) => records.length > 1);

  console.log(`\n🔎 Found ${duplicates.length} people with duplicate records`);
  console.log('='.repeat(70));

  let totalDeleted = 0;
  let totalKept = 0;

  for (const [name, records] of duplicates) {
    console.log(`\n👤 ${name} (${records.length} records)`);

    // Score each record
    const scoredRecords = records.map(r => ({
      record: r,
      score: scoreRecord(r)
    }));

    // Sort by score (highest first)
    scoredRecords.sort((a, b) => b.score - a.score);

    // Keep the highest scoring record
    const toKeep = scoredRecords[0];
    const toDelete = scoredRecords.slice(1);

    console.log(`   ✅ KEEPING: ID ${toKeep.record.id} (score: ${toKeep.score})`);
    console.log(`      Email: ${toKeep.record.attributes.email}`);
    console.log(`      Slug: ${toKeep.record.attributes.slug || 'none'}`);
    console.log(`      Photo: ${toKeep.record.attributes.photo_url ? 'yes' : 'no'}`);

    totalKept++;

    for (const item of toDelete) {
      console.log(`   ❌ DELETING: ID ${item.record.id} (score: ${item.score})`);
      console.log(`      Email: ${item.record.attributes.email}`);
      console.log(`      Slug: ${item.record.attributes.slug || 'none'}`);

      const deleted = await deleteFaculty(item.record.id);
      if (deleted) {
        console.log(`      ✓ Deleted successfully`);
        totalDeleted++;
      } else {
        console.log(`      ✗ Failed to delete`);
      }

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 SUMMARY:');
  console.log('='.repeat(70));
  console.log(`People with duplicates: ${duplicates.length}`);
  console.log(`Records kept: ${totalKept}`);
  console.log(`Records deleted: ${totalDeleted}`);
  console.log(`Expected final count: ${allFaculty.length - totalDeleted}`);
  console.log('='.repeat(70));

  if (totalDeleted > 0) {
    console.log('\n✅ Deduplication complete!');
    console.log('   Refresh http://localhost:3000/people to see the updated list.\n');
  }
}

main().catch(console.error);
