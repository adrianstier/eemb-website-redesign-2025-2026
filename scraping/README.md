# EEMB Website Content Scraping

**Purpose:** Preserve ALL existing content from current EEMB website before building new site.

## Critical: Why We're Doing This

Before building the new website, we must capture:
- Every page, paragraph, and link
- All faculty profiles and research descriptions
- All photos and media files
- Course information and handbooks
- Historical content
- External links and integrations

**Risks if we skip this:**
- Lost faculty bios and research descriptions
- Broken links and missing resources
- Lost historical content
- Angry faculty whose content disappeared

## Tools

1. **Site Crawler** (`scripts/crawl_site.py`) - Maps entire site structure
2. **Faculty Scraper** (`scripts/scrape_faculty.py`) - Extracts faculty data
3. **Image Downloader** (`scripts/download_images.py`) - Downloads all images
4. **Link Validator** (`scripts/validate_links.py`) - Checks all links

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run all scrapers
python scripts/run_all.py
```

## Output Structure

```
data/
├── site-map.csv          # Every page on the site
├── faculty-directory.csv # All faculty with bios
├── staff-directory.csv   # All staff
├── external-links.csv    # All external links
└── images-catalog.csv    # All images inventoried

assets/
├── images/               # All photos downloaded
├── documents/            # All PDFs, docs
└── media/                # Any videos
```

## Timeline

- **Day 1-2:** Run automated scraping
- **Day 3-4:** Manual content audit
- **Day 5-7:** Clean and organize data

## Next Steps

After scraping complete:
1. Review all data files
2. Categorize content (keep/update/rewrite/archive)
3. Import into new site database
4. Set up URL redirects
