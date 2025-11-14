#!/usr/bin/env python3
"""
Import Faculty Data from Scraped CSV to Strapi
This script takes the scraped faculty data and imports it into Strapi
"""

import requests
import pandas as pd
import json
import sys
import os
from pathlib import Path
import argparse
import time

class FacultyImporter:
    def __init__(self, csv_path, api_url, api_token=None):
        self.csv_path = csv_path
        self.api_url = api_url.rstrip('/')
        self.api_token = api_token
        self.headers = {
            'Content-Type': 'application/json'
        }
        if api_token:
            self.headers['Authorization'] = f'Bearer {api_token}'

        self.success_count = 0
        self.error_count = 0
        self.errors = []

    def load_faculty_data(self):
        """Load and clean faculty data from CSV"""
        print(f"📂 Loading faculty data from {self.csv_path}")

        try:
            df = pd.read_csv(self.csv_path)
            print(f"✅ Loaded {len(df)} faculty records")
            return df
        except FileNotFoundError:
            print(f"❌ File not found: {self.csv_path}")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error loading CSV: {e}")
            sys.exit(1)

    def create_slug(self, first_name, last_name):
        """Create URL-friendly slug from name"""
        name = f"{first_name} {last_name}".lower()
        # Replace spaces and special characters
        slug = name.replace(' ', '-').replace('.', '').replace("'", '')
        return slug

    def prepare_faculty_data(self, row):
        """Prepare faculty data for Strapi API"""
        # Extract names
        name = row.get('name', '').strip()
        name_parts = name.split(' ', 1) if name else ['', '']

        first_name = name_parts[0] if len(name_parts) > 0 else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''

        # Create slug
        slug = self.create_slug(first_name, last_name)

        # Prepare data structure for Strapi
        faculty_data = {
            "data": {
                "firstName": first_name,
                "lastName": last_name,
                "slug": slug,
                "title": row.get('title', '').strip(),
                "email": row.get('email', '').strip(),
                "phone": row.get('phone', '').strip(),
                "office": row.get('office', '').strip(),
                "biography": row.get('bio', '').strip(),
                "researchDescription": row.get('research', '').strip(),
                "labWebsite": row.get('lab_url', '').strip(),
                "personalWebsite": row.get('profile_url', '').strip(),
                "photoUrl": row.get('photo_url', '').strip(),  # We'll handle upload separately
                "isActive": True,
                "showOnWebsite": True
            }
        }

        return faculty_data

    def check_existing(self, slug):
        """Check if faculty member already exists"""
        try:
            response = requests.get(
                f"{self.api_url}/api/faculties?filters[slug][$eq]={slug}",
                headers=self.headers
            )
            if response.status_code == 200:
                data = response.json()
                return len(data.get('data', [])) > 0
            return False
        except:
            return False

    def create_faculty(self, faculty_data):
        """Create faculty member in Strapi"""
        slug = faculty_data['data']['slug']

        # Check if already exists
        if self.check_existing(slug):
            print(f"  ⏭️  Skipping {slug} - already exists")
            return True

        try:
            response = requests.post(
                f"{self.api_url}/api/faculties",
                json=faculty_data,
                headers=self.headers,
                timeout=10
            )

            if response.status_code in [200, 201]:
                print(f"  ✅ Created: {slug}")
                self.success_count += 1
                return True
            else:
                error = f"Status {response.status_code}: {response.text[:100]}"
                print(f"  ❌ Failed: {slug} - {error}")
                self.errors.append((slug, error))
                self.error_count += 1
                return False

        except requests.exceptions.Timeout:
            print(f"  ⏱️  Timeout: {slug}")
            self.errors.append((slug, "Request timeout"))
            self.error_count += 1
            return False
        except Exception as e:
            print(f"  ❌ Error: {slug} - {e}")
            self.errors.append((slug, str(e)))
            self.error_count += 1
            return False

    def import_all(self):
        """Import all faculty members"""
        # Load data
        df = self.load_faculty_data()

        print("\n🚀 Starting faculty import to Strapi")
        print(f"   API URL: {self.api_url}")
        print(f"   Records to import: {len(df)}")
        print("")

        # Test API connection
        print("🔌 Testing API connection...")
        try:
            response = requests.get(f"{self.api_url}/api/faculties", headers=self.headers, timeout=5)
            if response.status_code in [200, 404]:
                print("✅ API connection successful")
            else:
                print(f"⚠️  API returned status {response.status_code}")
        except Exception as e:
            print(f"❌ Cannot connect to API: {e}")
            print("\nMake sure Strapi is running at the specified URL")
            sys.exit(1)

        print("\n📥 Importing faculty members...")

        # Import each faculty member
        for index, row in df.iterrows():
            print(f"\n[{index+1}/{len(df)}] Processing {row.get('name', 'Unknown')}")

            # Prepare data
            faculty_data = self.prepare_faculty_data(row)

            # Create in Strapi
            self.create_faculty(faculty_data)

            # Rate limiting
            time.sleep(0.5)  # Be nice to the API

        # Print summary
        print("\n" + "="*50)
        print("📊 Import Summary")
        print("="*50)
        print(f"✅ Successful imports: {self.success_count}")
        print(f"❌ Failed imports: {self.error_count}")
        print(f"📝 Total processed: {len(df)}")

        if self.errors:
            print("\n⚠️  Errors encountered:")
            for slug, error in self.errors[:10]:  # Show first 10 errors
                print(f"   - {slug}: {error}")
            if len(self.errors) > 10:
                print(f"   ... and {len(self.errors) - 10} more")

        print("\n✅ Import complete!")

        # Save error log
        if self.errors:
            error_file = 'import_errors.json'
            with open(error_file, 'w') as f:
                json.dump(self.errors, f, indent=2)
            print(f"\n📝 Error log saved to {error_file}")

def main():
    parser = argparse.ArgumentParser(description='Import faculty data to Strapi')
    parser.add_argument(
        '--csv',
        default='../../scraping/data/faculty-scraped.csv',
        help='Path to faculty CSV file'
    )
    parser.add_argument(
        '--api',
        default='http://localhost:1337',
        help='Strapi API URL'
    )
    parser.add_argument(
        '--token',
        help='API token for authentication (optional for local dev)'
    )

    args = parser.parse_args()

    # Check if CSV exists
    if not Path(args.csv).exists():
        print(f"❌ CSV file not found: {args.csv}")
        print("\nMake sure scraping has completed and faculty-scraped.csv exists")
        sys.exit(1)

    # Create importer
    importer = FacultyImporter(args.csv, args.api, args.token)

    # Run import
    importer.import_all()

if __name__ == "__main__":
    main()