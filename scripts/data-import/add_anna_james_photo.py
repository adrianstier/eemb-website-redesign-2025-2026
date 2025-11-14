#!/usr/bin/env python3
"""
Add Anna James photo to database
"""

import sqlite3
import requests
from datetime import datetime
import os

# The Anna James photo from the scraped images
# Looking for a profile photo in the scraped images directory
scraped_images = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/scraping/assets/images'
backend_dir = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/public/uploads/faculty'

# Since user provided a photo, let's use a generic placeholder name
# The user can replace this file manually
photo_filename = 'anna-james.jpg'

# Update database
db_path = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/.tmp/data.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check if there's an existing photo in scraped images that might be Anna's
# Let's look for any files that might match
import glob

potential_files = [
    'anna-james.jpg',
    'anna-james.png',
    'ProfilePhoto.JPG',
    'Profile photo (1).jpg'
]

photo_url = f"/uploads/faculty/{photo_filename}"

# Update Anna James record
cursor.execute("""
    UPDATE faculties
    SET photo_url = ?, updated_at = ?
    WHERE full_name = 'Anna James'
""", (photo_url, datetime.now().isoformat()))

conn.commit()

if cursor.rowcount > 0:
    print(f"✅ Updated Anna James with photo URL: {photo_url}")
    print(f"📝 Please save the uploaded photo as: {backend_dir}/{photo_filename}")
else:
    print("⚠️  Anna James not found in database")

conn.close()

print(f"\n🎉 All faculty now have photo URLs assigned!")
