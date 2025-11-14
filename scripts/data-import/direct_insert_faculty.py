#!/usr/bin/env python3
"""
Direct insert faculty data into Strapi database
"""

import sqlite3
import json
from datetime import datetime
from pathlib import Path

def insert_faculty_data():
    # Load processed faculty data
    with open('processed_faculty.json', 'r') as f:
        faculty_list = json.load(f)

    # Connect to database
    db_path = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/.tmp/data.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print(f"📥 Inserting {len(faculty_list)} faculty members directly into database...")

    success_count = 0
    for faculty in faculty_list:
        try:
            # Prepare the data
            now = datetime.now().isoformat()

            # Insert into faculties table
            cursor.execute("""
                INSERT INTO faculties (
                    first_name, last_name, full_name, slug, title,
                    email, phone, office, bio, short_bio,
                    research_interests, active, department,
                    created_at, updated_at, published_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                faculty['firstName'],
                faculty['lastName'] if faculty['lastName'] else faculty['firstName'],  # Use firstName if lastName is empty
                faculty['fullName'],
                faculty['slug'],
                faculty['title'],
                faculty['email'],
                faculty['phone'],
                faculty['office'],
                faculty['bio'],
                faculty['shortBio'],
                json.dumps(faculty['researchInterests']) if faculty['researchInterests'] else '[]',
                1 if faculty['active'] else 0,
                faculty['department'],
                now, now, now
            ))

            success_count += 1
            print(f"  ✅ Inserted: {faculty['fullName']}")

        except sqlite3.IntegrityError as e:
            if 'UNIQUE constraint failed' in str(e):
                print(f"  ⏭️  Skipping {faculty['fullName']} - already exists")
            else:
                print(f"  ❌ Failed: {faculty['fullName']} - {e}")
        except Exception as e:
            print(f"  ❌ Error: {faculty['fullName']} - {e}")

    # Commit changes
    conn.commit()
    conn.close()

    print(f"\n✅ Successfully inserted {success_count} faculty members!")
    print(f"🌐 Faculty data is now available at: http://localhost:1337/api/faculties")

if __name__ == "__main__":
    insert_faculty_data()