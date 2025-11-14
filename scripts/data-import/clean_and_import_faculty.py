#!/usr/bin/env python3
"""
Clean and Import Faculty Data from Scraped JSON to Strapi
This script processes the scraped faculty data and imports clean records into Strapi
"""

import requests
import json
import sys
import time
import re
from pathlib import Path

class FacultyProcessor:
    def __init__(self, json_path, api_url):
        self.json_path = json_path
        self.api_url = api_url.rstrip('/')
        self.headers = {'Content-Type': 'application/json'}
        self.success_count = 0
        self.error_count = 0
        self.errors = []

    def load_faculty_data(self):
        """Load faculty data from JSON"""
        print(f"📂 Loading faculty data from {self.json_path}")
        try:
            with open(self.json_path, 'r') as f:
                data = json.load(f)
            print(f"✅ Loaded {len(data)} records")
            return data
        except FileNotFoundError:
            print(f"❌ File not found: {self.json_path}")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error loading JSON: {e}")
            sys.exit(1)

    def extract_clean_name(self, record):
        """Extract clean name from faculty record"""
        # Try to get name from title if it exists
        title = record.get('title', '')

        # Look for pattern like "FirstName LastName" at the beginning of title
        name_match = re.search(r'^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)', title)
        if name_match:
            return name_match.group(1).strip()

        # Try to extract from the URL
        url = record.get('profile_url', '')
        if '/people/faculty/' in url:
            slug = url.split('/people/faculty/')[-1].strip('/')
            # Convert slug to name (e.g., "iglesias-rodriguez" -> "Iglesias Rodriguez")
            name = ' '.join(word.capitalize() for word in slug.split('-'))
            return name

        # Fallback to the name field if it's not "People"
        name = record.get('name', '')
        if name and name != 'People':
            return name

        return None

    def extract_faculty_info(self, record):
        """Extract structured faculty information from a record"""
        # Only process individual faculty pages
        url = record.get('profile_url', '')
        if '/people/faculty/' not in url:
            return None

        # Extract clean name
        full_name = self.extract_clean_name(record)
        if not full_name:
            return None

        # Split name
        name_parts = full_name.split(' ', 1)
        first_name = name_parts[0] if len(name_parts) > 0 else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Extract slug from URL
        slug = url.split('/people/faculty/')[-1].strip('/')

        # Extract email (look for @ucsb.edu or @lifesci.ucsb.edu)
        email_match = re.search(r'[\w\.-]+@(?:lifesci\.)?ucsb\.edu', record.get('email', ''))
        email = email_match.group(0) if email_match else ''

        # Extract phone (look for pattern like 805.893.xxxx) and format it
        phone_match = re.search(r'805[\.\-]893[\.\-](\d{4})', record.get('phone', ''))
        phone = f'(805) 893-{phone_match.group(1)}' if phone_match else ''

        # Extract office location (look for building names and room numbers)
        office_text = record.get('office', '')
        office_match = re.search(r'(\d+\s+(?:Noble Hall|Life Sciences|Marine|Bio|Bren)[\w\s]*)', office_text)
        office = office_match.group(1) if office_match else ''

        # Extract title from bio or title field
        bio_text = record.get('bio', '')
        title_match = re.search(r'((?:Assistant |Associate |Research |Distinguished )?Professor(?:\s+Emeritus)?|Lecturer|Teaching Professor)', bio_text)
        if title_match:
            raw_title = title_match.group(1)
            # Map to exact enum values
            if 'Distinguished' in raw_title:
                title = 'Distinguished Professor'
            elif 'Emeritus' in raw_title:
                title = 'Professor Emeritus'
            elif 'Assistant' in raw_title:
                title = 'Assistant Professor'
            elif 'Associate' in raw_title:
                title = 'Associate Professor'
            elif 'Research' in raw_title:
                title = 'Research Professor'
            elif 'Teaching' in raw_title:
                title = 'Teaching Professor'
            elif 'Lecturer' in raw_title:
                title = 'Lecturer'
            else:
                title = 'Professor'
        else:
            title = 'Professor'  # Default

        # Extract research areas
        research_areas = record.get('research_areas', [])
        if not research_areas:
            # Try to extract from research_areas_str
            areas_str = record.get('research_areas_str', '')
            if areas_str:
                research_areas = [area.strip() for area in areas_str.split(',') if area.strip()]

        # Clean up bio - remove navigation text
        bio_clean = bio_text
        if bio_clean:
            # Remove common navigation/header text
            bio_clean = re.sub(r'Toggle navigation.*?Apply', '', bio_clean, flags=re.DOTALL)
            bio_clean = re.sub(r'People Primary tabs.*?Apply', '', bio_clean, flags=re.DOTALL)
            bio_clean = bio_clean.strip()

        # Generate a default email if none found (required field)
        if not email:
            # Use first initial + last name as a fallback
            email = f"{first_name[0].lower()}{last_name.lower().replace(' ', '')}@ucsb.edu" if first_name and last_name else f"{slug}@ucsb.edu"

        return {
            'firstName': first_name,
            'lastName': last_name,
            'fullName': full_name,
            'slug': slug,
            'title': title,
            'email': email,
            'phone': phone if phone else None,  # Optional field
            'office': office if office else None,  # Optional field
            'bio': bio_clean[:5000] if bio_clean else '',  # Using bio field
            'shortBio': bio_clean[:500] if bio_clean else '',  # Short version for lists
            'researchInterests': research_areas[:5] if research_areas else [],  # JSON array
            'active': True,
            'department': 'EEMB'  # Default to EEMB
        }

    def check_existing(self, slug):
        """Check if faculty member already exists in Strapi"""
        try:
            response = requests.get(
                f"{self.api_url}/api/faculties?filters[slug][$eq]={slug}",
                headers=self.headers,
                timeout=5
            )
            if response.status_code == 200:
                data = response.json()
                return len(data.get('data', [])) > 0
            return False
        except:
            return False

    def create_faculty(self, faculty_data):
        """Create faculty member in Strapi"""
        slug = faculty_data['slug']

        # Check if already exists
        if self.check_existing(slug):
            print(f"  ⏭️  Skipping {faculty_data['fullName']} - already exists")
            return True

        # Prepare for Strapi API
        strapi_data = {"data": faculty_data}

        try:
            response = requests.post(
                f"{self.api_url}/api/faculties",
                json=strapi_data,
                headers=self.headers,
                timeout=10
            )

            if response.status_code in [200, 201]:
                print(f"  ✅ Created: {faculty_data['fullName']}")
                self.success_count += 1
                return True
            else:
                error = f"Status {response.status_code}: {response.text[:100]}"
                print(f"  ❌ Failed: {faculty_data['fullName']} - {error}")
                self.errors.append((faculty_data['fullName'], error))
                self.error_count += 1
                return False

        except Exception as e:
            print(f"  ❌ Error: {faculty_data['fullName']} - {e}")
            self.errors.append((faculty_data['fullName'], str(e)))
            self.error_count += 1
            return False

    def import_all(self):
        """Process and import all faculty members"""
        # Load data
        raw_data = self.load_faculty_data()

        # Extract faculty records
        print("\n🔍 Processing faculty records...")
        faculty_list = []
        for record in raw_data:
            faculty_info = self.extract_faculty_info(record)
            if faculty_info:
                faculty_list.append(faculty_info)

        print(f"✅ Extracted {len(faculty_list)} faculty members from {len(raw_data)} records")

        # Test API connection
        print("\n🔌 Testing Strapi API connection...")
        try:
            response = requests.get(f"{self.api_url}/api/faculties", headers=self.headers, timeout=5)
            if response.status_code in [200, 404]:
                print("✅ API connection successful")
            else:
                print(f"⚠️  API returned status {response.status_code}")
        except Exception as e:
            print(f"❌ Cannot connect to API: {e}")
            print("\nMake sure Strapi is running at http://localhost:1337")
            sys.exit(1)

        print("\n📥 Importing faculty members to Strapi...")

        # Import each faculty member
        for i, faculty in enumerate(faculty_list, 1):
            print(f"\n[{i}/{len(faculty_list)}] Processing {faculty['fullName']}")
            self.create_faculty(faculty)
            time.sleep(0.3)  # Rate limiting

        # Print summary
        print("\n" + "="*50)
        print("📊 Import Summary")
        print("="*50)
        print(f"✅ Successful imports: {self.success_count}")
        print(f"❌ Failed imports: {self.error_count}")
        print(f"📝 Total faculty found: {len(faculty_list)}")

        if self.errors:
            print("\n⚠️  Errors encountered:")
            for name, error in self.errors[:5]:
                print(f"   - {name}: {error}")
            if len(self.errors) > 5:
                print(f"   ... and {len(self.errors) - 5} more")

        print("\n✅ Import complete!")

        # Save processed faculty list for reference
        output_file = 'processed_faculty.json'
        with open(output_file, 'w') as f:
            json.dump(faculty_list, f, indent=2)
        print(f"\n📝 Processed faculty data saved to {output_file}")

def main():
    json_path = '../../scraping/data/faculty-scraped.json'
    api_url = 'http://localhost:1337'

    # Check if JSON exists
    if not Path(json_path).exists():
        print(f"❌ JSON file not found: {json_path}")
        print("\nMake sure scraping has completed and faculty-scraped.json exists")
        sys.exit(1)

    # Create processor
    processor = FacultyProcessor(json_path, api_url)

    # Run import
    processor.import_all()

if __name__ == "__main__":
    main()