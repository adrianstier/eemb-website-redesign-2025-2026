#!/usr/bin/env node

/**
 * Generate slugs for people records that don't have them
 * Slug format: firstname-lastname (lowercase, no special chars)
 */

const STRAPI_URL = 'http://localhost:1337';

function generateSlug(firstName, lastName) {
  const parts = [];

  if (firstName) {
    parts.push(firstName.toLowerCase()
      .replace(/[áàâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''));
  }

  if (lastName) {
    parts.push(lastName.toLowerCase()
      .replace(/[áàâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, ''));
  }

  return parts.join('-');
}

async function fetchJSON(url) {
  const response = await fetch(url);
  return response.json();
}

async function updateSlug(type, id, slug) {
  const endpoints = {
    faculty: 'faculties',
    staff: 'staff-members',
    students: 'graduate-students'
  };

  const endpoint = endpoints[type];

  try {
    const response = await fetch(`${STRAPI_URL}/api/${endpoint}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { slug } })
    });

    return response.ok;
  } catch (error) {
    console.log(`  ❌ Update failed: ${error.message}`);
    return false;
  }
}

async function processType(type, endpoint) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📝 Processing ${type.toUpperCase()}`);
  console.log('='.repeat(70));

  const response = await fetchJSON(`${STRAPI_URL}/api/${endpoint}?pagination[limit]=200`);
  const people = response.data;

  let updated = 0;
  let skipped = 0;

  for (const person of people) {
    const { id, attributes } = person;
    const name = attributes.fullName || attributes.full_name;

    if (attributes.slug) {
      console.log(`✓ ${name} - already has slug: ${attributes.slug}`);
      skipped++;
      continue;
    }

    const slug = generateSlug(attributes.firstName || attributes.first_name,
                              attributes.lastName || attributes.last_name);

    console.log(`📌 ${name} -> ${slug}`);

    const success = await updateSlug(type, id, slug);
    if (success) {
      console.log(`   ✅ Updated`);
      updated++;
    } else {
      console.log(`   ❌ Failed`);
    }
  }

  console.log(`\n📊 Summary: ${updated} updated, ${skipped} already had slugs`);
  return { updated, skipped };
}

async function main() {
  console.log('📝 Generating Slugs for People Records');
  console.log('='.repeat(70));

  const stats = {
    faculty: await processType('faculty', 'faculties'),
    staff: await processType('staff', 'staff-members'),
    students: await processType('students', 'graduate-students')
  };

  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(70));
  console.log(`Faculty: ${stats.faculty.updated} slugs generated`);
  console.log(`Staff: ${stats.staff.updated} slugs generated`);
  console.log(`Students: ${stats.students.updated} slugs generated`);
  console.log(`Total: ${stats.faculty.updated + stats.staff.updated + stats.students.updated} slugs generated`);
  console.log('='.repeat(70));
  console.log('\n✅ Slug generation complete!\n');
}

main().catch(console.error);
