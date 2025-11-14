#!/usr/bin/env python3
"""
Enhanced scraper that extracts ALL details from individual profile pages
Based on existing people list, goes through each profile page in detail
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from urllib.parse import urljoin

def clean_text(text):
    """Clean and normalize text"""
    if not text:
        return ""
    return ' '.join(text.strip().split())

def extract_detailed_profile(url, person_name):
    """Extract comprehensive information from a person's profile page"""

    print(f"\n  🔍 {person_name}")
    print(f"     URL: {url}")

    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        details = {
            'full_name': person_name,
            'profile_url': url,
            'title': '',
            'category': '',
            'email': '',
            'phone': '',
            'office': '',
            'bio': '',
            'short_bio': '',
            'research_interests': [],
            'photo_url': '',
            'lab_website': '',
            'personal_website': '',
            'google_scholar': '',
            'orcid': '',
            'twitter': '',
            'linkedin': '',
            'education': [],
            'courses': []
        }

        # Infer category from URL
        if '/faculty/' in url:
            details['category'] = 'Faculty'
        elif '/staff/' in url:
            details['category'] = 'Staff'
        elif '/students/' in url:
            details['category'] = 'Student'
        elif '/emeriti/' in url:
            details['category'] = 'Emeriti'
        elif '/adjunct/' in url:
            details['category'] = 'Adjunct'
        elif '/researchers/' in url:
            details['category'] = 'Researcher'

        # Extract title - look for specific class
        title_div = soup.find('div', class_='field-name-field-person-title')
        if title_div:
            details['title'] = clean_text(title_div.get_text())

        # Extract email - look for mailto links
        for link in soup.find_all('a', href=re.compile(r'^mailto:')):
            email = link['href'].replace('mailto:', '').strip()
            if email and '@' in email:
                details['email'] = email
                break

        # Extract phone - look for phone pattern
        phone_patterns = [
            r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',  # US phone
            r'\d{3}[-.\s]\d{3}[-.\s]\d{4}'
        ]
        page_text = soup.get_text()
        for pattern in phone_patterns:
            match = re.search(pattern, page_text)
            if match:
                details['phone'] = match.group()
                break

        # Extract office/location - multiple possible locations
        office_keywords = ['office:', 'location:', 'room']
        for keyword in office_keywords:
            # Look for text near the keyword
            for element in soup.find_all(text=re.compile(keyword, re.I)):
                parent_text = clean_text(element.parent.get_text())
                # Try to extract office number/building
                office_match = re.search(r'(\d+\s*[A-Za-z\s]+(?:Hall|Building|Lab|Science|MSI|MSRB|Noble|Bren))', parent_text, re.I)
                if office_match:
                    details['office'] = office_match.group(1).strip()
                    break
            if details['office']:
                break

        # Extract photo
        photo_img = soup.find('img', class_='media__image') or soup.find('img', {'typeof': 'foaf:Image'})
        if photo_img and photo_img.get('src'):
            photo_url = urljoin(url, photo_img['src'])
            if 'faculty-portrait-default' not in photo_url and 'default' not in photo_url.split('/')[-1].lower():
                details['photo_url'] = photo_url

        # Extract bio
        bio_div = soup.find('div', class_='field-name-body') or soup.find('div', class_='field-type-text-with-summary')
        if bio_div:
            # Remove unwanted elements
            for unwanted in bio_div.find_all(['nav', 'script', 'style', 'header', 'footer']):
                unwanted.decompose()
            bio_text = clean_text(bio_div.get_text())
            details['bio'] = bio_text
            # Create short bio (first 300 chars)
            details['short_bio'] = bio_text[:300] + '...' if len(bio_text) > 300 else bio_text

        # Extract research interests
        research_div = soup.find('div', class_='field-name-field-research-interests')
        if research_div:
            interests = research_div.find_all('a')
            details['research_interests'] = [clean_text(a.get_text()) for a in interests if clean_text(a.get_text())]

        # Extract all links
        for link in soup.find_all('a', href=True):
            href = link['href']
            text = clean_text(link.get_text()).lower()

            # Lab website
            if ('lab' in text and 'website' in text) or 'lab website' in text or href.endswith('lab.ucsb.edu') or 'lab.' in href:
                if href.startswith('http') and not details['lab_website']:
                    details['lab_website'] = href

            # Personal website/homepage
            elif any(word in text for word in ['homepage', 'website', 'personal site']) and href.startswith('http'):
                if not details['personal_website']:
                    details['personal_website'] = href

            # Google Scholar
            elif 'scholar.google' in href:
                details['google_scholar'] = href

            # ORCID
            elif 'orcid.org' in href:
                orcid_id = href.split('/')[-1]
                if re.match(r'\d{4}-\d{4}-\d{4}-\d{3}[X\d]', orcid_id):
                    details['orcid'] = orcid_id

            # Twitter/X
            elif 'twitter.com' in href or 'x.com' in href:
                if 'eembucsb' not in href:  # Skip department account
                    details['twitter'] = href

            # LinkedIn
            elif 'linkedin.com' in href:
                details['linkedin'] = href

        # Print what we found
        found_fields = []
        if details['email']:
            found_fields.append('email')
        if details['phone']:
            found_fields.append('phone')
        if details['office']:
            found_fields.append('office')
        if details['title']:
            found_fields.append('title')
        if details['bio']:
            found_fields.append('bio')
        if details['research_interests']:
            found_fields.append('research')
        if details['photo_url']:
            found_fields.append('photo')
        if details['google_scholar']:
            found_fields.append('scholar')
        if details['lab_website']:
            found_fields.append('lab')

        print(f"     ✅ Found: {', '.join(found_fields) if found_fields else 'basic info only'}")

        return details

    except Exception as e:
        print(f"     ❌ Error: {e}")
        return {
            'full_name': person_name,
            'profile_url': url,
            'error': str(e)
        }

