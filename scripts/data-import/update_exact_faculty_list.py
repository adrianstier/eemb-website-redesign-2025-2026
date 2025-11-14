#!/usr/bin/env python3
"""
Update faculty database with EXACT list from EEMB faculty page
Only these faculty should be in the database - no others
"""

import sqlite3
import json
from datetime import datetime
from pathlib import Path

# EXACT faculty list from https://www.eemb.ucsb.edu/people/faculty
FACULTY_DATA = [
    {
        "name": "Leander Anderegg",
        "title": "Assistant Professor",
        "office": "",
        "research": ["Plant ecophysiology", "community ecology and biogeography", "Ecological responses to climate change"],
        "photo": "leander-anderegg.jpg"
    },
    {
        "name": "Cherie Briggs",
        "title": "Professor",
        "office": "2112 Noble Hall",
        "research": ["Disease Ecology", "Ecology", "Population and Community Ecology"],
        "photo": "CherieBriggs_photo2024_small.jpg"
    },
    {
        "name": "Deron Burkepile",
        "title": "Professor",
        "office": "4312 Marine Science Institute",
        "research": ["Marine ecology", "community ecology", "trophic interactions", "coral reefs"],
        "photo": "deron-burkepile.jpg"
    },
    {
        "name": "Carla D'Antonio",
        "title": "Professor",
        "office": "4002 Bren Hall",
        "research": ["Terrestrial plant community and ecosystem ecology", "controls over vegetation change", "feedbacks", "restoration ecology"],
        "photo": "dantono-final.jpg"
    },
    {
        "name": "Thomas Even",
        "title": "Senior Lecturer",
        "office": "4322 Life Sciences Building",
        "research": ["Population and community ecology", "river ecology", "predator-prey interactions", "science education"],
        "photo": ""
    },
    {
        "name": "Halley Froehlich",
        "title": "Assistant Professor",
        "office": "4007 Bren Hall",
        "research": ["sustainability of seafood and marine ecosystems under climate change"],
        "photo": "halley-froehlich.jpg"
    },
    {
        "name": "Scott Hodges",
        "title": "Professor",
        "office": "4105 Life Sciences Building",
        "research": ["genetic basis of adaptation and speciation", "genomic analyses", "Aquilegia (Columbines)"],
        "photo": ""
    },
    {
        "name": "Gretchen Hofmann",
        "title": "Professor",
        "office": "4310 Marine Science Institute",
        "research": ["Global change biology", "marine physiology"],
        "photo": "hofmann-final.jpg"
    },
    {
        "name": "Débora Iglesias-Rodriguez",
        "title": "Professor",
        "office": "3151 Marine Biotech",
        "research": ["diversity and function in marine phytoplankton", "molecular approaches", "carbon physiology and biogeochemistry"],
        "photo": "debora-iglesias-rodriguez-114.jpg"
    },
    {
        "name": "Anna James",
        "title": "Assistant Teaching Professor",
        "office": "",
        "research": ["How students think and learn in large", "introductory STEM courses", "effects of climate change on marine microbia"],
        "photo": ""
    },
    {
        "name": "Armand Kuris",
        "title": "Professor",
        "office": "2002 Marine Biotech",
        "research": ["parasite ecology", "disease ecology", "food web dynamics", "ecology and evolution of infectious strategies"],
        "photo": "kuris-final.jpg"
    },
    {
        "name": "John Latto",
        "title": "Senior Lecturer",
        "office": "4324 Life Sciences Building",
        "research": ["Population and community ecology", "host-parasitoid interactions"],
        "photo": ""
    },
    {
        "name": "Sally MacIntyre",
        "title": "Professor",
        "office": "4308 Marine Science Institute",
        "research": ["Limnology and Coastal Oceanography", "physical-biological coupling"],
        "photo": ""
    },
    {
        "name": "Jesús Martínez-Gómez",
        "title": "Assistant Professor",
        "office": "",
        "research": ["evolutionary and developmental origin of plant structures"],
        "photo": ""
    },
    {
        "name": "Susan J. Mazer",
        "title": "Professor",
        "office": "4119 Life Sciences Building",
        "research": ["Quantitative evolutionary genetics", "mating system evolution", "adaptation", "pollination ecology", "floral evolution"],
        "photo": ""
    },
    {
        "name": "Douglas McCauley",
        "title": "Professor",
        "office": "2314 Marine Science Institute",
        "research": ["Ecology", "Conservation Science"],
        "photo": "doug-mccauley.jpg"
    },
    {
        "name": "Holly Moeller",
        "title": "Associate Professor",
        "office": "1120 Noble Hall",
        "research": ["mathematics", "experiments", "field observations", "metabolic interactions between species"],
        "photo": "holly-moeller-976.jpg"
    },
    {
        "name": "Nick Nidzieko",
        "title": "Associate Professor",
        "office": "4316 MSRB / 5830 Ellison Hall",
        "research": ["coastal physical oceanographer"],
        "photo": ""
    },
    {
        "name": "Todd Oakley",
        "title": "Professor",
        "office": "4101 Life Sciences Building",
        "research": ["Macroevolution", "phylogenetics", "bioluminescence", "vision", "molecular evolution", "complexity", "marine organismal biology"],
        "photo": ""
    },
    {
        "name": "Ryoko Oono",
        "title": "Associate Professor",
        "office": "1116 Noble Hall",
        "research": ["Plant-microbe evolution and ecology", "microbial species diversity and taxonomy", "evolution of symbiosis"],
        "photo": ""
    },
    {
        "name": "Stephen Proulx",
        "title": "Professor",
        "office": "4109 Life Sciences Building",
        "research": ["Mathematical theory of evolutionary and eco-evolutionary processes"],
        "photo": ""
    },
    {
        "name": "Joel Rothman",
        "title": "Professor",
        "office": "3137 Bio II",
        "research": ["Evolutionary and quantitative genetics of development", "robustness and fidelity of complex systems", "interstellar biology"],
        "photo": ""
    },
    {
        "name": "Alyson Santoro",
        "title": "Professor",
        "office": "2155 Marine Biotech Lab",
        "research": ["Marine microbial ecology", "nitrogen cycling"],
        "photo": "Alyson-Santoro_2.jpg"
    },
    {
        "name": "Joshua Schimel",
        "title": "Professor",
        "office": "1108 Noble Hall",
        "research": ["Soil and ecosystem ecology", "microbial ecology", "nutrient cycling", "soil organic matter"],
        "photo": ""
    },
    {
        "name": "Joel Sharbrough",
        "title": "Assistant Professor",
        "office": "1123 Biological Sciences 2",
        "research": ["Evolutionary genomics", "polyploidy", "mitochondria", "chloroplasts", "respiration", "photosynthesis"],
        "photo": ""
    },
    {
        "name": "Jackie Shay",
        "title": "Assistant Teaching Professor",
        "office": "4320 Life Sciences Building",
        "research": ["Joy-centered pedagogy in biology education", "teacher professional development", "epistemologies in STEM"],
        "photo": ""
    },
    {
        "name": "Adrian Stier",
        "title": "Associate Professor",
        "office": "2108 Noble Hall",
        "research": ["Ocean Resilience", "biodiversity", "assembly", "sustainability of harvested ocean ecosystems"],
        "photo": "Adrian-Stier.jpg"
    },
    {
        "name": "Samuel Sweet",
        "title": "Professor",
        "office": "1124 Noble Hall",
        "research": ["Distributional ecology and systematics of western North American and Australian amphibians and reptiles"],
        "photo": ""
    },
    {
        "name": "Audrey Thellman",
        "title": "Assistant Professor",
        "office": "Noble Hall 1112",
        "research": ["Climate change is fundamentally altering the quantity and quality of freshwaters on the planet"],
        "photo": ""
    },
    {
        "name": "Andrew Thurber",
        "title": "Associate Professor",
        "office": "Noble Hall 2136",
        "research": ["deep-sea and polar communities function"],
        "photo": ""
    },
    {
        "name": "Thomas Turner",
        "title": "Associate Professor",
        "office": "4103 Life Sciences",
        "research": ["genetic basis of behavioral variation", "population genetics and neurobiology in Drosophila"],
        "photo": ""
    },
    {
        "name": "Rebecca Vega Thurber",
        "title": "Professor",
        "office": "MSRB 4326",
        "research": ["microbial and viral ecology of marine and terrestrial species", "marine conservation"],
        "photo": ""
    },
    {
        "name": "Lizzy Wilbanks",
        "title": "Assistant Professor",
        "office": "2128 Noble Hall",
        "research": ["microbial interactions and tightly-coupled biogeochemical cycles", "bacteria and archaea of marine aggregates and biofilms"],
        "photo": ""
    },
    {
        "name": "Soojin Yi",
        "title": "Professor",
        "office": "4107 Life Science Building",
        "research": ["evolutionary biologist using genomic and epigenomic tools to study regulatory evolution"],
        "photo": ""
    },
    {
        "name": "Hillary Young",
        "title": "Professor",
        "office": "2116 Noble Hall",
        "research": ["Community ecology", "conservation biology", "global change biology", "disease ecology", "food-web ecology"],
        "photo": "hillary-young.jpg"
    },
    {
        "name": "Yong Zhou",
        "title": "Assistant Professor",
        "office": "Bio II Room 1121",
        "research": ["ecosystem processes respond to global change", "carbon and nutrient"],
        "photo": ""
    },
]

