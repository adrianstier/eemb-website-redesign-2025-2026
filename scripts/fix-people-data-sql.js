#!/usr/bin/env node

/**
 * Fix People Data in Strapi Database
 * This script directly updates the SQLite database to fix emails and office locations
 * using the accurate data we scraped from the original EEMB website
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('better-sqlite3');

async function fixPeopleData() {
  console.log('🔧 Fixing people data in database...\n');

  // Load scraped data
  const scrapedDataPath = path.join(__dirname, 'comprehensive-people-data.json');
  if (!fs.existsSync(scrapedDataPath)) {
    console.error('❌ Error: comprehensive-people-data.json not found!');
    console.error('   Please run: node scripts/comprehensive-people-import.js');
    process.exit(1);
  }

  const scrapedData = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf-8'));
  console.log(`📊 Loaded ${scrapedData.people.length} scraped profiles\n`);

  // Open database
  const dbPath = path.join(__dirname, '..', 'backend', '.tmp', 'data.db');
  if (!fs.existsSync(dbPath)) {
    console.error('❌ Error: Database not found at:', dbPath);
    process.exit(1);
  }

  const db = sqlite3(dbPath);
  console.log('✅ Connected to database\n');

  let updated = 0;
  let errors = 0;

  // Update faculty
  for (const person of scrapedData.people.filter(p => p.category === 'faculty')) {
    if (!person.email) continue;

    try {
      // Find by name
      const existing = db.prepare(`
        SELECT id, full_name, email, office, phone
        FROM faculties
        WHERE full_name = ?
      `).get(person.name);

      if (!existing) {
        console.log(`⚠️  Not found in DB: ${person.name}`);
        continue;
      }

      const updates = {};
      if (person.email && person.email !== existing.email) updates.email = person.email;
      if (person.office && person.office !== existing.office) updates.office = person.office;
      if (person.phone && person.phone !== existing.phone) updates.phone = person.phone;

      if (Object.keys(updates).length === 0) continue;

      const updateFields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
      const updateValues = [...Object.values(updates), existing.id];

      db.prepare(`
        UPDATE faculties
        SET ${updateFields}, updated_at = datetime('now')
        WHERE id = ?
      `).run(...updateValues);

      console.log(`✅ Updated ${person.name}:`);
      if (updates.email) console.log(`   📧 Email: ${updates.email}`);
      if (updates.office) console.log(`   📍 Office: ${updates.office}`);
      if (updates.phone) console.log(`   📱 Phone: ${updates.phone}`);
      updated++;

    } catch (error) {
      console.error(`❌ Error updating ${person.name}:`, error.message);
      errors++;
    }
  }

  // Update staff
  const staffTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='staffs'").get();
  if (staffTable) {
    for (const person of scrapedData.people.filter(p => p.category === 'staff')) {
      if (!person.email) continue;

      try {
        const existing = db.prepare(`
          SELECT id, full_name, email, office, phone
          FROM staffs
          WHERE full_name = ?
        `).get(person.name);

        if (!existing) {
          console.log(`⚠️  Staff not found: ${person.name}`);
          continue;
        }

        const updates = {};
        if (person.email && person.email !== existing.email) updates.email = person.email;
        if (person.office && person.office !== existing.office) updates.office = person.office;
        if (person.phone && person.phone !== existing.phone) updates.phone = person.phone;

        if (Object.keys(updates).length === 0) continue;

        const updateFields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
        const updateValues = [...Object.values(updates), existing.id];

        db.prepare(`
          UPDATE staffs
          SET ${updateFields}, updated_at = datetime('now')
          WHERE id = ?
        `).run(...updateValues);

        console.log(`✅ Updated ${person.name}:`);
        if (updates.email) console.log(`   📧 Email: ${updates.email}`);
        if (updates.office) console.log(`   📍 Office: ${updates.office}`);
        if (updates.phone) console.log(`   📱 Phone: ${updates.phone}`);
        updated++;

      } catch (error) {
        console.error(`❌ Error updating ${person.name}:`, error.message);
        errors++;
      }
    }
  }

  db.close();

  console.log(`\n\n✨ Database update complete!`);
  console.log(`📊 Statistics:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Errors: ${errors}`);
  console.log(`\n💡 Restart the Strapi backend to see changes`);
}

fixPeopleData().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
