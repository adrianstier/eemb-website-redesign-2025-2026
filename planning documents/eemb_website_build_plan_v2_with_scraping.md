# EEMB Website Build Plan v2 - With Content Scraping
## 7-Week Development Sprint with Claude Code

**Goal:** Build and deploy a polished website by January 1, 2026, preserving ALL existing content
**Timeline:** November 12, 2025 → January 1, 2026 (7 weeks)
**Critical Addition:** Complete content scraping and preservation BEFORE building

---

## SPRINT 0: Content Scraping & Preservation (Nov 12-18, Week 1)

**CRITICAL PRIORITY:** We must capture everything from the current site before building anything new.

### Why This Matters

**Risks if we skip this:**
- Lost faculty bios and research descriptions
- Broken links and missing resources
- Lost historical content
- No baseline to compare against
- Angry faculty whose content disappeared

**What we're preserving:**
- Every page, every paragraph, every link
- All photos and media files
- Faculty profiles and research descriptions
- Course information
- Historical content and archives
- External links and integrations

---

### Phase 1A: Automated Web Scraping (Day 1-2)

**Tools & Approach:**

**Option 1: Python with Beautiful Soup + Scrapy**
```python
# Scrape entire site structure
# Download all HTML pages
# Extract all images, PDFs, documents
# Map all internal links
# Map all external links
# Track broken links
```

**Option 2: Commercial Tool (Screaming Frog SEO Spider)**
- Free version: 500 URLs
- Paid version: Unlimited
- Exports to CSV/Excel
- Visual site structure

**Option 3: HTTrack Website Copier**
- Free, open source
- Downloads entire website
- Maintains directory structure
- Can browse offline

**Recommended: Combination Approach**
1. HTTrack for complete mirror
2. Python script for structured data extraction
3. Screaming Frog for link analysis

### What We'll Capture

**Site Structure:**
```
eemb.ucsb.edu/
├── index.html
├── about/
├── people/
│   ├── faculty/
│   │   ├── index.html
│   │   ├── adrian-stier.html
│   │   ├── holly-moeller.html
│   │   └── [all faculty pages]
│   ├── staff/
│   └── students/
├── research/
├── academics/
│   ├── graduate/
│   └── undergraduate/
├── events/
├── support/
└── [all other directories]
```

**Assets Inventory:**
```
assets/
├── images/
│   ├── faculty-photos/
│   ├── research-photos/
│   ├── facility-photos/
│   └── banners/
├── documents/
│   ├── handbooks/
│   ├── forms/
│   └── syllabi/
└── media/
    └── videos/
```

**Data Extraction:**
```
data/
├── faculty-directory.csv
├── staff-directory.csv
├── courses.csv
├── events.csv
├── publications.csv (if available)
└── external-links.csv
```

---

### Phase 1B: Manual Content Audit (Day 3-4)

**Review and categorize everything:**

**Content Status Categories:**
- ✅ **Keep as-is:** Current, accurate, well-written
- 📝 **Update:** Good content, needs refreshing
- 🔄 **Rewrite:** Outdated tone/format, good information
- ❌ **Archive:** Historical value but not for main site
- 🗑️ **Delete:** Truly obsolete

**Special Attention Items:**

**Faculty Content:**
- [ ] Every faculty member's bio
- [ ] Research descriptions
- [ ] Lab website URLs
- [ ] Publications lists
- [ ] Current photo status (missing/outdated?)

**Program Information:**
- [ ] Graduate program requirements
- [ ] Course descriptions
- [ ] Handbooks and policies
- [ ] Application procedures

**Research Areas:**
- [ ] Current research area descriptions
- [ ] Lab groups and centers
- [ ] Field sites information
- [ ] Facilities descriptions

**News/Events:**
- [ ] Seminar series archives
- [ ] Past events
- [ ] Announcements
- [ ] Department updates