def create_slug(name):
    """Create a URL-friendly slug from name"""
    return name.lower().replace(' ', '-').replace('.', '').replace('á', 'a').replace('é', 'e')

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
    """Update the database with exact faculty list from EEMB website"""

    # Connect to database
    db_path = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/.tmp/data.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    print("📥 Updating faculty database with EXACT EEMB website faculty list...")
    print(f"Processing {len(FACULTY_DATA)} faculty members...")

    # Clear existing faculty
    cursor.execute("DELETE FROM faculties")
    print("✨ Cleared existing faculty data")

    # Backend public folder for photos
    backend_public = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/public/uploads/faculty'

    success_count = 0
    for faculty in FACULTY_DATA:
        try:
            first_name, last_name = split_name(faculty['name'])
            slug = create_slug(faculty['name'])
            now = datetime.now().isoformat()

            # Set photo URL if available
            photo_url = None
            if faculty.get('photo'):
                photo_url = f"/uploads/faculty/{faculty['photo']}"

            # Create short bio
            short_bio = f"{faculty['title']}."
            if faculty['research']:
                short_bio += f" Research focuses on {faculty['research'][0]}."

            # Insert into database
            cursor.execute("""
                INSERT INTO faculties (
                    first_name, last_name, full_name, slug, title,
                    email, phone, office, bio, short_bio,
                    research_interests, active, department, photo_url,
                    created_at, updated_at, published_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                first_name,
                last_name,
                faculty['name'],
                slug,
                faculty['title'],
                f"{slug}@ucsb.edu",
                "",
                faculty['office'],
                "",
                short_bio,
                json.dumps(faculty['research']) if faculty['research'] else '[]',
                1,
                "Ecology, Evolution, and Marine Biology",
                photo_url,
                now, now, now
            ))

            success_count += 1
            photo_indicator = "📷" if photo_url else "  "
            print(f"  {photo_indicator} Added: {faculty['name']} - {faculty['title']}")

        except Exception as e:
            print(f"  ❌ Error adding {faculty['name']}: {e}")

    # Commit all changes
    conn.commit()

    # Show summary
    cursor.execute("SELECT COUNT(*) FROM faculties")
    total_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM faculties WHERE photo_url IS NOT NULL AND photo_url != ''")
    photo_count = cursor.fetchone()[0]

    print(f"\n✅ Successfully updated database with {success_count} faculty members!")
    print(f"📊 Database now contains {total_count} total faculty")
    print(f"📷 {photo_count} faculty have photos")
    print(f"🌐 Faculty data is available at: http://localhost:1337/api/faculties")

    conn.close()

if __name__ == "__main__":
    update_faculty_database()