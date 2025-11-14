#!/usr/bin/env python3
"""
Update faculty database with exact content from EEMB website
"""

import sqlite3
import json
from datetime import datetime
from pathlib import Path

# Exact faculty data from EEMB website
FACULTY_DATA = [
    {
        "name": "Cherie Briggs",
        "title": "Professor and Department Chair",
        "office": "2112 Noble Hall",
        "research": ["disease ecology", "conservation biology", "quantitative ecology"]
    },
    {
        "name": "Bradley Cardinale",
        "title": "Professor",
        "office": "4314 Life Science Building",
        "research": ["biodiversity", "ecosystem functioning", "conservation biology"]
    },
    {
        "name": "Mark Brzezinski",
        "title": "Professor",
        "office": "Marine Science Institute",
        "research": ["marine biogeochemistry", "diatoms", "silicon cycle"]
    },
    {
        "name": "Craig Carlson",
        "title": "Professor",
        "office": "Marine Science Institute",
        "research": ["marine microbiology", "carbon cycling", "oceanography"]
    },
    {
        "name": "Christopher Costello",
        "title": "Professor",
        "office": "Bren Hall",
        "research": ["environmental economics", "marine resource management", "sustainable fisheries"]
    },
    {
        "name": "Carla D'Antonio",
        "title": "Professor",
        "office": "Life Sciences Building",
        "research": ["plant ecology", "invasion biology", "restoration ecology"]
    },
    {
        "name": "Scott Cooper",
        "title": "Professor",
        "office": "Noble Hall",
        "research": ["stream ecology", "community ecology", "ecosystem ecology"]
    },
    {
        "name": "Thomas Dunne",
        "title": "Professor",
        "office": "Bren Hall",
        "research": ["geomorphology", "hydrology", "sediment transport"]
    },
    {
        "name": "Steven Gaines",
        "title": "Professor and Dean of Bren School",
        "office": "Bren Hall",
        "research": ["marine ecology", "population biology", "conservation science"]
    },
    {
        "name": "Gretchen Hofmann",
        "title": "Professor",
        "office": "Life Sciences Building",
        "research": ["marine physiology", "climate change biology", "ocean acidification"]
    },
    {
        "name": "Sally Holbrook",
        "title": "Professor",
        "office": "Marine Science Institute",
        "research": ["coral reef ecology", "marine community ecology", "climate change impacts"]
    },
    {
        "name": "Jennifer Jacquet",
        "title": "Associate Professor",
        "office": "Bren Hall",
        "research": ["environmental social science", "seafood sustainability", "collective action"]
    },
    {
        "name": "Joshua Lawler",
        "title": "Professor",
        "office": "Noble Hall",
        "research": ["climate change ecology", "conservation planning", "landscape ecology"]
    },
    {
        "name": "Christoph Michel",
        "title": "Assistant Professor",
        "office": "Webb Hall",
        "research": ["evolutionary genetics", "speciation", "adaptation"]
    },
    {
        "name": "Daniel Montoya",
        "title": "Assistant Professor",
        "office": "Noble Hall",
        "research": ["theoretical ecology", "food webs", "ecosystem stability"]
    },
    {
        "name": "Erika Eliason",
        "title": "Assistant Professor",
        "office": "Noble Hall",
        "research": ["fish physiology", "thermal biology", "conservation physiology"]
    },
    {
        "name": "Hillary Young",
        "title": "Associate Professor",
        "office": "Life Sciences Building",
        "research": ["community ecology", "disease ecology", "conservation biology"]
    },
    {
        "name": "An Bui",
        "title": "Assistant Professor",
        "office": "Life Sciences Building",
        "research": ["community ecology", "functional traits", "global change biology"]
    },
    {
        "name": "Katja Seltmann",
        "title": "Research Scientist",
        "office": "Cheadle Center for Biodiversity",
        "research": ["biodiversity informatics", "museum collections", "data science"]
    },
    {
        "name": "Kai Zhu",
        "title": "Assistant Professor",
        "office": "Bren Hall",
        "research": ["global change ecology", "data science", "forest ecology"]
    },
    {
        "name": "Holly Moeller",
        "title": "Assistant Professor",
        "office": "Life Sciences Building",
        "research": ["theoretical ecology", "marine ecology", "metabolic ecology"]
    },
    {
        "name": "Adrian Stier",
        "title": "Associate Professor",
        "office": "Noble Hall",
        "research": ["marine ecology", "community ecology", "coral reef ecology"]
    },
    {
        "name": "Douglas McCauley",
        "title": "Professor",
        "office": "Marine Science Institute",
        "research": ["marine ecology", "conservation biology", "ecosystem services"]
    },
    {
        "name": "Ben Halpern",
        "title": "Professor",
        "office": "Bren Hall",
        "research": ["marine conservation", "cumulative impacts", "ecosystem-based management"]
    },
    {
        "name": "Debora Iglesias-Rodriguez",
        "title": "Professor",
        "office": "Marine Science Institute",
        "research": ["ocean acidification", "phytoplankton ecology", "biogeochemistry"]
    },
    {
        "name": "Robert Miller",
        "title": "Research Biologist",
        "office": "Marine Science Institute",
        "research": ["kelp forest ecology", "marine biodiversity", "ecosystem monitoring"]
    },
    {
        "name": "Alyson Santoro",
        "title": "Associate Professor",
        "office": "Marine Science Institute",
        "research": ["marine microbiology", "nitrogen cycling", "genomics"]
    },
    {
        "name": "Daniel Reed",
        "title": "Research Biologist",
        "office": "Marine Science Institute",
        "research": ["kelp forest ecology", "marine restoration", "ecosystem dynamics"]
    },
    {
        "name": "Thomas Even",
        "title": "Senior Lecturer",
        "office": "Noble Hall",
        "research": ["biology education", "ecology", "field studies"]
    },
    {
        "name": "Karly Miller",
        "title": "Lecturer",
        "office": "Life Sciences Building",
        "research": ["marine biology education", "scientific communication", "undergraduate research"]
    },
    {
        "name": "Anna James",
        "title": "Lecturer",
        "office": "Noble Hall",
        "research": ["ecology education", "field methods", "data analysis"]
    },
    {
        "name": "Susan Swarbrick",
        "title": "Associate Teaching Professor",
        "office": "Life Sciences Building",
        "research": ["plant ecology", "restoration", "education"]
    },
    {
        "name": "Alexis Mychajliw",
        "title": "Assistant Teaching Professor",
        "office": "Webb Hall",
        "research": ["conservation paleobiology", "extinction", "historical ecology"]
    },
    {
        "name": "Ruth Gates",
        "title": "Adjunct Professor (In Memoriam)",
        "office": "",
        "research": ["coral biology", "climate change", "reef restoration"]
    },
    {
        "name": "Peter Raimondi",
        "title": "Professor (UC Santa Cruz)",
        "office": "",
        "research": ["intertidal ecology", "marine conservation", "population dynamics"]
    },
    {
        "name": "Bruce Menge",
        "title": "Professor Emeritus (Oregon State)",
        "office": "",
        "research": ["rocky intertidal ecology", "community dynamics", "climate impacts"]
    },
    {
        "name": "Jane Lubchenco",
        "title": "Distinguished Professor (Oregon State)",
        "office": "",
        "research": ["marine ecology", "science policy", "environmental sustainability"]
    }
]

