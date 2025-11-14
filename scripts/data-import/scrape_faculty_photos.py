#!/usr/bin/env python3
"""
Scrape individual faculty profile pages to get their photos
"""

import requests
from bs4 import BeautifulSoup
import sqlite3
import os
import time
from pathlib import Path
from datetime import datetime
from urllib.parse import urljoin

# Base URL for faculty pages
BASE_URL = "https://www.eemb.ucsb.edu/people/faculty/"

def create_slug(name):
    """Create URL slug from faculty name"""
    # Handle special characters
    slug = name.lower()
    slug = slug.replace('á', 'a').replace('é', 'e').replace('í', 'i')
    slug = slug.replace('ó', 'o').replace('ú', 'u').replace('ü', 'u')
    slug = slug.replace(' ', '-').replace('.', '').replace("'", '')

    # Special cases
    special_cases = {
        'débora-iglesias-rodriguez': 'iglesias-rodriguez',
        'jesús-martínez-gómez': 'martinez-gomez',
        'susan-j-mazer': 'mazer',
        'samuel-sweet': 'sweet',
    }

    if slug in special_cases:
        return special_cases[slug]

    return slug

def download_faculty_photo(faculty_name, slug):
    """Download photo from faculty profile page"""

    # Construct URL
    url = f"{BASE_URL}{slug}"

    print(f"  🔍 Checking {faculty_name} at {url}")

    try:
        # Fetch the page
        response = requests.get(url, timeout=10)

        if response.status_code == 404:
            print(f"    ⚠️  Page not found (404)")
            return None

        response.raise_for_status()

        # Parse HTML
        soup = BeautifulSoup(response.content, 'html.parser')

        # Look for faculty photo - try multiple selectors
        photo_url = None

        # Try different common image selectors
        selectors = [
            'img.field-content',
            'img[typeof="foaf:Image"]',
            '.field-name-field-person-photo img',
            '.person-photo img',
            'article img',
            '.node-person img'
        ]

        for selector in selectors:
            img = soup.select_one(selector)
            if img and img.get('src'):
                photo_url = img.get('src')
                break

        # If no photo found with selectors, try finding any image in main content
        if not photo_url:
            # Look for images in the main content area
            content_div = soup.find('div', class_='content') or soup.find('article')
            if content_div:
                img = content_div.find('img')
                if img and img.get('src'):
                    photo_url = img.get('src')

        if not photo_url:
            print(f"    ⚠️  No photo found on page")
            return None

        # Make URL absolute
        photo_url = urljoin(url, photo_url)

        # Skip default/placeholder images
        if 'default' in photo_url.lower() or 'placeholder' in photo_url.lower():
            print(f"    ⚠️  Skipping default/placeholder image")
            return None

        print(f"    ✅ Found photo: {photo_url}")

        # Download the image
        img_response = requests.get(photo_url, timeout=10)
        img_response.raise_for_status()

        # Get file extension
        ext = '.jpg'
        if '.' in photo_url:
            ext = '.' + photo_url.split('.')[-1].split('?')[0]

        # Save to backend public folder
        backend_dir = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/public/uploads/faculty'
        os.makedirs(backend_dir, exist_ok=True)

        filename = f"{slug}{ext}"
        filepath = os.path.join(backend_dir, filename)

        with open(filepath, 'wb') as f:
            f.write(img_response.content)

        print(f"    💾 Saved as {filename}")

        return f"/uploads/faculty/{filename}"

    except requests.exceptions.RequestException as e:
        print(f"    ❌ Error: {e}")
        return None
    except Exception as e:
        print(f"    ❌ Unexpected error: {e}")
        return None

def update_faculty_photos():
    """Update all faculty photos from their profile pages"""

    # Connect to database
    db_path = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/.tmp/data.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all faculty
    cursor.execute("SELECT id, full_name, slug, photo_url FROM faculties ORDER BY full_name")
    faculty = cursor.fetchall()

    print(f"📥 Scraping photos for {len(faculty)} faculty members...")
    print()

    updated_count = 0
    skipped_count = 0
    failed_count = 0

    for faculty_id, full_name, slug, current_photo in faculty:

        # Skip if already has a photo
        if current_photo:
            print(f"  ⏭️  {full_name} - Already has photo")
            skipped_count += 1
            continue

        # Download photo
        photo_url = download_faculty_photo(full_name, slug)

        if photo_url:
            # Update database
            cursor.execute("""
                UPDATE faculties
                SET photo_url = ?, updated_at = ?
                WHERE id = ?
            """, (photo_url, datetime.now().isoformat(), faculty_id))

            updated_count += 1
        else:
            failed_count += 1

        # Be nice to the server
        time.sleep(1)

        print()

    # Commit changes
    conn.commit()

    # Summary
    print("\n" + "="*60)
    print(f"✅ Successfully downloaded {updated_count} new photos")
    print(f"⏭️  Skipped {skipped_count} faculty (already had photos)")
    print(f"❌ Failed to find photos for {failed_count} faculty")
    print(f"📊 Total faculty with photos: {updated_count + skipped_count}")
    print("="*60)

    # Show faculty still missing photos
    cursor.execute("SELECT full_name FROM faculties WHERE photo_url IS NULL OR photo_url = ''")
    missing = cursor.fetchall()

    if missing:
        print(f"\n⚠️  Faculty still missing photos ({len(missing)}):")
        for (name,) in missing:
            print(f"   - {name}")
    else:
        print("\n🎉 All faculty now have photos!")

    conn.close()

if __name__ == "__main__":
    update_faculty_photos()
