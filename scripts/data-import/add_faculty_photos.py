#!/usr/bin/env python3
"""
Add faculty photos to the database
"""

import sqlite3
import json
import shutil
import os
from datetime import datetime
from pathlib import Path

# Map of faculty names to their photo files
FACULTY_PHOTOS = {
    "Cherie Briggs": "CherieBriggs_photo2024_small.jpg",
    "Adrian Stier": "Adrian-Stier.jpg",
    "Alyson Santoro": "Alyson-Santoro_2.jpg",
    "Erika Eliason": "Erika-Eliason-1421.jpg",
    "Holly Moeller": "holly-moeller-976.jpg",
    "Hillary Young": "hillary-young.jpg",
    "Douglas McCauley": "doug-mccauley.jpg",
    "Ben Halpern": "ben-halpern.jpg",
    "Debora Iglesias-Rodriguez": "debora-iglesias-rodriguez-114.jpg",
    "Craig Carlson": "craig-carlson.jpg",
    "Gretchen Hofmann": "gretchen-hofmann.jpg",
    "An Bui": "an-bui-final.jpg",
    "Halley Froehlich": "halley-froehlich.jpg",
    "Mark Brzezinski": "mark-brzezinski.jpg",
}

# Load the scraped faculty data to get photo URLs from EEMB website
def load_scraped_photos():
    scraped_file = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/scraping/data/faculty-scraped.json'

    photo_map = {}

    try:
        with open(scraped_file, 'r') as f:
            scraped_data = json.load(f)

        for record in scraped_data:
            # Try to extract name and photo URL
            if 'title' in record:
                # Extract name from title (usually format: "Name Title")
                title_parts = record['title'].strip().split('\n')[0] if '\n' in record['title'] else record['title']

                # Look for photo URL in the record
                if 'photo_url' in record and record['photo_url']:
                    # Extract name (first part before title keywords)
                    name_parts = title_parts.split()
                    if len(name_parts) >= 2:
                        # Try to find where the title starts (Professor, Lecturer, etc.)
                        title_keywords = ['Professor', 'Lecturer', 'Research', 'Emeritus', 'Assistant', 'Associate', 'Senior']
                        name_end_idx = len(name_parts)
                        for i, part in enumerate(name_parts):
                            if part in title_keywords:
                                name_end_idx = i
                                break

                        if name_end_idx >= 2:
                            name = ' '.join(name_parts[:name_end_idx])
                            photo_map[name] = record['photo_url']

    except Exception as e:
        print(f"Error loading scraped photos: {e}")

    return photo_map

def update_faculty_photos():
    """Update the database with faculty photo URLs"""

    # Get scraped photo URLs
    scraped_photos = load_scraped_photos()
    print(f"Found {len(scraped_photos)} photo URLs from scraped data")

    # Connect to database
    db_path = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/.tmp/data.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # First, add photo_url column if it doesn't exist
    cursor.execute("PRAGMA table_info(faculties)")
    columns = [col[1] for col in cursor.fetchall()]

    if 'photo_url' not in columns:
        print("Adding photo_url column to faculties table...")
        cursor.execute("ALTER TABLE faculties ADD COLUMN photo_url TEXT")
        conn.commit()

    # Copy local images to backend public folder
    backend_public = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/public/uploads/faculty'
    os.makedirs(backend_public, exist_ok=True)

    # Update faculty records with photo URLs
    cursor.execute("SELECT id, full_name FROM faculties")
    faculty_records = cursor.fetchall()

    updated_count = 0

    for faculty_id, full_name in faculty_records:
        photo_url = None

        # First check if we have a local image file
        if full_name in FACULTY_PHOTOS:
            local_file = f"/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/scraping/assets/images/{FACULTY_PHOTOS[full_name]}"
            if os.path.exists(local_file):
                # Copy to backend public folder
                dest_file = f"{backend_public}/{FACULTY_PHOTOS[full_name]}"
                shutil.copy2(local_file, dest_file)
                photo_url = f"/uploads/faculty/{FACULTY_PHOTOS[full_name]}"
                print(f"  📷 Added local photo for {full_name}")

        # If no local photo, check scraped URLs
        if not photo_url and full_name in scraped_photos:
            photo_url = scraped_photos[full_name]
            print(f"  🌐 Using scraped URL for {full_name}")

        # Update database if we have a photo
        if photo_url:
            cursor.execute("""
                UPDATE faculties
                SET photo_url = ?, updated_at = ?
                WHERE id = ?
            """, (photo_url, datetime.now().isoformat(), faculty_id))
            updated_count += 1

    conn.commit()

    # Also check for any additional scraped photos we might have missed
    print("\n📋 Checking for additional photo matches...")

    # Get all image files
    images_dir = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/scraping/assets/images/'

    # Map some specific cases
    additional_mappings = {
        "jennifer-caselle.jpg": "Jennifer Caselle",
        "allice-alldredge_0.jpg": "Alice Alldredge",
        "an-bui.jpg": "An Bui",
        "deron-burkepile.jpg": "Deron Burkepile",
        "carlson.jpg": "Craig Carlson",
        "childress-final.jpg": "James Childress",
        "dantono-final.jpg": "Carla D'Antonio",
        "gaines.jpg": "Steven Gaines",
        "hofmann-final.jpg": "Gretchen Hofmann",
        "holbrook-final.jpg": "Sally Holbrook",
        "kuris-final.jpg": "Armand Kuris",
        "lafferty-final.jpg": "Kevin Lafferty",
        "melack-final.jpg": "John Melack",
    }

    for img_file, faculty_name in additional_mappings.items():
        src_path = os.path.join(images_dir, img_file)
        if os.path.exists(src_path):
            # Check if this faculty exists
            cursor.execute("SELECT id FROM faculties WHERE full_name = ?", (faculty_name,))
            result = cursor.fetchone()

            if result:
                faculty_id = result[0]

                # Copy image to backend
                dest_file = f"{backend_public}/{img_file}"
                shutil.copy2(src_path, dest_file)

                # Update database
                photo_url = f"/uploads/faculty/{img_file}"
                cursor.execute("""
                    UPDATE faculties
                    SET photo_url = ?, updated_at = ?
                    WHERE id = ?
                """, (photo_url, datetime.now().isoformat(), faculty_id))

                updated_count += 1
                print(f"  📷 Added photo for {faculty_name}")

    conn.commit()
    conn.close()

    print(f"\n✅ Successfully updated {updated_count} faculty records with photos!")
    print(f"📁 Photos copied to: {backend_public}")
    print(f"🌐 Photos will be available at: http://localhost:1337/uploads/faculty/")

if __name__ == "__main__":
    update_faculty_photos()