def enhance_people_data():
    """Load existing people list and enhance with detailed profile data"""

    print("="*80)
    print("ENHANCED PROFILE SCRAPER")
    print("="*80)

    # Load existing people list
    input_file = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/scraping/data/all-people-scraped.json'

    with open(input_file, 'r') as f:
        people = json.load(f)

    print(f"\n📋 Loaded {len(people)} people from existing data")
    print(f"🔄 Now fetching detailed profiles...\n")

    enhanced_people = []

    for idx, person in enumerate(people, 1):
        print(f"[{idx}/{len(people)}]", end="")

        name = person.get('full_name', 'Unknown')
        url = person.get('profile_url')

        if not url:
            print(f"  ⚠️  {name} - No profile URL")
            enhanced_people.append(person)
            continue

        # Extract detailed info
        detailed = extract_detailed_profile(url, name)
        enhanced_people.append(detailed)

        # Be nice to the server
        time.sleep(0.5)

        # Save checkpoint every 20 people
        if idx % 20 == 0:
            checkpoint_file = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/scraping/data/people-detailed-checkpoint.json'
            with open(checkpoint_file, 'w') as f:
                json.dump(enhanced_people, f, indent=2)
            print(f"\n  💾 Checkpoint saved at {idx}/{len(people)}\n")

    # Save final enhanced data
    output_file = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/scraping/data/people-detailed-complete.json'
    with open(output_file, 'w') as f:
        json.dump(enhanced_people, f, indent=2, ensure_ascii=False)

    print("\n" + "="*80)
    print(f"✅ COMPLETE - Enhanced data for {len(enhanced_people)} people")
    print(f"📁 Saved to: {output_file}")
    print("="*80)

    # Generate summary statistics
    stats = {
        'total': len(enhanced_people),
        'with_email': sum(1 for p in enhanced_people if p.get('email')),
        'with_phone': sum(1 for p in enhanced_people if p.get('phone')),
        'with_office': sum(1 for p in enhanced_people if p.get('office')),
        'with_title': sum(1 for p in enhanced_people if p.get('title')),
        'with_bio': sum(1 for p in enhanced_people if p.get('bio')),
        'with_research': sum(1 for p in enhanced_people if p.get('research_interests')),
        'with_photo': sum(1 for p in enhanced_people if p.get('photo_url')),
        'with_scholar': sum(1 for p in enhanced_people if p.get('google_scholar')),
        'with_lab': sum(1 for p in enhanced_people if p.get('lab_website')),
    }

    print("\n📊 Coverage Summary:")
    print("-"*80)
    for field, count in stats.items():
        if field != 'total':
            pct = (count / stats['total']) * 100
            print(f"  {field:20} {count:3}/{stats['total']} ({pct:5.1f}%)")

    return enhanced_people

if __name__ == "__main__":
    enhance_people_data()
