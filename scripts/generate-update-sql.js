#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const scrapedData = require('./comprehensive-people-data.json');

const sqlStatements = [];

sqlStatements.push('-- Update Faculty Emails and Offices');
sqlStatements.push('-- Generated from comprehensive-people-data.json');
sqlStatements.push('');

scrapedData.people.forEach(person => {
  if (!person.name) return;

  const escapedName = person.name.replace(/'/g, "''");
  const updates = [];

  if (person.email) {
    const escapedEmail = person.email.replace(/'/g, "''");
    updates.push(`email = '${escapedEmail}'`);
  }

  if (person.office) {
    const escapedOffice = person.office.replace(/'/g, "''");
    updates.push(`office = '${escapedOffice}'`);
  }

  if (person.phone && person.phone !== '805.893.xxxxx') {
    const escapedPhone = person.phone.replace(/'/g, "''");
    updates.push(`phone = '${escapedPhone}'`);
  }

  if (updates.length > 0) {
    const table = person.category === 'faculty' ? 'faculties' :
                  person.category === 'staff' ? 'staffs' :
                  person.category === 'researchers' ? 'faculties' : 'faculties';

    sqlStatements.push(`UPDATE ${table} SET ${updates.join(', ')}, updated_at = datetime('now') WHERE full_name = '${escapedName}';`);
  }
});

const outputPath = path.join(__dirname, 'update-people.sql');
fs.writeFileSync(outputPath, sqlStatements.join('\n'));

console.log(`✅ Generated SQL update file: ${outputPath}`);
console.log(`📊 Total statements: ${sqlStatements.length - 3}`);
console.log(`\n💡 Run with: sqlite3 backend/.tmp/data.db < scripts/update-people.sql`);
