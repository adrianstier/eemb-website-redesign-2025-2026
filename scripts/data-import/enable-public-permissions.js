#!/usr/bin/env node

/**
 * Enable public permissions for new content types
 * This allows the import script and frontend to access the data without authentication
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../backend/.tmp/data.db');

console.log('🔑 Enabling public permissions for content types...\n');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to database\n');
});

// Get the public role ID
db.get('SELECT id FROM up_roles WHERE type = ?', ['public'], (err, role) => {
  if (err) {
    console.error('❌ Error finding public role:', err.message);
    db.close();
    process.exit(1);
  }

  if (!role) {
    console.error('❌ Public role not found');
    db.close();
    process.exit(1);
  }

  const publicRoleId = role.id;
  console.log(`✅ Found public role (ID: ${publicRoleId})\n`);

  // Define permissions to add
  const permissions = [
    // Staff permissions
    { action: 'api::staff.staff.find', role: publicRoleId },
    { action: 'api::staff.staff.findOne', role: publicRoleId },

    // Graduate Student permissions
    { action: 'api::graduate-student.graduate-student.find', role: publicRoleId },
    { action: 'api::graduate-student.graduate-student.findOne', role: publicRoleId },
  ];

  let completed = 0;

  permissions.forEach((perm) => {
    db.run(
      'INSERT OR IGNORE INTO up_permissions (action, role) VALUES (?, ?)',
      [perm.action, perm.role],
      function(err) {
        if (err) {
          console.error(`❌ Error adding permission ${perm.action}:`, err.message);
        } else if (this.changes > 0) {
          console.log(`✅ Added permission: ${perm.action}`);
        } else {
          console.log(`⏭️  Already exists: ${perm.action}`);
        }

        completed++;
        if (completed === permissions.length) {
          // Link permissions to role
          linkPermissions(db, publicRoleId);
        }
      }
    );
  });
});

function linkPermissions(db, roleId) {
  console.log('\n🔗 Linking permissions to public role...\n');

  db.all('SELECT id FROM up_permissions WHERE role = ?', [roleId], (err, permissions) => {
    if (err) {
      console.error('❌ Error fetching permissions:', err.message);
      db.close();
      process.exit(1);
    }

    let linked = 0;
    permissions.forEach((perm) => {
      db.run(
        'INSERT OR IGNORE INTO up_permissions_role_links (permission_id, role_id) VALUES (?, ?)',
        [perm.id, roleId],
        (err) => {
          if (err) {
            console.error(`❌ Error linking permission ${perm.id}:`, err.message);
          }
          linked++;

          if (linked === permissions.length) {
            console.log(`✅ Linked ${permissions.length} permissions\n`);
            console.log('🎉 Public permissions enabled successfully!');
            console.log('   You can now run the import script.\n');
            db.close();
          }
        }
      );
    });
  });
}