**Administrative:**
- [ ] Staff directory
- [ ] Contact information
- [ ] Forms and documents
- [ ] Support services
- [ ] Committee information

---

### Phase 1C: Create Master Content Database (Day 5-7)

**Structured Data Files:**

**1. Faculty Database (CSV/JSON)**
```csv
id,first_name,last_name,title,email,office,phone,photo_url,bio_current,research_current,lab_url,personal_url,research_areas,status,date_scraped
1,Adrian,Stier,Associate Professor,stier@ucsb.edu,LSB 4101,...
```

**2. Content Pages Inventory (CSV)**
```csv
url,page_title,content_type,word_count,last_updated,status,notes,keep_update_rewrite
/about,About EEMB,informational,850,2023-09,keep,Good overview
/research,Research Overview,informational,1200,2021-03,update,Needs fresher content
```

**3. Images Catalog (CSV)**
```csv
original_url,local_path,file_size,dimensions,usage,alt_text,status
/images/coral-reef.jpg,assets/images/coral-reef.jpg,2.3MB,1920x1080,homepage-hero,Coral reef Mo'orea,keep
```

**4. External Links Database (CSV)**
```csv
link_url,context_page,link_text,status,category,notes
https://diversity.eemb.ucsb.edu,homepage,DEI Committee,active,internal-microsite,maintain
https://gsac.eemb.ucsb.edu,resources,GSAC,active,internal-microsite,maintain
```

**5. Documents Archive (CSV)**
```csv
original_url,local_path,document_type,title,last_updated,status
/docs/phd-handbook.pdf,documents/phd-handbook-2024.pdf,handbook,PhD Handbook 2024-25,2024-09,current
```

---

### Scraping Tools & Scripts

**Tool 1: Complete Site Mirror**
```bash
# Using HTTrack
httrack "https://eemb.ucsb.edu" \
  -O "/path/to/eemb-mirror" \
  -%v \
  -r6 \
  -*.css -*.js -*.woff* \
  -N0 \
  --display \
  --robots=0
```

**Tool 2: Structured Data Extraction (Python)**
```python
import requests
from bs4 import BeautifulSoup
import pandas as pd
import json
from urllib.parse import urljoin, urlparse
import time
import os

# Faculty scraper
def scrape_faculty_directory():
    faculty_data = []
    
    # Get faculty list page
    url = "https://eemb.ucsb.edu/people/faculty"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract each faculty member
    faculty_cards = soup.find_all('div', class_='faculty-card')  # Adjust selector
    
    for card in faculty_cards:
        faculty = {
            'name': card.find('h3').text.strip(),
            'title': card.find('p', class_='title').text.strip(),
            'email': card.find('a', href=lambda x: x and 'mailto:' in x)['href'].replace('mailto:', ''),
            'profile_url': urljoin(url, card.find('a')['href']),
            'photo_url': urljoin(url, card.find('img')['src']),
            'research_areas': [tag.text for tag in card.find_all('span', class_='tag')]
        }
        
        # Get detailed bio from profile page
        profile_response = requests.get(faculty['profile_url'])
        profile_soup = BeautifulSoup(profile_response.content, 'html.parser')
        
        faculty['bio'] = profile_soup.find('div', class_='bio').text.strip()
        faculty['lab_url'] = profile_soup.find('a', text='Lab Website')['href'] if profile_soup.find('a', text='Lab Website') else None
        
        faculty_data.append(faculty)
        time.sleep(1)  # Be polite
    
    return pd.DataFrame(faculty_data)

# Image downloader
def download_images(image_urls, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    for img_url in image_urls:
        filename = os.path.basename(urlparse(img_url).path)
        filepath = os.path.join(output_dir, filename)
        
        response = requests.get(img_url, stream=True)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Downloaded: {filename}")

# Link validator
def validate_links(urls):
    broken_links = []
    
    for url in urls:
        try:
            response = requests.head(url, timeout=5, allow_redirects=True)
            if response.status_code >= 400:
                broken_links.append({'url': url, 'status': response.status_code})
        except:
            broken_links.append({'url': url, 'status': 'timeout/error'})
        
        time.sleep(0.5)
    
    return pd.DataFrame(broken_links)

# Run everything
if __name__ == "__main__":
    print("Scraping faculty directory...")
    faculty_df = scrape_faculty_directory()
    faculty_df.to_csv('data/faculty-scraped.csv', index=False)
    
    print("Downloading faculty photos...")
    download_images(faculty_df['photo_url'].tolist(), 'assets/images/faculty')
    
    print("Done!")
```

