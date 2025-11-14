#!/usr/bin/env python3
"""
EEMB Faculty Directory Scraper
Extracts detailed faculty information including bios, research, photos, and contact info.
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import pandas as pd
import time
import os
from tqdm import tqdm
import json

class FacultyScraper:
    def __init__(self, base_url="https://eemb.ucsb.edu"):
        self.base_url = base_url
        self.faculty_data = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'EEMB-Scraper/1.0 (Content preservation for website redesign)'
        })

    def scrape_faculty_list(self, list_url):
        """Scrape the main faculty directory page to get list of faculty"""
        print(f"Fetching faculty list from {list_url}")

        try:
            response = self.session.get(list_url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')

            faculty_links = []

            # Strategy 1: Look for common faculty list patterns
            # This will need to be adjusted based on actual site structure

            # Pattern A: Links in a faculty list/grid
            for link in soup.find_all('a', href=True):
                href = link['href']
                # Look for faculty profile URLs
                if 'faculty' in href.lower() or 'people' in href.lower():
                    full_url = urljoin(list_url, href)
                    # Avoid duplicates and the list page itself
                    if full_url != list_url and full_url not in faculty_links:
                        faculty_links.append(full_url)

            print(f"  Found {len(faculty_links)} potential faculty profile links")
            return faculty_links

        except requests.exceptions.RequestException as e:
            print(f"  Error fetching faculty list: {e}")
            return []

    def scrape_faculty_profile(self, profile_url):
        """Scrape individual faculty member's profile page"""
        try:
            response = self.session.get(profile_url, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Initialize faculty data structure
            faculty = {
                'profile_url': profile_url,
                'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }

            # Extract title (page title often has name)
            title_tag = soup.find('title')
            faculty['page_title'] = title_tag.text.strip() if title_tag else ''

            # Try to extract name from h1, h2, or title
            name_tag = soup.find('h1') or soup.find('h2', class_=lambda x: x and 'name' in x.lower())
            faculty['name'] = name_tag.text.strip() if name_tag else ''

            # Extract email (look for mailto: links)
            email_link = soup.find('a', href=lambda x: x and 'mailto:' in x)
            if email_link:
                faculty['email'] = email_link['href'].replace('mailto:', '').strip()
            else:
                faculty['email'] = ''

            # Extract phone number (look for tel: links or phone patterns)
            phone_link = soup.find('a', href=lambda x: x and 'tel:' in x)
            if phone_link:
                faculty['phone'] = phone_link.text.strip()
            else:
                # Try to find phone in text
                import re
                phone_pattern = re.compile(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
                phone_match = phone_pattern.search(soup.get_text())
                faculty['phone'] = phone_match.group(0) if phone_match else ''

            # Extract office location
            # Look for common patterns like "Office:", "Location:", building names
            office_patterns = ['office', 'location', 'room', 'building']
            faculty['office'] = ''
            for tag in soup.find_all(['p', 'div', 'span']):
                text = tag.text.lower()
                if any(pattern in text for pattern in office_patterns):
                    faculty['office'] = tag.text.strip()
                    break

            # Extract title/position
            title_patterns = ['professor', 'lecturer', 'instructor', 'researcher']
            faculty['title'] = ''
            for tag in soup.find_all(['p', 'div', 'span', 'h2', 'h3']):
                text = tag.text.lower()
                if any(pattern in text for pattern in title_patterns):
                    faculty['title'] = tag.text.strip()
                    break

            # Extract bio/about section
            bio_headings = ['bio', 'about', 'biography', 'background', 'overview']
            faculty['bio'] = ''
            for heading in soup.find_all(['h2', 'h3', 'h4']):
                if any(bio_word in heading.text.lower() for bio_word in bio_headings):
                    # Get all text in siblings until next heading
                    bio_parts = []
                    for sibling in heading.find_next_siblings():
                        if sibling.name in ['h2', 'h3', 'h4']:
                            break
                        bio_parts.append(sibling.get_text(strip=True))
                    faculty['bio'] = ' '.join(bio_parts)
                    break

            # If no bio found with headings, try to get main content
            if not faculty['bio']:
                main_content = soup.find('main') or soup.find('article') or soup.find('div', class_=lambda x: x and 'content' in x.lower())
                if main_content:
                    faculty['bio'] = main_content.get_text(separator=' ', strip=True)[:1000]  # Limit length

            # Extract research description
            research_headings = ['research', 'research interests', 'research areas']
            faculty['research'] = ''
            for heading in soup.find_all(['h2', 'h3', 'h4']):
                if any(research_word in heading.text.lower() for research_word in research_headings):
                    research_parts = []
                    for sibling in heading.find_next_siblings():
                        if sibling.name in ['h2', 'h3', 'h4']:
                            break
                        research_parts.append(sibling.get_text(strip=True))
                    faculty['research'] = ' '.join(research_parts)
                    break

            # Extract lab website URL
            lab_patterns = ['lab', 'website', 'personal', 'homepage']
            faculty['lab_url'] = ''
            for link in soup.find_all('a', href=True):
                link_text = link.text.lower()
                if any(pattern in link_text for pattern in lab_patterns):
                    faculty['lab_url'] = urljoin(profile_url, link['href'])
                    break

            # Extract photo/image URL
            faculty['photo_url'] = ''
            # Look for profile images (usually in header or sidebar)
            img_classes = ['profile', 'headshot', 'photo', 'avatar', 'faculty']
            for img in soup.find_all('img'):
                img_class = ' '.join(img.get('class', [])).lower()
                img_alt = img.get('alt', '').lower()
                if any(pattern in img_class or pattern in img_alt for pattern in img_classes):
                    faculty['photo_url'] = urljoin(profile_url, img['src'])
                    break

            # If no specific profile image, get first substantial image
            if not faculty['photo_url']:
                for img in soup.find_all('img'):
                    src = img.get('src', '')
                    if src and not any(skip in src.lower() for skip in ['logo', 'icon', 'button']):
                        faculty['photo_url'] = urljoin(profile_url, src)
                        break

            # Extract research areas/keywords (often as tags or categories)
            faculty['research_areas'] = []
            for tag in soup.find_all(['span', 'a'], class_=lambda x: x and ('tag' in x.lower() or 'category' in x.lower() or 'keyword' in x.lower())):
                faculty['research_areas'].append(tag.text.strip())

            faculty['research_areas_str'] = ', '.join(faculty['research_areas'])

            return faculty

        except requests.exceptions.RequestException as e:
            print(f"  Error scraping {profile_url}: {e}")
            return {
                'profile_url': profile_url,
                'error': str(e),
                'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }

    def scrape_all_faculty(self, list_url="https://eemb.ucsb.edu/people/faculty"):
        """Scrape all faculty from directory"""
        print("🔍 Starting faculty directory scrape")

        # Get list of faculty profile URLs
        faculty_urls = self.scrape_faculty_list(list_url)

        if not faculty_urls:
            print("⚠️  No faculty URLs found. Check the list URL or site structure.")
            return

        print(f"\n📋 Found {len(faculty_urls)} faculty profiles to scrape")

        # Scrape each faculty profile
        for i, url in enumerate(tqdm(faculty_urls, desc="Scraping faculty")):
            print(f"\n  [{i+1}/{len(faculty_urls)}] {url}")
            faculty = self.scrape_faculty_profile(url)
            self.faculty_data.append(faculty)

            # Be polite - rate limit
            time.sleep(1)

        print(f"\n✅ Faculty scraping complete! Scraped {len(self.faculty_data)} profiles")

    def save_results(self, output_dir='../data'):
        """Save faculty data to CSV and JSON"""
        os.makedirs(output_dir, exist_ok=True)

        # Save as CSV
        df = pd.DataFrame(self.faculty_data)
        csv_path = os.path.join(output_dir, 'faculty-scraped.csv')
        df.to_csv(csv_path, index=False)
        print(f"✅ Faculty data saved to {csv_path}")

        # Save as JSON (preserves more detail)
        json_path = os.path.join(output_dir, 'faculty-scraped.json')
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(self.faculty_data, f, indent=2, ensure_ascii=False)
        print(f"✅ Faculty data saved to {json_path}")

        # Print summary
        print("\n📊 Faculty Scraping Statistics:")
        print(f"  Total faculty scraped: {len(self.faculty_data)}")
        print(f"  With emails: {len([f for f in self.faculty_data if f.get('email')])}")
        print(f"  With photos: {len([f for f in self.faculty_data if f.get('photo_url')])}")
        print(f"  With bios: {len([f for f in self.faculty_data if f.get('bio')])}")
        print(f"  With research descriptions: {len([f for f in self.faculty_data if f.get('research')])}")

        return df

def main():
    """Run the faculty scraper"""
    scraper = FacultyScraper()

    # Adjust this URL to match the actual faculty directory page
    faculty_list_url = "https://eemb.ucsb.edu/people/faculty"

    scraper.scrape_all_faculty(faculty_list_url)
    scraper.save_results()

    print("\n🎉 Done! Check ../data/faculty-scraped.csv for results")

if __name__ == "__main__":
    main()
