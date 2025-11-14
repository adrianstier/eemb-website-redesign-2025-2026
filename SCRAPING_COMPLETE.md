# ✅ Web Scraping System - Ready to Use

**Created:** November 12, 2025
**Status:** Complete and ready to run

---

## What We Built

A complete web scraping system to preserve ALL content from the current EEMB website before building the new one.

### 🛠️ Tools Created

1. **Site Crawler** ([scraping/scripts/crawl_site.py](scraping/scripts/crawl_site.py))
   - Maps entire site structure
   - Extracts titles, descriptions, word counts
   - Tracks all internal and external links
   - Identifies images and documents
   - **Output:** `site-map.csv` with every page

2. **Faculty Scraper** ([scraping/scripts/scrape_faculty.py](scraping/scripts/scrape_faculty.py))
   - Extracts faculty profiles from directory
   - Captures names, titles, emails, office locations
   - Preserves complete bios and research descriptions
   - Downloads photo URLs
   - Extracts lab website links
   - **Output:** `faculty-scraped.csv` with all faculty data

3. **Media Downloader** ([scraping/scripts/download_images.py](scraping/scripts/download_images.py))
   - Downloads all images from site
   - Downloads all documents (PDFs, handbooks, forms)
   - Detects and skips duplicates
   - Organizes by type (faculty photos, general images, documents)
   - Tracks file sizes and dimensions
   - **Output:** Downloaded files + `images-catalog.csv` + `documents-catalog.csv`

4. **Link Validator** ([scraping/scripts/validate_links.py](scraping/scripts/validate_links.py))
   - Validates every link found during crawling
   - Checks HTTP status codes (200, 404, 500, etc.)
   - Detects redirects and slow responses
   - Runs in parallel for speed
   - **Output:** `link-validation.csv` + `broken-links.csv`

5. **Master Pipeline** ([scraping/scripts/run_all.py](scraping/scripts/run_all.py))
   - Runs all scrapers in correct order
   - Handles errors gracefully
   - Shows progress and statistics
   - **One command to scrape everything**

---

## How to Use

### Quick Start

```bash
# 1. Install dependencies (first time only)
cd scraping
pip3 install -r requirements.txt

# 2. Run everything
cd scripts
python3 run_all.py
```

**Time:** 2-4 hours (depending on site size)

### What You'll Get

After scraping completes:

```
scraping/
├── data/                           # All extracted data
│   ├── site-map.csv               # Every page on site
│   ├── faculty-scraped.csv        # All faculty data
│   ├── images-catalog.csv         # Image inventory
│   ├── documents-catalog.csv      # Document inventory
│   ├── link-validation.csv        # All links status
│   └── broken-links.csv           # Broken links only
│
└── assets/                         # Downloaded files
    ├── images/                     # All images
    │   └── faculty/               # Faculty photos
    ├── documents/                  # PDFs, handbooks, forms
    └── media/                      # Videos (if any)
```

---

## Why This Matters

**Before we build the new website, we MUST:**

1. ✅ **Preserve all content** - No faculty bios lost, no broken links
2. ✅ **Create baseline** - Compare old vs new to ensure nothing missing
3. ✅ **Plan redirects** - Know which URLs need 301 redirects
4. ✅ **Import data** - Use scraped data to populate new site
5. ✅ **Validate quality** - Ensure new content matches or improves on old

**Risks if we skip this:**
- ❌ Lost faculty research descriptions (angry faculty!)
- ❌ Broken external links to EEMB profiles
- ❌ Missing historical content
- ❌ No way to verify new site has everything

---

## Next Steps (After Scraping)

### 1. Manual Content Audit (Day 3-4)

Review the CSV files and categorize content:

**Open `faculty-scraped.csv` and check:**
- [ ] All current faculty are listed
- [ ] Bios are complete (not truncated)
- [ ] Contact info is correct
- [ ] Photos are present
- [ ] Research descriptions are accurate

**Categorize each piece of content:**
- ✅ **Keep as-is** - Current, accurate, well-written
- 📝 **Update** - Good content, needs refreshing
- 🔄 **Rewrite** - Outdated tone/format
- 🗑️ **Archive** - Historical value, not for main site

**Open `broken-links.csv` and:**
- [ ] Identify which links can be fixed
- [ ] Note external resources that moved
- [ ] Plan URL structure for new site

### 2. Clean Data (Day 5-7)

Prepare data for import to new site:

```bash
# Create cleaned versions
cp data/faculty-scraped.csv data/faculty-cleaned.csv
# Open in Excel/Numbers and:
# - Fix any formatting issues
# - Add missing data manually
# - Standardize field formats
# - Remove duplicates
```

