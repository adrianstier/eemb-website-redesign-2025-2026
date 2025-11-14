# Quick Start: Scraping the Current EEMB Website

## Why We're Doing This First

**CRITICAL:** Before building the new website, we must preserve ALL existing content. This ensures:
- No faculty bios are lost
- No broken links after migration
- Historical content is preserved
- We have a baseline for comparison

## Installation (5 minutes)

### 1. Check Python Version
```bash
python3 --version
# Should be 3.11 or higher
```

### 2. Install Dependencies
```bash
cd scraping
pip3 install -r requirements.txt
```

If you get permission errors:
```bash
pip3 install --user -r requirements.txt
```

### 3. Verify Installation
```bash
python3 scripts/run_all.py --help
# Should not error
```

## Running the Scraper (2-4 hours)

### Option 1: Run Everything at Once (Recommended)

```bash
cd scraping/scripts
python3 run_all.py
```

This will:
1. ✅ Crawl entire eemb.ucsb.edu site (500 pages, ~30-45 min)
2. ✅ Extract all faculty data (bios, photos, research) (~15-20 min)
3. ✅ Download all images and documents (~30-60 min)
4. ✅ Validate all links (~20-30 min)

**Total time: 2-4 hours** (depending on site size and network speed)

You can leave it running and check back later!

### Option 2: Run Individual Scripts

If you want more control or if something fails:

```bash
# 1. Crawl site structure
python3 crawl_site.py

# 2. Scrape faculty directory
python3 scrape_faculty.py

# 3. Download all media
python3 download_images.py

# 4. Validate links
python3 validate_links.py
```

## What You'll Get

After scraping completes, you'll have:

### Data Files (`scraping/data/`)
- `site-map.csv` - Every page on the site (URLs, titles, word counts, links)
- `faculty-scraped.csv` - All faculty (names, emails, bios, research, photos)
- `images-catalog.csv` - Every image (URL, size, dimensions, local path)
- `documents-catalog.csv` - Every document (PDFs, handbooks, forms)
- `link-validation.csv` - Status of all links (working, broken, redirects)
- `broken-links.csv` - Just the broken links that need fixing

### Downloaded Assets (`scraping/assets/`)
- `images/` - All website images
- `images/faculty/` - All faculty photos
- `documents/` - All PDFs, handbooks, forms

## Reviewing the Results

### 1. Check the Summary
After scraping, you'll see output like:
```
📊 Crawl Statistics:
  Total pages crawled: 487
  Successful: 463
  Errors: 24
  Total images found: 342
  Total documents: 89

📊 Faculty Scraping Statistics:
  Total faculty scraped: 45
  With emails: 45
  With photos: 42
  With bios: 45

📊 Link Validation Statistics:
  Total links checked: 1,234
  OK (200): 1,156
  Not Found (404): 47
  Redirects: 31
```

### 2. Open the CSV Files
```bash
# On Mac
open ../data/site-map.csv
open ../data/faculty-scraped.csv
open ../data/broken-links.csv

# Or use Excel, Numbers, Google Sheets
```

### 3. Key Things to Check

**Faculty Data (`faculty-scraped.csv`):**
- [ ] All current faculty are listed
- [ ] Bios look complete (not truncated)
- [ ] Email addresses are correct
- [ ] Photos are downloaded (check `photo_url` column)

**Broken Links (`broken-links.csv`):**
- [ ] Note which links are broken
- [ ] Decide which to fix vs. remove
- [ ] Plan URL redirects for changed pages

**Site Map (`site-map.csv`):**
- [ ] Important pages are all captured
- [ ] No critical sections missing
- [ ] Check word counts (pages with very low counts might have scraping issues)

## Troubleshooting

### "Module not found" error
```bash
pip3 install -r requirements.txt
```

### "Permission denied" error
```bash
chmod +x scripts/*.py
```

### Scraper is too slow
Edit `crawl_site.py` and change `max_pages`:
```python
# Line ~295
crawler = EEMBSiteCrawler(
    start_url="https://eemb.ucsb.edu",
    max_pages=100  # Reduce from 500 to 100 for testing
)
```

### Site structure is different than expected
The scrapers use common HTML patterns. If EEMB's site structure is unusual:
1. Run the scripts as-is first
2. Review the CSV output
3. If data is missing, we can adjust the scraping logic

### Faculty scraper didn't find profiles
Check the faculty list URL in `scrape_faculty.py` line ~151:
```python
faculty_list_url = "https://eemb.ucsb.edu/people/faculty"
```

If EEMB uses a different URL, update it and re-run.

## What's Next?

After scraping is complete:

### 1. Manual Content Audit (Day 3-4)
Go through `faculty-scraped.csv` and categorize each faculty member:
- ✅ Content looks good (use as-is)
- 📝 Needs minor updates
- 🔄 Needs rewrite
- Photos missing or outdated

### 2. Create Master Content Database (Day 5-7)
Clean up the CSV files:
- Fix any formatting issues
- Add missing data manually
- Categorize what to keep/update/archive
- Plan URL redirects

### 3. Import to New Website (Week 1+)
Once the new Strapi backend is set up, we'll import this data:
```bash
# This will come later
python scripts/import_to_strapi.py
```

## Need Help?

**Common Questions:**

**Q: How long should scraping take?**
A: 2-4 hours for a typical department site (200-500 pages)

**Q: Can I stop and resume?**
A: Yes! Each script is independent. If `crawl_site.py` completes but `download_images.py` fails, just re-run the failed script.

**Q: What if the site structure is different?**
A: The scrapers use flexible pattern matching, but we may need to adjust for EEMB's specific structure. Run first, review results, then we can tune.

**Q: Do I need to scrape the site multiple times?**
A: No, once is enough. We're creating a snapshot of current content.

**Q: What about dynamic content (JavaScript)?**
A: These scrapers get static HTML. If EEMB has heavy JavaScript (React/Vue), we may need Selenium/Playwright. Check the CSV output - if data is missing, let's discuss.

## Ready to Go!

```bash
cd scraping/scripts
python3 run_all.py
```

Then grab coffee! ☕ It'll take 2-4 hours.

When it's done, review the CSV files and check off the "Manual Content Audit" checklist in the main build plan.
