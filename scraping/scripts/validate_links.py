#!/usr/bin/env python3
"""
EEMB Link Validator
Validates all internal and external links found during scraping.
Identifies broken links, redirects, and slow responses.
"""

import requests
import pandas as pd
import json
import os
from urllib.parse import urlparse
from tqdm import tqdm
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

class LinkValidator:
    def __init__(self, timeout=10, max_workers=5):
        self.timeout = timeout
        self.max_workers = max_workers
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'EEMB-Scraper/1.0 (Link validation for website redesign)'
        })
        self.results = []

    def validate_url(self, url, source_page=''):
        """Validate a single URL"""
        try:
            start_time = time.time()
            response = self.session.head(url, timeout=self.timeout, allow_redirects=True)
            response_time = time.time() - start_time

            result = {
                'url': url,
                'source_page': source_page,
                'status_code': response.status_code,
                'status': self.categorize_status(response.status_code),
                'response_time_ms': round(response_time * 1000, 2),
                'final_url': response.url,
                'is_redirect': response.url != url,
                'content_type': response.headers.get('Content-Type', ''),
                'error': None,
                'checked_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }

        except requests.exceptions.Timeout:
            result = {
                'url': url,
                'source_page': source_page,
                'status_code': 'timeout',
                'status': 'timeout',
                'response_time_ms': self.timeout * 1000,
                'error': 'Request timeout',
                'checked_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }

        except requests.exceptions.ConnectionError:
            result = {
                'url': url,
                'source_page': source_page,
                'status_code': 'connection_error',
                'status': 'error',
                'error': 'Connection failed',
                'checked_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }

        except requests.exceptions.RequestException as e:
            result = {
                'url': url,
                'source_page': source_page,
                'status_code': 'error',
                'status': 'error',
                'error': str(e),
                'checked_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }

        return result

    def categorize_status(self, status_code):
        """Categorize HTTP status code"""
        if isinstance(status_code, int):
            if status_code == 200:
                return 'ok'
            elif 200 <= status_code < 300:
                return 'ok_other'
            elif 300 <= status_code < 400:
                return 'redirect'
            elif status_code == 404:
                return 'not_found'
            elif 400 <= status_code < 500:
                return 'client_error'
            elif 500 <= status_code < 600:
                return 'server_error'
        return 'unknown'

    def extract_links_from_site_map(self, site_map_path='../data/site-map.json'):
        """Extract all unique links from site map"""
        print("🔗 Extracting links from site map")

        if not os.path.exists(site_map_path):
            print(f"❌ Site map not found at {site_map_path}")
            print("  Run crawl_site.py first!")
            return []

        # Load site map
        with open(site_map_path, 'r') as f:
            site_map = json.load(f)

        links_to_check = set()

        # Extract all URLs from site map pages
        for page in site_map:
            page_url = page.get('url', '')

            # Re-fetch page to extract links
            try:
                from bs4 import BeautifulSoup
                response = self.session.get(page_url, timeout=10)
                soup = BeautifulSoup(response.content, 'html.parser')

                for link in soup.find_all('a', href=True):
                    href = link['href']

                    # Skip anchors, javascript, mailto, tel
                    if href.startswith('#') or href.startswith('javascript:') or \
                       href.startswith('mailto:') or href.startswith('tel:'):
                        continue

                    # Make absolute URL
                    from urllib.parse import urljoin
                    full_url = urljoin(page_url, href)

                    links_to_check.add((full_url, page_url))

            except Exception as e:
                print(f"  Error extracting links from {page_url}: {e}")
                continue

        print(f"  Found {len(links_to_check)} unique links to validate")
        return list(links_to_check)

    def validate_all_links(self, site_map_path='../data/site-map.json'):
        """Validate all links in parallel"""
        print("🔍 Starting link validation")

        # Extract links
        links_to_check = self.extract_links_from_site_map(site_map_path)

        if not links_to_check:
            print("⚠️  No links to validate")
            return

        print(f"\n📋 Validating {len(links_to_check)} links with {self.max_workers} workers")

        # Validate in parallel
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all tasks
            future_to_url = {
                executor.submit(self.validate_url, url, source): (url, source)
                for url, source in links_to_check
            }

            # Process results as they complete
            for future in tqdm(as_completed(future_to_url), total=len(links_to_check), desc="Validating"):
                result = future.result()
                self.results.append(result)

        print(f"\n✅ Link validation complete!")

    def save_results(self, output_dir='../data'):
        """Save validation results to CSV and JSON"""
        os.makedirs(output_dir, exist_ok=True)

        if not self.results:
            print("⚠️  No results to save")
            return

        # Save as CSV
        df = pd.DataFrame(self.results)
        csv_path = os.path.join(output_dir, 'link-validation.csv')
        df.to_csv(csv_path, index=False)
        print(f"✅ Link validation results saved to {csv_path}")

        # Save as JSON
        json_path = os.path.join(output_dir, 'link-validation.json')
        with open(json_path, 'w') as f:
            json.dump(self.results, f, indent=2)

        # Save broken links separately
        broken_links = [r for r in self.results if r.get('status') not in ['ok', 'ok_other', 'redirect']]
        if broken_links:
            broken_df = pd.DataFrame(broken_links)
            broken_csv = os.path.join(output_dir, 'broken-links.csv')
            broken_df.to_csv(broken_csv, index=False)
            print(f"✅ Broken links saved to {broken_csv}")

        # Print summary statistics
        print("\n📊 Link Validation Statistics:")
        print(f"  Total links checked: {len(self.results)}")
        print(f"  OK (200): {len([r for r in self.results if r.get('status') == 'ok'])}")
        print(f"  Redirects: {len([r for r in self.results if r.get('status') == 'redirect'])}")
        print(f"  Not Found (404): {len([r for r in self.results if r.get('status') == 'not_found'])}")
        print(f"  Client Errors (4xx): {len([r for r in self.results if r.get('status') == 'client_error'])}")
        print(f"  Server Errors (5xx): {len([r for r in self.results if r.get('status') == 'server_error'])}")
        print(f"  Timeouts: {len([r for r in self.results if r.get('status') == 'timeout'])}")
        print(f"  Other Errors: {len([r for r in self.results if r.get('status') == 'error'])}")

        # Slow links
        slow_links = [r for r in self.results if r.get('response_time_ms', 0) > 3000]
        if slow_links:
            print(f"\n⚠️  {len(slow_links)} slow links (>3s):")
            for link in slow_links[:5]:  # Show first 5
                print(f"    {link.get('url')} - {link.get('response_time_ms')}ms")

def main():
    """Run the link validator"""
    validator = LinkValidator(timeout=10, max_workers=10)

    validator.validate_all_links()
    validator.save_results()

    print("\n🎉 Done! Check ../data/link-validation.csv and ../data/broken-links.csv")

if __name__ == "__main__":
    main()