**Tool 3: Link Crawler & Validator**
```python
def crawl_site(start_url, max_pages=1000):
    visited = set()
    to_visit = [start_url]
    site_map = []
    
    while to_visit and len(visited) < max_pages:
        url = to_visit.pop(0)
        if url in visited:
            continue
        
        try:
            response = requests.get(url, timeout=10)
            visited.add(url)
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Record page info
            site_map.append({
                'url': url,
                'title': soup.find('title').text if soup.find('title') else '',
                'status': response.status_code,
                'word_count': len(soup.get_text().split()),
                'internal_links': len([a for a in soup.find_all('a', href=True) 
                                      if urlparse(a['href']).netloc == urlparse(url).netloc]),
                'external_links': len([a for a in soup.find_all('a', href=True) 
                                      if urlparse(a['href']).netloc != urlparse(url).netloc]),
                'images': len(soup.find_all('img'))
            })
            
            # Find new URLs to visit
            for link in soup.find_all('a', href=True):
                full_url = urljoin(url, link['href'])
                if urlparse(full_url).netloc == urlparse(start_url).netloc:
                    if full_url not in visited and full_url not in to_visit:
                        to_visit.append(full_url)
            
            time.sleep(1)
            
        except Exception as e:
            print(f"Error crawling {url}: {e}")
    
    return pd.DataFrame(site_map)

# Run crawler
sitemap_df = crawl_site("https://eemb.ucsb.edu")
sitemap_df.to_csv('data/site-map.csv', index=False)
```

---

### Deliverables from Sprint 0

**By end of Week 1, we'll have:**

1. **Complete Site Mirror**
   - `/eemb-mirror/` - browseable offline copy
   - Backup of EVERYTHING

2. **Structured Data**
   - `faculty-directory.csv` - All faculty with bios
   - `staff-directory.csv` - All staff
   - `site-map.csv` - Every page mapped
   - `external-links.csv` - All external links
   - `images-catalog.csv` - All images inventoried

3. **Asset Library**
   - `/assets/images/` - All photos downloaded
   - `/assets/documents/` - All PDFs, docs downloaded
   - `/assets/media/` - Any videos

4. **Content Audit Spreadsheet**
   - Every page categorized (keep/update/rewrite/archive)
   - Priority ranking
   - Notes for improvements

5. **Technical Inventory**
   - Links to external microsites (diversity, gsac, fuerte)
   - Forms and integrations
   - Third-party tools in use
   - Broken links report

---

## Updated Sprint Schedule (Weeks 2-7)

### **Sprint 1: Foundation & Design (Nov 19-25, Week 2)**

Now informed by scraped content:

**Tasks:**
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS with EEMB design system
- [ ] Import scraped data into database schema
- [ ] Create reusable components based on existing patterns
- [ ] Build homepage with actual scraped content
- [ ] Import faculty photos to project

**Key Change:** We're now building WITH real content from day 1, not placeholders

---

### **Sprint 2: People Section (Nov 26-Dec 2, Week 3)**

**Tasks:**
- [ ] Import all faculty data from scraped CSV
- [ ] Faculty directory with filtering (research areas from scraped data)
- [ ] Individual faculty pages using scraped bios
- [ ] Staff directory from scraped data
- [ ] **In Memoriam page** (Chair priority)
  - Use scraped data as baseline
  - Enhance with new content from Andi

