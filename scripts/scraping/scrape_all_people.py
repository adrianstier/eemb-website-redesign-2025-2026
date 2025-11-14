#!/usr/bin/env python3
"""
Comprehensive scraper for ALL people in EEMB directory
Scrapes: Faculty, Staff, Students, Research Scientists, Adjunct, Emeriti
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from datetime import datetime
from urllib.parse import urljoin

BASE_URL = "https://www.eemb.ucsb.edu"
PEOPLE_URL = "https://www.eemb.ucsb.edu/people"

def clean_text(text):
    """Clean and normalize text"""
    if not text:
        return ""
    return ' '.join(text.strip().split())

def extract_person_details(person_url):
    """Extract detailed information from individual person page"""

    print(f"    Fetching details from: {person_url}")

    try:
        response = requests.get(person_url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        details = {
            'profile_url': person_url,
            'bio': '',
            'research_interests': [],
            'education': [],
            'publications': [],
            'lab_website': '',
            'google_scholar': '',
            'personal_website': '',
            'twitter': '',
            'linkedin': '',
            'orcid': '',
            'courses': []
        }

        # Extract bio
        bio_div = soup.find('div', class_='field-name-body') or soup.find('div', class_='field-type-text-with-summary')
        if bio_div:
            # Remove navigation and other non-bio content
            for unwanted in bio_div.find_all(['nav', 'script', 'style']):
                unwanted.decompose()
            details['bio'] = clean_text(bio_div.get_text())

        # Extract research interests
        research_div = soup.find('div', class_='field-name-field-research-interests')
        if research_div:
            interests = research_div.find_all('a')
            details['research_interests'] = [clean_text(a.get_text()) for a in interests]

        # Extract links from the page
        for link in soup.find_all('a', href=True):
            href = link['href']
            text = clean_text(link.get_text()).lower()

            # Lab/Personal websites
            if 'lab' in text or 'website' in text or 'homepage' in text:
                if href.startswith('http'):
                    details['lab_website'] = href

            # Google Scholar
            if 'scholar.google' in href:
                details['google_scholar'] = href

            # ORCID
            if 'orcid.org' in href:
                details['orcid'] = href.split('/')[-1]

            # Twitter
            if 'twitter.com' in href or 'x.com' in href:
                details['twitter'] = href

            # LinkedIn
            if 'linkedin.com' in href:
                details['linkedin'] = href

        return details

    except Exception as e:
        print(f"    ⚠️  Error fetching details: {e}")
        return {}

def scrape_all_people():
    """Scrape all people from EEMB directory"""

    print("🔍 Fetching EEMB People Directory...")
    print(f"URL: {PEOPLE_URL}")
    print("="*80)

    try:
        response = requests.get(PEOPLE_URL, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        all_people = []

        # Find all person entries in the directory
        # The directory uses views-row class for each person
        person_rows = soup.find_all('div', class_='views-row')

        print(f"Found {len(person_rows)} people in directory\n")

        for idx, row in enumerate(person_rows, 1):
            try:
                person = {}

                # Extract name and profile link
                name_link = row.find('a')
                if name_link:
                    person['full_name'] = clean_text(name_link.get_text())
                    person['profile_url'] = urljoin(BASE_URL, name_link['href'])
                else:
                    continue

                # Extract title/position
                title_div = row.find('div', class_='views-field-field-person-title')
                if title_div:
                    person['title'] = clean_text(title_div.get_text())
                else:
                    person['title'] = ''

                # Extract category (Faculty, Staff, Student, etc.)
                category_div = row.find('div', class_='views-field-field-person-category')
                if category_div:
                    person['category'] = clean_text(category_div.get_text())
                else:
                    # Try to infer from context
                    person['category'] = 'Unknown'

                # Extract email
                email_div = row.find('a', href=re.compile(r'^mailto:'))
                if email_div:
                    person['email'] = email_div['href'].replace('mailto:', '')
                else:
                    person['email'] = ''

                # Extract phone
                phone_div = row.find('div', class_='views-field-field-person-phone')
                if phone_div:
                    person['phone'] = clean_text(phone_div.get_text())
                else:
                    person['phone'] = ''

                # Extract office/location
                office_div = row.find('div', class_='views-field-field-person-office')
                if office_div:
                    person['office'] = clean_text(office_div.get_text())
                else:
                    person['office'] = ''

                # Extract research interests (if shown in listing)
                interests_div = row.find('div', class_='views-field-field-research-interests')
                if interests_div:
                    interests = [clean_text(a.get_text()) for a in interests_div.find_all('a')]
                    person['research_interests'] = interests
                else:
                    person['research_interests'] = []

                # Extract photo URL
                photo_img = row.find('img')
                if photo_img and photo_img.get('src'):
                    photo_url = urljoin(BASE_URL, photo_img['src'])
                    if 'faculty-portrait-default' not in photo_url and 'default' not in photo_url.lower():
                        person['photo_url'] = photo_url
                    else:
                        person['photo_url'] = ''
                else:
                    person['photo_url'] = ''

                print(f"  {idx}. {person['full_name']}")
                print(f"      Title: {person['title']}")
                print(f"      Category: {person.get('category', 'Unknown')}")
                print(f"      Email: {person['email']}")
                print(f"      Phone: {person['phone']}")
                print(f"      Office: {person['office']}")

                # Fetch detailed information from profile page
                if person['profile_url']:
                    details = extract_person_details(person['profile_url'])
                    person.update(details)
                    time.sleep(1)  # Be nice to the server

                all_people.append(person)
                print()

            except Exception as e:
                print(f"  ❌ Error processing person: {e}\n")
                continue

        # Save to JSON
        output_file = '/Users/adrianstiermbp2023/eemb-website-redesign-2025-2026/scraping/data/all-people-scraped.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_people, f, indent=2, ensure_ascii=False)

        print("="*80)
        print(f"✅ Successfully scraped {len(all_people)} people")
        print(f"📁 Data saved to: {output_file}")

        # Summary by category
        categories = {}
        for person in all_people:
            cat = person.get('category', 'Unknown')
            categories[cat] = categories.get(cat, 0) + 1

        print("\n📊 Summary by Category:")
        for cat, count in sorted(categories.items()):
            print(f"  {cat}: {count}")

        return all_people

    except Exception as e:
        print(f"❌ Error: {e}")
        return []

if __name__ == "__main__":
    scrape_all_people()