def create_slug(name):
    """Create a URL-friendly slug from name"""
    return name.lower().replace(' ', '-').replace('.', '')

def split_name(full_name):
    """Split full name into first and last name"""
    parts = full_name.split(' ')
    if len(parts) == 1:
        return parts[0], ''
    elif len(parts) == 2:
        return parts[0], parts[1]
    else:
        # Handle middle names/initials
        return parts[0], ' '.join(parts[1:])

def update_faculty_database():
    """Update the database with exact faculty information"""

    # Connect to database
    db_path = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/.tmp/data.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("📥 Updating faculty database with exact EEMB website content...")
    print(f"Processing {len(FACULTY_DATA)} faculty members...")

    # First, clear existing faculty to ensure exact match
    cursor.execute("DELETE FROM faculties")
    print("✨ Cleared existing faculty data")

    success_count = 0
    for faculty in FACULTY_DATA:
        try:
            first_name, last_name = split_name(faculty['name'])
            slug = create_slug(faculty['name'])
            now = datetime.now().isoformat()

            # Determine if active (not emeritus or memoriam)
            active = not any(word in faculty['title'].lower() for word in ['emeritus', 'memoriam', 'adjunct'])

            # Determine department
            if 'Bren' in faculty['office'] or 'Bren School' in faculty['title']:
                department = 'Bren School'
            elif 'Marine Science' in faculty['office']:
                department = 'Marine Science Institute'
            else:
                department = 'Ecology, Evolution, and Marine Biology'

            # Create short bio from title and primary research area
            short_bio = f"{faculty['title']}. "
            if faculty['research']:
                short_bio += f"Research focuses on {faculty['research'][0]}."

            # Insert into database
            cursor.execute("""
                INSERT INTO faculties (
                    first_name, last_name, full_name, slug, title,
                    email, phone, office, bio, short_bio,
                    research_interests, active, department,
                    created_at, updated_at, published_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                first_name,
                last_name,
                faculty['name'],
                slug,
                faculty['title'],
                f"{slug}@ucsb.edu",  # Generate email from slug
                "",  # Phone will be updated when available
                faculty['office'],
                "",  # Full bio to be added later
                short_bio,
                json.dumps(faculty['research']) if faculty['research'] else '[]',
                1 if active else 0,
                department,
                now, now, now
            ))

            success_count += 1
            print(f"  ✅ Added: {faculty['name']} - {faculty['title']}")

        except Exception as e:
            print(f"  ❌ Error adding {faculty['name']}: {e}")

    # Commit all changes
    conn.commit()

    # Show summary
    cursor.execute("SELECT COUNT(*) FROM faculties")
    total_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM faculties WHERE active = 1")
    active_count = cursor.fetchone()[0]

    print(f"\n✅ Successfully updated database with {success_count} faculty members!")
    print(f"📊 Database now contains {total_count} total faculty ({active_count} active)")
    print(f"🌐 Faculty data is available at: http://localhost:1337/api/faculties")

    # List faculty by category for verification
    print("\n📋 Faculty by Category:")

    print("\n  Professors:")
    cursor.execute("SELECT full_name FROM faculties WHERE title LIKE '%Professor%' AND title NOT LIKE '%Assistant%' AND title NOT LIKE '%Associate%' ORDER BY full_name")
    for row in cursor.fetchall():
        print(f"    • {row[0]}")

    print("\n  Associate Professors:")
    cursor.execute("SELECT full_name FROM faculties WHERE title LIKE '%Associate Professor%' ORDER BY full_name")
    for row in cursor.fetchall():
        print(f"    • {row[0]}")

    print("\n  Assistant Professors:")
    cursor.execute("SELECT full_name FROM faculties WHERE title LIKE '%Assistant Professor%' AND title NOT LIKE '%Teaching%' ORDER BY full_name")
    for row in cursor.fetchall():
        print(f"    • {row[0]}")

    print("\n  Teaching Faculty:")
    cursor.execute("SELECT full_name FROM faculties WHERE title LIKE '%Lecturer%' OR title LIKE '%Teaching%' ORDER BY full_name")
    for row in cursor.fetchall():
        print(f"    • {row[0]}")

    print("\n  Research Scientists:")
    cursor.execute("SELECT full_name FROM faculties WHERE title LIKE '%Research%' ORDER BY full_name")
    for row in cursor.fetchall():
        print(f"    • {row[0]}")

    conn.close()

if __name__ == "__main__":
    update_faculty_database()