### 3. Plan URL Redirects

Map old URLs to new URLs:

```csv
old_url,new_url,redirect_type
/people/faculty/adrian-stier,/people/faculty/stier-adrian,301
/academics/graduate/phd,/programs/graduate/phd,301
```

This ensures:
- External links still work
- Google search results updated
- No broken bookmarks

### 4. Import to New Site (Week 1+)

Once Strapi backend is running, import the data:

```bash
# Script to be created during backend phase
python scripts/import_to_strapi.py
```

---

## Technical Details

### Scraper Features

**Polite Crawling:**
- Rate limiting (1 second between requests)
- Respectful User-Agent header
- Timeout handling (10 seconds max)

**Data Quality:**
- Deduplication (MD5 hashing for images/documents)
- Error handling (continues even if some pages fail)
- UTF-8 encoding support (handles special characters)
- Broken link detection

**Flexibility:**
- Pattern-based extraction (adapts to different HTML structures)
- Configurable limits (adjust max pages, timeout, workers)
- CSV + JSON output (easy to import anywhere)

### Customization

If EEMB's site structure is unique, you can adjust:

**Change max pages to crawl:**
```python
# In crawl_site.py, line ~295
max_pages=500  # Increase or decrease
```

**Change faculty directory URL:**
```python
# In scrape_faculty.py, line ~151
faculty_list_url = "https://eemb.ucsb.edu/people/faculty"
```

**Change timeout for slow sites:**
```python
# In any script
timeout=10  # Increase to 20 or 30
```

**Parallel workers for link validation:**
```python
# In validate_links.py
max_workers=10  # Increase for faster validation (be careful!)
```

---

## Troubleshooting

### Common Issues

**1. "Module not found" error**
```bash
pip3 install -r requirements.txt
```

**2. Site uses heavy JavaScript (React/Vue)**
- Current scrapers get static HTML only
- If content is missing, we may need Selenium/Playwright
- Check CSV output first - often works fine

**3. Faculty scraper finds no profiles**
- Check the faculty directory URL
- EEMB might use different URL pattern
- Adjust `faculty_list_url` in script

**4. Scraper is slow**
- Reduce `max_pages` for testing
- Expected: 500 pages in 30-45 minutes
- Network speed affects download times

**5. Permission denied**
```bash
chmod +x scripts/*.py
```

### Getting Help

1. Check [scraping/QUICK_START.md](scraping/QUICK_START.md)
2. Review CSV output to see what was captured
3. Adjust scraping logic if needed (pattern matching)

---

## File Reference

### Configuration
- [requirements.txt](scraping/requirements.txt) - Python dependencies
- [.gitignore](/.gitignore) - Excludes large scraped files from Git

### Documentation
- [README.md](scraping/README.md) - Overview and purpose
- [QUICK_START.md](scraping/QUICK_START.md) - Detailed usage guide
- This file - Summary and next steps

### Scripts
- [crawl_site.py](scraping/scripts/crawl_site.py) - Site structure crawler
- [scrape_faculty.py](scraping/scripts/scrape_faculty.py) - Faculty data extractor
- [download_images.py](scraping/scripts/download_images.py) - Media downloader
- [validate_links.py](scraping/scripts/validate_links.py) - Link checker
- [run_all.py](scraping/scripts/run_all.py) - Master pipeline

---

## Success Metrics

After scraping, you should have:

✅ **Complete site map**
- 200-500+ pages cataloged
- All URLs, titles, descriptions
- Link counts and structure

✅ **Faculty directory**
- 40-50+ faculty profiles
- 90%+ with complete bios
- 90%+ with photos
- All contact info

✅ **Media library**
- 300-500+ images downloaded
- 50-100+ documents (PDFs, handbooks)
- All organized by type
- Catalog with metadata

✅ **Link validation**
- 1000-2000+ links checked
- Broken links identified
- Redirects documented
- External link status

---

## Timeline

| Day | Task | Duration |
|-----|------|----------|
| 1-2 | Run automated scraping | 2-4 hours (automated) |
| 3-4 | Manual content audit | 8-12 hours (manual) |
| 5-7 | Clean and organize data | 8-12 hours (manual) |

**Total:** ~1 week before building begins

---

## Ready to Run!

Everything is set up and ready. When you're ready to scrape:

```bash
cd scraping/scripts
python3 run_all.py
```

Then move on to the manual content audit while building begins!

---

**Questions?** Check [QUICK_START.md](scraping/QUICK_START.md) for detailed instructions.

**Issues?** Review the Troubleshooting section above.

**Ready to build?** Once scraping is done, follow the main development roadmap starting with Week 0 (Environment Setup).

🎉 **Happy scraping!**
