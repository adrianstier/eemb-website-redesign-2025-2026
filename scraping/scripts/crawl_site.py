#!/usr/bin/env python3
"""
EEMB Website Crawler
Crawls entire eemb.ucsb.edu site and maps all pages, links, and content.
"""

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import pandas as pd
import time
import os
from tqdm import tqdm
import json

class EEMBSiteCrawler:
    def __init__(self, start_url="https://eemb.ucsb.edu", max_pages=1000):
        self.start_url = start_url
        self.max_pages = max_pages
        self.visited = set()
        self.to_visit = [start_url]
        self.site_map = []
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'EEMB-Scraper/1.0 (Content preservation for website redesign)'
        })

    def is_same_domain(self, url):
        """Check if URL belongs to eemb.ucsb.edu domain"""
        parsed_start = urlparse(self.start_url)
        parsed_url = urlparse(url)
        return parsed_url.netloc == parsed_start.netloc

    def normalize_url(self, url):
        """Normalize URL (remove fragments, lowercase)"""
        parsed = urlparse(url)
        # Remove fragment and rebuild
        normalized = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        if parsed.query:
            normalized += f"?{parsed.query}"
        return normalized

    def extract_links(self, soup, base_url):
        """Extract all links from page"""
        links = []
        for link in soup.find_all('a', href=True):
            full_url = urljoin(base_url, link['href'])
            full_url = self.normalize_url(full_url)
            links.append(full_url)
        return links

    def extract_images(self, soup, base_url):
        """Extract all image URLs from page"""
        images = []
        for img in soup.find_all('img', src=True):
            img_url = urljoin(base_url, img['src'])
            images.append({
                'url': img_url,
                'alt': img.get('alt', ''),
                'title': img.get('title', '')
            })
        return images

    def crawl_page(self, url):
        """Crawl a single page and extract data"""
        try:
            response = self.session.get(url, timeout=10, allow_redirects=True)

            # Check if redirected
            final_url = response.url
            if final_url != url:
                print(f"  Redirected: {url} → {final_url}")

            soup = BeautifulSoup(response.content, 'html.parser')

            # Extract page title
            title = soup.find('title')
            title_text = title.text.strip() if title else ''

            # Extract meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            description = meta_desc.get('content', '') if meta_desc else ''

            # Get text content
            text_content = soup.get_text(separator=' ', strip=True)
            word_count = len(text_content.split())

            # Extract links
            links = self.extract_links(soup, url)
            internal_links = [l for l in links if self.is_same_domain(l)]
            external_links = [l for l in links if not self.is_same_domain(l)]

            # Extract images
            images = self.extract_images(soup, url)

            # Record page info
            page_data = {
                'url': url,
                'final_url': final_url,
                'title': title_text,
                'description': description,
                'status_code': response.status_code,
                'word_count': word_count,
                'internal_links_count': len(internal_links),
                'external_links_count': len(external_links),
                'images_count': len(images),
                'content_type': response.headers.get('Content-Type', ''),
                'last_modified': response.headers.get('Last-Modified', ''),
                'crawled_at': time.strftime('%Y-%m-%d %H:%M:%S')
            }

            self.site_map.append(page_data)

            # Add new internal links to crawl queue
            for link in internal_links:
                if link not in self.visited and link not in self.to_visit:
                    self.to_visit.append(link)

            return True

        except requests.exceptions.Timeout:
            print(f"  Timeout: {url}")
            self.site_map.append({
                'url': url,
                'status_code': 'timeout',
                'error': 'Request timeout'
            })
            return False

        except requests.exceptions.RequestException as e:
            print(f"  Error crawling {url}: {e}")
            self.site_map.append({
                'url': url,
                'status_code': 'error',
                'error': str(e)
            })
            return False

    def crawl(self):
        """Main crawl loop"""
        print(f"Starting crawl of {self.start_url}")
        print(f"Max pages: {self.max_pages}")

        pbar = tqdm(total=min(len(self.to_visit), self.max_pages), desc="Crawling")

        while self.to_visit and len(self.visited) < self.max_pages:
            url = self.to_visit.pop(0)

            if url in self.visited:
                continue

            print(f"\nCrawling ({len(self.visited)+1}/{self.max_pages}): {url}")

            self.visited.add(url)
            self.crawl_page(url)

            pbar.update(1)
            pbar.total = min(len(self.to_visit) + len(self.visited), self.max_pages)
            pbar.refresh()

            # Be polite - rate limit
            time.sleep(1)

        pbar.close()
        print(f"\n✅ Crawl complete! Visited {len(self.visited)} pages")

    def save_results(self, output_dir='../data'):
        """Save crawl results to CSV and JSON"""
        os.makedirs(output_dir, exist_ok=True)

        # Save as CSV
        df = pd.DataFrame(self.site_map)
        csv_path = os.path.join(output_dir, 'site-map.csv')
        df.to_csv(csv_path, index=False)
        print(f"✅ Site map saved to {csv_path}")

        # Save as JSON (more detailed)
        json_path = os.path.join(output_dir, 'site-map.json')
        with open(json_path, 'w') as f:
            json.dump(self.site_map, f, indent=2)
        print(f"✅ Site map saved to {json_path}")

        # Print summary statistics
        print("\n📊 Crawl Statistics:")
        print(f"  Total pages crawled: {len(self.site_map)}")
        print(f"  Successful: {len([p for p in self.site_map if p.get('status_code') == 200])}")
        print(f"  Errors: {len([p for p in self.site_map if p.get('status_code') != 200])}")
        print(f"  Total internal links found: {sum(p.get('internal_links_count', 0) for p in self.site_map)}")
        print(f"  Total external links found: {sum(p.get('external_links_count', 0) for p in self.site_map)}")
        print(f"  Total images found: {sum(p.get('images_count', 0) for p in self.site_map)}")

        return df

def main():
    """Run the crawler"""
    crawler = EEMBSiteCrawler(
        start_url="https://eemb.ucsb.edu",
        max_pages=500  # Adjust as needed
    )

    crawler.crawl()
    crawler.save_results()

    print("\n🎉 Done! Check ../data/site-map.csv for results")

if __name__ == "__main__":
    main()
