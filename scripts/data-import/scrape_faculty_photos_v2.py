#!/usr/bin/env python3
"""
Scrape individual faculty profile pages to get their photos
Version 2: Extract actual URLs from faculty directory page
"""

import requests
from bs4 import BeautifulSoup
import sqlite3
import os
import time
from pathlib import Path
from datetime import datetime
from urllib.parse import urljoin

# Base URL
BASE_URL = "https://www.eemb.ucsb.edu"
FACULTY_DIR_URL = "https://www.eemb.ucsb.edu/people/faculty"

def get_faculty_urls():
    """Get actual faculty profile URLs from the directory page"""

    print("🔍 Fetching faculty directory to get profile URLs...")

    try:
        response = requests.get(FACULTY_DIR_URL, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        faculty_urls = {}

        # Look for faculty profile links
        # They typically have structure like: /people/faculty/lastname
        links = soup.find_all('a', href=True)

        for link in links:
            href = link.get('href')
            if href and '/people/faculty/' in href:
                # Get full URL
                full_url = urljoin(BASE_URL, href)

                # Extract name from link text or nearby text
                name_elem = link.find_parent('div') or link

                # Try to get the faculty name
                # Look for name in various places
                name = None

                # Try link text first
                if link.text and len(link.text.strip()) > 3:
                    name = link.text.strip()

                # Try h3 or h4 in parent
                if not name:
                    parent = link.find_parent(['div', 'article', 'li'])
                    if parent:
                        heading = parent.find(['h3', 'h4', 'h2'])
                        if heading:
                            name = heading.text.strip()

                if name:
                    # Clean up name
                    name = name.split('\n')[0].strip()
                    # Remove titles
                    for title in ['Professor', 'Associate', 'Assistant', 'Senior', 'Lecturer', 'Teaching', 'Emeritus']:
                        name = name.replace(title, '').strip()

                    if len(name) > 3:
                        faculty_urls[name] = full_url

        print(f"  ✅ Found {len(faculty_urls)} faculty profile URLs")

        return faculty_urls

    except Exception as e:
        print(f"  ❌ Error fetching faculty directory: {e}")
        return {}

def download_faculty_photo(faculty_name, url):
    """Download photo from faculty profile page"""

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
            '.node-person img',
            '.view-people img',
            '.views-field-field-person-photo img'
        ]

        for selector in selectors:
            img = soup.select_one(selector)
            if img and img.get('src'):
                photo_url = img.get('src')
                break

        # If no photo found with selectors, try finding first reasonable image
        if not photo_url:
            # Look for images in the main content area
            content_areas = soup.find_all(['article', 'div'], class_=lambda x: x and ('content' in x or 'person' in x))

            for area in content_areas:
                imgs = area.find_all('img')
                for img in imgs:
                    src = img.get('src', '')
                    # Skip icons and small images
                    if src and 'icon' not in src.lower() and 'logo' not in src.lower():
                        photo_url = src
                        break
                if photo_url:
                    break

        if not photo_url:
            print(f"    ⚠️  No photo found on page")
            return None

        # Make URL absolute
        photo_url = urljoin(url, photo_url)

        # Skip placeholder/generic images (but not /sites/default/files which is actual content)
        if 'placeholder' in photo_url.lower() or 'avatar' in photo_url.lower():
            print(f"    ⚠️  Skipping placeholder image")
            return None

        # Skip if it's the generic faculty portrait default
        if 'faculty-portrait-default' in photo_url.lower() or 'generic' in photo_url.lower():
            print(f"    ⚠️  Skipping default faculty portrait")
            return None

        print(f"    ✅ Found photo: {photo_url}")

        # Download the image
        img_response = requests.get(photo_url, timeout=10)
        img_response.raise_for_status()

        # Get file extension
        ext = '.jpg'
        if '.' in photo_url:
            url_parts = photo_url.split('.')
            ext_part = url_parts[-1].split('?')[0]
            if ext_part in ['jpg', 'jpeg', 'png', 'gif', 'webp']:
                ext = '.' + ext_part

        # Save to backend public folder
        backend_dir = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/public/uploads/faculty'
        os.makedirs(backend_dir, exist_ok=True)

        # Create safe filename from faculty name
        safe_name = faculty_name.lower().replace(' ', '-').replace('.', '').replace("'", '')
        filename = f"{safe_name}{ext}"
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

def fuzzy_match_name(db_name, url_names):
    """Try to match database name with URL names"""

    # Exact match
    if db_name in url_names:
        return url_names[db_name]

    # Try last name only
    last_name = db_name.split()[-1]
    for url_name, url in url_names.items():
        if last_name in url_name or url_name in last_name:
            return url

    # Try first + last
    parts = db_name.split()
    if len(parts) >= 2:
        first_last = f"{parts[0]} {parts[-1]}"
        for url_name, url in url_names.items():
            if first_last in url_name or url_name in first_last:
                return url

    return None

def update_faculty_photos():
    """Update all faculty photos from their profile pages"""

    # Get faculty URLs from directory
    faculty_urls = get_faculty_urls()

    if not faculty_urls:
        print("❌ Could not fetch faculty URLs from directory")
        return

    print()

    # Connect to database
    db_path = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/backend/.tmp/data.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all faculty
    cursor.execute("SELECT id, full_name, photo_url FROM faculties ORDER BY full_name")
    faculty = cursor.fetchall()

    print(f"📥 Scraping photos for {len(faculty)} faculty members...")
    print()

    updated_count = 0
    skipped_count = 0
    failed_count = 0

    for faculty_id, full_name, current_photo in faculty:

        # Skip if already has a photo
        if current_photo:
            print(f"  ⏭️  {full_name} - Already has photo")
            skipped_count += 1
            continue

        # Find matching URL
        url = fuzzy_match_name(full_name, faculty_urls)

        if not url:
            print(f"  ⚠️  {full_name} - No matching profile URL found")
            failed_count += 1
            print()
            continue

        # Download photo
        photo_url = download_faculty_photo(full_name, url)

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
