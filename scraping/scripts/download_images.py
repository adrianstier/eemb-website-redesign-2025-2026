#!/usr/bin/env python3
"""
EEMB Image & Document Downloader
Downloads all images and documents from scraped pages and creates inventory.
"""

import requests
from urllib.parse import urlparse, urljoin
import os
import hashlib
import mimetypes
from pathlib import Path
import pandas as pd
import json
from tqdm import tqdm
import time

class MediaDownloader:
    def __init__(self, base_url="https://eemb.ucsb.edu"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'EEMB-Scraper/1.0 (Content preservation for website redesign)'
        })
        self.image_catalog = []
        self.document_catalog = []
        self.downloaded_hashes = set()  # Avoid duplicate downloads

    def get_file_hash(self, content):
        """Generate hash of file content to detect duplicates"""
        return hashlib.md5(content).hexdigest()

    def get_filename_from_url(self, url):
        """Extract filename from URL"""
        parsed = urlparse(url)
        path = parsed.path
        filename = os.path.basename(path)

        # If no filename, generate one from hash
        if not filename or '.' not in filename:
            url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
            filename = f"file_{url_hash}"

        return filename

    def categorize_file(self, url, content_type):
        """Determine if file is image, document, or other"""
        image_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
        doc_types = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument',
                     'application/vnd.ms-excel', 'application/vnd.ms-powerpoint', 'text/csv']

        if any(img_type in content_type for img_type in image_types):
            return 'image'
        elif any(doc_type in content_type for doc_type in doc_types):
            return 'document'
        else:
            return 'other'

    def download_file(self, url, output_dir, file_type='image'):
        """Download a single file"""
        try:
            response = self.session.get(url, timeout=30, stream=True)
            response.raise_for_status()

            content = response.content
            content_type = response.headers.get('Content-Type', '')

            # Check for duplicates
            file_hash = self.get_file_hash(content)
            if file_hash in self.downloaded_hashes:
                print(f"  ⏭️  Skipping duplicate: {url}")
                return None

            self.downloaded_hashes.add(file_hash)

            # Get filename
            filename = self.get_filename_from_url(url)

            # Ensure proper extension
            if '.' not in filename:
                ext = mimetypes.guess_extension(content_type.split(';')[0])
                if ext:
                    filename += ext

            # Create subdirectory by type
            type_dir = os.path.join(output_dir, file_type + 's')
            os.makedirs(type_dir, exist_ok=True)

            # Full file path
            filepath = os.path.join(type_dir, filename)

            # Handle filename conflicts
            base_name, ext = os.path.splitext(filename)
            counter = 1
            while os.path.exists(filepath):
                filename = f"{base_name}_{counter}{ext}"
                filepath = os.path.join(type_dir, filename)
                counter += 1

            # Write file
            with open(filepath, 'wb') as f:
                f.write(content)

            file_size = len(content)

            # Get dimensions for images
            dimensions = None
            if file_type == 'image':
                try:
                    from PIL import Image
                    from io import BytesIO
                    img = Image.open(BytesIO(content))
                    dimensions = f"{img.width}x{img.height}"
                except Exception:
                    pass

            # Record in catalog
            file_info = {
                'original_url': url,
                'local_path': filepath,
                'filename': filename,
                'file_type': file_type,
                'content_type': content_type,
                'file_size_bytes': file_size,
                'file_size_mb': round(file_size / (1024 * 1024), 2),
                'dimensions': dimensions,
                'hash': file_hash,
                'downloaded_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }

            if file_type == 'image':
                self.image_catalog.append(file_info)
            else:
                self.document_catalog.append(file_info)

            return filepath

        except requests.exceptions.RequestException as e:
            print(f"  ❌ Error downloading {url}: {e}")
            return None

    def download_from_site_map(self, site_map_path='../data/site-map.json', output_dir='../assets'):
        """Download all media from site map"""
        print("📥 Starting media download from site map")

        # Load site map
        if not os.path.exists(site_map_path):
            print(f"❌ Site map not found at {site_map_path}")
            print("  Run crawl_site.py first!")
            return

        with open(site_map_path, 'r') as f:
            site_map = json.load(f)

        print(f"  Found {len(site_map)} pages in site map")

        # Extract all image and document URLs from pages
        urls_to_download = set()

        for page in site_map:
            url = page.get('url', '')

            # Re-fetch page to get media
            try:
                response = self.session.get(url, timeout=10)
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(response.content, 'html.parser')

                # Find all images
                for img in soup.find_all('img', src=True):
                    img_url = urljoin(url, img['src'])
                    urls_to_download.add(('image', img_url))

                # Find all document links
                for link in soup.find_all('a', href=True):
                    href = link['href']
                    # Check if it's a document
                    if any(ext in href.lower() for ext in ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv']):
                        doc_url = urljoin(url, href)
                        urls_to_download.add(('document', doc_url))

            except Exception as e:
                print(f"  Error processing {url}: {e}")
                continue

        print(f"\n📊 Found {len(urls_to_download)} unique media files to download")

        # Download all files
        for file_type, url in tqdm(list(urls_to_download), desc="Downloading"):
            self.download_file(url, output_dir, file_type)
            time.sleep(0.5)  # Rate limit

        print(f"\n✅ Download complete!")

    def download_faculty_photos(self, faculty_data_path='../data/faculty-scraped.json', output_dir='../assets'):
        """Download all faculty photos from scraped faculty data"""
        print("📥 Downloading faculty photos")

        if not os.path.exists(faculty_data_path):
            print(f"❌ Faculty data not found at {faculty_data_path}")
            print("  Run scrape_faculty.py first!")
            return

        with open(faculty_data_path, 'r') as f:
            faculty_data = json.load(f)

        photo_urls = [f.get('photo_url') for f in faculty_data if f.get('photo_url')]
        print(f"  Found {len(photo_urls)} faculty photos to download")

        # Create faculty-specific subdirectory
        faculty_dir = os.path.join(output_dir, 'images', 'faculty')
        os.makedirs(faculty_dir, exist_ok=True)

        for url in tqdm(photo_urls, desc="Faculty photos"):
            self.download_file(url, output_dir, 'image')
            time.sleep(0.5)

        print(f"✅ Faculty photos downloaded to {faculty_dir}")

    def save_catalog(self, output_dir='../data'):
        """Save media catalog to CSV and JSON"""
        os.makedirs(output_dir, exist_ok=True)

        # Save image catalog
        if self.image_catalog:
            df_images = pd.DataFrame(self.image_catalog)
            csv_path = os.path.join(output_dir, 'images-catalog.csv')
            df_images.to_csv(csv_path, index=False)
            print(f"✅ Image catalog saved to {csv_path}")

            json_path = os.path.join(output_dir, 'images-catalog.json')
            with open(json_path, 'w') as f:
                json.dump(self.image_catalog, f, indent=2)

        # Save document catalog
        if self.document_catalog:
            df_docs = pd.DataFrame(self.document_catalog)
            csv_path = os.path.join(output_dir, 'documents-catalog.csv')
            df_docs.to_csv(csv_path, index=False)
            print(f"✅ Document catalog saved to {csv_path}")

            json_path = os.path.join(output_dir, 'documents-catalog.json')
            with open(json_path, 'w') as f:
                json.dump(self.document_catalog, f, indent=2)

        # Print summary
        print("\n📊 Download Statistics:")
        print(f"  Images downloaded: {len(self.image_catalog)}")
        print(f"  Documents downloaded: {len(self.document_catalog)}")
        print(f"  Total size (images): {sum(img['file_size_mb'] for img in self.image_catalog):.2f} MB")
        print(f"  Total size (documents): {sum(doc['file_size_mb'] for doc in self.document_catalog):.2f} MB")

def main():
    """Run the media downloader"""
    downloader = MediaDownloader()

    # Download from site map
    downloader.download_from_site_map()

    # Download faculty photos specifically
    downloader.download_faculty_photos()

    # Save catalog
    downloader.save_catalog()

    print("\n🎉 Done! Check ../data/ for catalogs and ../assets/ for downloads")

if __name__ == "__main__":
    main()