**Key Change:** Start with existing bios, enhance rather than rewrite from scratch

---

### **Sprint 3: Research & Programs (Dec 3-9, Week 4)**

**Tasks:**
- [ ] Research areas pages (preserve existing descriptions)
- [ ] Labs directory with preserved URLs
- [ ] Graduate program pages (update from scraped content)
- [ ] Course information (from scraped data)
- [ ] Field sites information

**Key Change:** Preserve authoritative content, update formatting

---

### **Sprint 4: Good News Blog (Dec 10-16, Week 5)**

**Tasks:**
- [ ] Build blog system
- [ ] Backfill with transformed Good News items
- [ ] Category system
- [ ] Admin interface

---

### **Sprint 5: DEI, Events, Resources (Dec 17-23, Week 6)**

**Tasks:**
- [ ] **Updated DEI section** (Chair priority)
- [ ] Events/seminars pages
- [ ] Support services (preserve all resource links)
- [ ] Admin panel
- [ ] Forms and integrations

---

### **Sprint 6: Polish & Deploy (Dec 24-31, Week 7)**

**Tasks:**
- [ ] Final content review (compare to scraped baseline)
- [ ] 301 redirects for all old URLs
- [ ] Broken link fixes
- [ ] Performance optimization
- [ ] Deploy to production
- [ ] Demo preparation

---

## Critical Content Preservation Checklist

### Before Deleting Anything:

- [ ] Verify content exists in new site
- [ ] Set up 301 redirects
- [ ] Notify affected faculty if their page changes
- [ ] Archive old site for reference
- [ ] Document what was changed and why

### URL Preservation Strategy:

**Old URLs should redirect to new ones:**
```
/people/faculty/adrian-stier  →  /people/faculty/stier-adrian
/academics/graduate/phd       →  /programs/graduate/phd
/events/all/2023/seminar-abc  →  /news-events/archive/2023/seminar-abc
```

**Maintain critical URLs exactly:**
- Faculty profile URLs (most linked externally)
- Program pages (in application materials)
- Handbook links (in official documents)

---

## Integration with Your Research Document

**Once I can access your uploaded research file, I'll:**

1. Review your findings and recommendations
2. Integrate your research into scraping priorities
3. Update the content audit categories
4. Incorporate any additional pages/sections you identified
5. Align design decisions with your research insights

**In the meantime, please:**
- Re-upload the research file (it didn't come through)
- OR paste the key points here
- OR share via Google Drive link

---

## Let's Start Scraping This Week!

### Immediate Action Items (This Week):

**Day 1-2 (Today/Tomorrow):**
- [ ] Run HTTrack to mirror entire site
- [ ] Run Python scripts to extract structured data
- [ ] Download all images and documents

**Day 3-4 (Thu/Fri):**
- [ ] Manual content audit
- [ ] Categorize every page
- [ ] Create master spreadsheets

**Day 5-7 (Weekend):**
- [ ] Clean and organize data
- [ ] Prepare for import into new site
- [ ] Set up database schema

**Next Monday (Nov 18):**
- [ ] Begin Sprint 1 with REAL content
- [ ] No more placeholders!

---

## Questions for You:

1. **Can you re-upload your research document?** Or share the key findings?

2. **Do you want me to run the scraping scripts?** I can do it right now and have the data within hours

3. **Any pages you know are particularly important to preserve?**
   - Specific faculty pages?
   - Important resources?
   - Historical content?

4. **Are there areas you definitely want to CHANGE vs PRESERVE?**
   - Some content might be better rewritten fresh
   - Other content should be preserved exactly

5. **Who should review the content audit?** 
   - You alone?
   - Whole committee?
   - Individual faculty for their pages?

**Ready to start scraping? I can begin immediately and have preliminary data for you by end of day tomorrow!**
