# EEMB Website - Claude Code Execution Plan
## Solo Developer Build with AI Assistance | Jan 1, 2026 Target

**Builder:** You (PM + Full-Stack + Content Lead)  
**AI Partner:** Claude Code (pair programmer)  
**Philosophy:** Automation, reproducibility, validation checkpoints  
**Timeline:** 7 weeks / ~100 AI-coding hours

---

## 🎯 Core Principle: Build Artifacts, Not Meetings

Each sprint delivers a **working, testable artifact** stored in Git.  
No team coordination—just you, Claude, and reproducible automation.

---

## 📁 Project Structure

```
eemb-website/
├── PROJECT_CONTEXT.md           # Claude's memory file (paste at start of each session)
├── data/                         # Source of truth (JSON-first)
│   ├── faculty.json
│   ├── staff.json  
│   ├── research-areas.json
│   ├── news-items.json
│   ├── in-memoriam.json
│   └── scraped/                 # Original scraped data
├── scripts/                     # Automation toolchain
│   ├── scrape/
│   │   ├── scraper_core.py
│   │   ├── faculty_parser.py
│   │   ├── asset_downloader.py
│   │   └── validate_scrape.py
│   ├── transform/
│   │   ├── csv_to_json.py
│   │   └── content_cleaner.py
│   └── deploy/
│       └── deploy.sh
├── src/                         # Next.js application
│   ├── app/
│   │   ├── page.tsx             # Homepage
│   │   ├── people/
│   │   │   ├── faculty/
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── in-memoriam/page.tsx
│   │   ├── research/
│   │   ├── programs/
│   │   └── news/
│   ├── components/
│   │   ├── FacultyCard.tsx
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   └── NewsCard.tsx
│   ├── lib/
│   │   ├── data.ts              # JSON loader utilities
│   │   └── types.ts             # TypeScript interfaces
│   └── styles/
│       └── globals.css          # Tailwind config
├── public/
│   ├── images/
│   │   ├── faculty/
│   │   ├── hero/
│   │   └── research/
│   └── assets/
├── tests/
│   ├── scrape.test.py
│   ├── data-validation.test.ts
│   └── lighthouse.test.js
├── reports/                     # Automated test outputs
│   ├── lighthouse.html
│   └── data-diff.html
├── Makefile                     # Orchestration
└── README.md
```

---

## 🧠 PROJECT_CONTEXT.md (Claude's Memory File)

**Create this file first—paste it at the start of every Claude Code session:**

```markdown
# EEMB Website - Project Context

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + React + TypeScript
- **Styling:** Tailwind CSS v3
- **Data:** JSON files in /data/ (no external database for MVP)
- **Hosting:** Vercel (static export)
- **Scraping:** Python 3.11 + BeautifulSoup4 + Requests

## Design Tokens
- **Colors:** 
  - Primary: `#003660` (UCSB Navy)
  - Secondary: `#FEBC11` (UCSB Gold)
  - Accent: `#4A9EC6` (Ocean Blue Light), `#1B5E7E` (Ocean Blue Deep)
  - Text: `#333333`, Backgrounds: `#FFFFFF`, `#F5F5F5`
- **Typography:** 
  - Headers: Inter (sans-serif)
  - Body: Open Sans (sans-serif)
- **Spacing:** 8px base unit (8, 16, 24, 32, 48, 64px)

## Data Structure (JSON Schema)

### faculty.json
```json
{
  "faculty": [
    {
      "id": "stier-adrian",
      "slug": "stier-adrian",
      "firstName": "Adrian",
      "lastName": "Stier",
      "preferredName": "Adrian Stier",
      "title": "Associate Professor",
      "email": "stier@ucsb.edu",
      "phone": "(805) 893-xxxx",
      "office": "LSB 4101",
      "photoUrl": "/images/faculty/stier-adrian.jpg",
      "bioShort": "Studies coral reef ecology...",
      "bioLong": "Full biography...",
      "researchAreas": ["ecology", "marine-biology"],
      "researchInterests": ["coral reefs", "community ecology"],
      "labUrl": "https://oceanrecoveries.com",
      "personalUrl": null,
      "status": "active",
      "isDeceased": false
    }
  ]
}
```

### news-items.json
```json
{
  "newsItems": [
    {
      "id": "2025-11-07-kuris-parasitology",
      "slug": "kuris-parasitology-videos",
      "datePublished": "2025-11-07",
      "title": "EEMB Parasitology Expertise Reaches Global Audience",
      "excerpt": "Professor Kuris's teaching reaches global audience...",
      "content": "Full article content...",
      "category": "publication",
      "tags": ["education", "parasitology", "outreach"],
      "featuredPeople": ["kuris-armand"],
      "featuredImageUrl": "/images/news/parasitology-video.jpg",
      "externalLinks": [
        {"url": "https://youtube.com/...", "title": "View Videos"}
      ],
      "featured": true
    }
  ]
}
```

## File Map
- Faculty pages: `/src/app/people/faculty/[slug]/page.tsx`
- News pages: `/src/app/news/[slug]/page.tsx`
- Data loaders: `/src/lib/data.ts`
- Components: `/src/components/[Name].tsx`

## Key Decisions
- No external database for MVP (JSON files as source of truth)
- Static site generation (no SSR for now)
- 301 redirects via vercel.json
- Manual content curation (no Google Forms API yet)

## Chair's Three Priorities
1. Updated DEI section (link to diversity.eemb.ucsb.edu)
2. In Memoriam page (5 scholars initially)
3. Good News blog (15-20 backfilled posts)
```

---

## 📊 Sprint Structure: Toolchains, Not Teams

| Sprint | Human Goal | AI-Assisted Deliverable | Completion Signal |
|--------|-----------|------------------------|-------------------|
| **0** | Scrape & archive | `scrape_all.py` pipeline + validated JSONs | `data/*.json` passes validation tests |
| **1** | Environment setup | Next.js + Tailwind scaffolded | `npm run dev` works, homepage renders |
| **2** | People pages | `faculty_importer.ts` + dynamic routes | Faculty directory + individual pages live |
| **3** | Research/Programs | Markdown → page generator | All content pages templated |
| **4** | Good News blog | MDX system implemented & seeded | 15+ posts, filtering works |
| **5** | DEI/Resources | Content modules + forms | All Chair priorities complete |
| **6** | Polish & deploy | Automated tests + deploy script | Lighthouse >90, live on Vercel |

---

## 🔧 SPRINT 0: Scrape & Archive (Week 1: Nov 12-18)

### Goal
Working `scrape_all.py` pipeline with validated JSON outputs

### Promptable Units (100-200 lines each)

#### Module 1: `scraper_core.py`
**Claude Prompt:**
```
Create scraper_core.py that:
- Takes a start_url and max_pages
- Returns list of {'url', 'html', 'status_code'}
- Implements polite crawling (1 sec delay)
- Handles timeouts gracefully
- Saves raw HTML to data/scraped/pages/
```

#### Module 2: `faculty_parser.py`
**Claude Prompt:**
```
Create faculty_parser.py that:
- Parses https://eemb.ucsb.edu/people/faculty HTML
- Extracts each faculty card with: name, title, email, photo_url, profile_url
- Follows profile_url to get bio, lab_url, research_areas
- Returns list of dicts matching faculty.json schema from PROJECT_CONTEXT.md
- Includes error handling for missing fields
```

#### Module 3: `asset_downloader.py`
**Claude Prompt:**
```
Create asset_downloader.py that:
- Takes list of image URLs
- Downloads to public/images/faculty/
- Renames files to slug format (firstname-lastname.jpg)
- Verifies downloads succeeded
- Returns manifest JSON of {original_url: local_path}
```

#### Module 4: `validate_scrape.py`
**Claude Prompt:**
```
Create validate_scrape.py that:
- Loads data/faculty.json
- Asserts all required fields present (no nulls on email, name, title)
- Checks photo URLs exist in public/images/
- Validates email format
- Prints summary statistics
- Exits with code 1 if any validation fails
```

### Run-Test-Summarize Loop

**Day 1:**
```bash
# 1. Generate scraper_core.py with Claude
# 2. Run it
python scripts/scrape/scraper_core.py

# 3. If errors, paste traceback to Claude
# 4. Iterate until working

# 5. Add test
python -m pytest tests/scrape.test.py -v

# 6. Commit
git add scripts/scrape/scraper_core.py
git commit -m "Add core scraper module"
```

**Day 2-3:** Repeat for `faculty_parser.py`, `asset_downloader.py`

**Day 4:** Run full pipeline + validation

```bash
# Orchestrate with Makefile
make scrape
make validate
make test-scrape
```

### Validation Tests

**tests/scrape.test.py:**
```python
import json
import pytest
from pathlib import Path

def test_faculty_json_exists():
    assert Path("data/faculty.json").exists()

def test_faculty_data_valid():
    with open("data/faculty.json") as f:
        data = json.load(f)
    
    faculty = data["faculty"]
    assert len(faculty) > 0, "No faculty found"
    
    for person in faculty:
        assert person["email"], f"Missing email for {person['firstName']}"
        assert person["photoUrl"], f"Missing photo for {person['firstName']}"
        assert Path(f"public{person['photoUrl']}").exists(), f"Photo missing: {person['photoUrl']}"

def test_no_broken_links():
    # Add link validation here
    pass
```

### JSON Data Structure

**data/faculty.json:**
```json
{
  "faculty": [
    {
      "id": "stier-adrian",
      "slug": "stier-adrian",
      "firstName": "Adrian",
      "lastName": "Stier",
      "preferredName": "Adrian Stier",
      "title": "Associate Professor",
      "email": "stier@ucsb.edu",
      "phone": "(805) 893-4724",
      "office": "LSB 4101",
      "photoUrl": "/images/faculty/stier-adrian.jpg",
      "bioShort": "Studies coral reef ecology and community dynamics",
      "bioLong": "Adrian Stier is an Associate Professor...",
      "researchAreas": ["ecology", "marine-biology"],
      "researchInterests": ["coral reefs", "fish ecology", "restoration"],
      "labUrl": "https://oceanrecoveries.com",
      "personalUrl": null,
      "googleScholarUrl": null,
      "status": "active",
      "isDeceased": false,
      "scrapedDate": "2025-11-12"
    }
  ],
  "metadata": {
    "totalFaculty": 45,
    "lastScraped": "2025-11-12T10:30:00Z",
    "source": "https://eemb.ucsb.edu/people/faculty"
  }
}
```

**data/in-memoriam.json:**
```json
{
  "memorials": [
    {
      "id": "trench-robert",
      "personId": "trench-robert",
      "slug": "trench-robert",
      "firstName": "Robert",
      "lastName": "Trench",
      "preferredName": "Robert K. Trench",
      "birthYear": 1940,
      "deathYear": 2018,
      "deathDate": "2018-03-15",
      "title": "Professor Emeritus",
      "photoUrl": "/images/memoriam/trench-robert.jpg",
      "biography": "Robert K. Trench was a pioneering researcher...",
      "personalRemembrance": "Colleagues remember Bob as...",
      "legacyText": "His work on coral-algal symbiosis...",
      "researchAreas": ["marine-biology", "symbiosis"],
      "memorialLinks": [
        {
          "url": "https://www.globalcoral.org/robert-kent-trench-in-memoriam-2/",
          "title": "Global Coral Alliance Memorial"
        }
      ],
      "createdAt": "2025-11-15"
    }
  ]
}
```

**data/news-items.json:**
```json
{
  "newsItems": [
    {
      "id": "2025-11-07-parasitology",
      "slug": "kuris-parasitology-videos-2025",
      "datePublished": "2025-11-07",
      "title": "EEMB Parasitology Expertise Reaches Global Audience",
      "excerpt": "Professor Armand Kuris's renowned EEMB 111 course adapted into open educational videos",
      "content": "Full markdown content here...",
      "category": "publication",
      "tags": ["education", "parasitology", "outreach"],
      "featuredPeople": ["kuris-armand"],
      "featuredLabs": [],
      "researchAreas": ["ecology", "evolution"],
      "featuredImageUrl": "/images/news/parasitology-2025.jpg",
      "featuredImageCaption": "Professor Kuris teaching parasitology",
      "externalLinks": [
        {
          "url": "https://www.youtube.com/@chelsealwood6/videos",
          "title": "View Video Series",
          "type": "primary"
        }
      ],
      "relatedNewsItems": [],
      "status": "published",
      "featured": true,
      "viewCount": 0,
      "submittedBy": null,
      "submittedViaForm": false
    }
  ],
  "metadata": {
    "totalPublished": 18,
    "lastUpdated": "2025-11-12T14:00:00Z"
  }
}
```

### Deliverables

**By end of Week 1:**
- ✅ `data/faculty.json` (validated, 40+ entries)
- ✅ `data/staff.json` (validated)
- ✅ `data/research-areas.json`
- ✅ `data/news-items.json` (15-20 backfilled Good News)
- ✅ `data/in-memoriam.json` (5 scholars)
- ✅ `public/images/faculty/` (all photos downloaded)
- ✅ `data/scraped/` (raw HTML backup)
- ✅ All validation tests passing

---

## 🏗️ SPRINT 1: Environment & Homepage (Week 2: Nov 19-25)

### Goal
Next.js + Tailwind project scaffolded, homepage rendering

### Setup Sequence

#### Step 1: Initialize Project
**Claude Prompt:**
```
Initialize a Next.js 14 project with:
- TypeScript
- App Router
- Tailwind CSS
- ESLint
Configure tailwind.config.js with EEMB design tokens from PROJECT_CONTEXT.md
```

```bash
npx create-next-app@latest eemb-website --typescript --tailwind --app --eslint
cd eemb-website
```

#### Step 2: Design System
**Claude Prompt:**
```
Create src/styles/globals.css with Tailwind config:
- Extend theme with EEMB colors (navy, gold, ocean blues)
- Set up Inter and Open Sans fonts
- Define spacing scale (8px base)
- Add utility classes for buttons, cards, containers
```

**Manual verification:**
```bash
npm run dev
# Visit http://localhost:3000
# Check that colors/fonts work
```

#### Step 3: TypeScript Interfaces
**Claude Prompt:**
```
Create src/lib/types.ts with TypeScript interfaces matching:
- data/faculty.json schema
- data/news-items.json schema
- data/in-memoriam.json schema
From PROJECT_CONTEXT.md
```

**src/lib/types.ts:**
```typescript
export interface Faculty {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  title: string;
  email: string;
  phone?: string;
  office?: string;
  photoUrl: string;
  bioShort: string;
  bioLong: string;
  researchAreas: string[];
  researchInterests: string[];
  labUrl?: string;
  personalUrl?: string;
  status: 'active' | 'emeritus' | 'on-leave';
  isDeceased: boolean;
}

export interface NewsItem {
  id: string;
  slug: string;
  datePublished: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'publication' | 'award' | 'grant' | 'presentation' | 'community' | 'media' | 'student_achievement';
  tags: string[];
  featuredPeople: string[];
  featuredImageUrl: string;
  featuredImageCaption?: string;
  externalLinks: { url: string; title: string; type?: string }[];
  featured: boolean;
}

export interface Memorial {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  birthYear?: number;
  deathYear: number;
  deathDate?: string;
  title: string;
  photoUrl: string;
  biography: string;
  personalRemembrance: string;
  legacyText: string;
  researchAreas: string[];
  memorialLinks: { url: string; title: string }[];
}
```

#### Step 4: Data Loader Utilities
**Claude Prompt:**
```
Create src/lib/data.ts with functions:
- loadFaculty(): Promise<Faculty[]>
- loadNewsItems(): Promise<NewsItem[]>  
- loadMemorials(): Promise<Memorial[]>
- getFacultyBySlug(slug: string): Promise<Faculty | null>
Read from /data/*.json files at build time
```

#### Step 5: Navigation Component
**Claude Prompt:**
```
Create src/components/Navigation.tsx:
- Desktop horizontal nav with dropdowns
- Mobile hamburger menu
- Links: About | People | Research | Programs | News | Give
- Use Tailwind, EEMB navy background, gold accents
- Responsive (burger menu < 768px)
```

**Validation:**
```bash
npm run dev
# Check navigation works
# Test on mobile viewport
```

#### Step 6: Hero Component
**Claude Prompt:**
```
Create src/components/Hero.tsx:
- Full-width banner (h-[600px])
- Background image with overlay
- Centered text: "Advancing ocean science from genes to ecosystems"
- Two CTAs: "Apply to Graduate Program" | "Explore Our Research"
- Tailwind styling, responsive
```

#### Step 7: Homepage
**Claude Prompt:**
```
Create src/app/page.tsx:
- Import Navigation, Hero
- Four audience modules (cards):
  1. "Join Our Research Community" (grad students)
  2. "Pioneering Marine Biology" (research excellence)
  3. "Build Your Career" (faculty)
  4. "Science for Everyone" (community)
- Preview of 3 latest news items from loadNewsItems()
- Footer with quick links
```

### Testing Checklist

```bash
# Visual check
npm run dev

# Type check
npm run type-check

# Build test
npm run build
```

### Deliverables

**By end of Week 2:**
- ✅ Next.js project running locally
- ✅ Tailwind configured with EEMB design tokens
- ✅ TypeScript interfaces for all data models
- ✅ Data loader utilities working
- ✅ Navigation component (desktop + mobile)
- ✅ Hero component
- ✅ Complete homepage with real content
- ✅ First Vercel preview deployment

---

## 👥 SPRINT 2: People Section (Week 3: Nov 26-Dec 2)

### Goal
Faculty directory + individual pages + **In Memoriam** (Chair Priority #2)

### Promptable Units

#### Module 1: Faculty Card Component
**Claude Prompt:**
```
Create src/components/FacultyCard.tsx:
- Props: faculty: Faculty
- Display: photo (rounded), name, title, research areas (badges)
- Click links to /people/faculty/[slug]
- Tailwind card styling with hover effect
```

#### Module 2: Faculty Directory Page
**Claude Prompt:**
```
Create src/app/people/faculty/page.tsx:
- Load all faculty from loadFaculty()
- Filter by research area (Ecology, Evolution, Marine Biology) using useState
- Grid layout of FacultyCard components (3 cols desktop, 1 col mobile)
- Search bar (filter by name)
```

#### Module 3: Dynamic Faculty Pages
**Claude Prompt:**
```
Create src/app/people/faculty/[slug]/page.tsx:
- Dynamic route using Next.js 14 App Router
- Load faculty by slug: getFacultyBySlug(params.slug)
- Display: large photo, full bio, research interests, lab link, contact info
- "Back to Faculty Directory" link
- Use generateStaticParams for all faculty slugs
```

**Validation test:**
```typescript
// Visit /people/faculty/stier-adrian
// Check photo loads, bio displays, lab link works
```

#### Module 4: In Memoriam Page (CHAIR PRIORITY #2)
**Claude Prompt:**
```
Create src/app/people/in-memoriam/page.tsx:
- Load memorials from loadMemorials()
- Grid of memorial cards (photo, name, years, short bio excerpt)
- Click opens individual memorial page
- Respectful, elegant design (muted colors)
- Filter by decade or research area
```

#### Module 5: Individual Memorial Pages
**Claude Prompt:**
```
Create src/app/people/in-memoriam/[slug]/page.tsx:
- Load memorial by slug
- Three sections:
  1. Biography (academic achievements)
  2. Personal Remembrance (colleague quotes)
  3. Legacy (continuing impact)
- External memorial links
- Photo gallery if available
```

### Content Preparation

**Manual task this week:**
- Gather biographical info for 5 scholars:
  - Robert K. Trench
  - Joseph H. Connell
  - Adrian M. Wenner
  - John Damuth
  - Allen Stewart-Oaten
- Collect photos
- Populate `data/in-memoriam.json`

### Testing Checklist

```bash
# Type check
npm run type-check

# Test dynamic routing
npm run dev
# Visit /people/faculty/stier-adrian
# Visit /people/in-memoriam/trench-robert

# Build static export
npm run build
npx serve out -p 3000
```

### Deliverables

**By end of Week 3:**
- ✅ Faculty directory with filtering
- ✅ 40+ individual faculty pages (dynamic)
- ✅ **In Memoriam page with 5 scholars** ← Chair Priority
- ✅ Individual memorial pages
- ✅ All images optimized (<200KB)

---

## 🔬 SPRINT 3: Research & Programs (Week 4: Dec 3-9)

### Goal
Research areas overview + Labs + Graduate programs

### Promptable Units

#### Module 1: Research Area Pages
**Claude Prompt:**
```
Create src/app/research/[area]/page.tsx:
- Dynamic route for: ecology, evolution, marine-biology
- Load research-areas.json
- Display: hero image, description, featured faculty
- Grid of associated labs
- Recent publications/news in this area
```

#### Module 2: Labs Directory
**Claude Prompt:**
```
Create src/app/research/labs/page.tsx:
- Load faculty.json where labUrl exists
- Card grid with: lab name, PI photo/name, research focus, external link
- Filter by research area
```

#### Module 3: Graduate Programs
**Claude Prompt:**
```
Create src/app/programs/graduate/page.tsx:
- Sections: PhD Program, MS Program, Application Info
- Pull content from scraped data or manual JSON
- Prominent "Apply by December 1" CTA
- Link to handbooks, requirements
```

#### Module 4: Content Migration Script
**Claude Prompt:**
```
Create scripts/transform/markdown_to_json.py:
- Takes scraped HTML or Markdown files
- Converts to structured JSON for Next.js pages
- Handles headings, lists, links
- Outputs to data/pages/
```

### Testing

```bash
# Check research area pages
npm run dev
# Visit /research/ecology
# Visit /research/marine-biology

# Check labs directory
# Visit /research/labs

# Check graduate programs
# Visit /programs/graduate
```

### Deliverables

**By end of Week 4:**
- ✅ 3 research area pages (Ecology, Evolution, Marine Biology)
- ✅ Labs directory
- ✅ Graduate program pages (PhD, MS)
- ✅ Application information with deadlines
- ✅ Content fully migrated from scraped data

---

## 📰 SPRINT 4: Good News Blog (Week 5: Dec 10-16)

### Goal
Good News blog system with 15+ posts (Chair Priority #3)

### Promptable Units

#### Module 1: News Feed Page
**Claude Prompt:**
```
Create src/app/news/page.tsx:
- Load all newsItems from loadNewsItems()
- Category filter buttons (Publications, Awards, Grants, etc.)
- Card grid layout (NewsCard component)
- Pagination (10 per page) or infinite scroll
- Featured posts at top
```

#### Module 2: News Card Component
**Claude Prompt:**
```
Create src/components/NewsCard.tsx:
- Props: newsItem: NewsItem
- Display: category badge, date, title, excerpt, featured image
- Click links to /news/[slug]
- Professional card styling
```

#### Module 3: Individual News Pages
**Claude Prompt:**
```
Create src/app/news/[slug]/page.tsx:
- Load news item by slug
- Full article with hero image
- Category badge, date, featured faculty links
- External links section
- "Share this news" buttons
- Related news items at bottom
```

#### Module 4: Content Transformation
**Manual task:**
- Transform 15-20 Good News emails using guidelines from modernization plan
- Populate `data/news-items.json`
- Source/create featured images

**Helper script:**
**Claude Prompt:**
```
Create scripts/transform/email_to_json.py:
- Takes raw email text
- Extracts: title, content, date, category
- Suggests slug, excerpt
- Outputs JSON structure for manual review
```

### Testing

```bash
# Check news feed
npm run dev
# Visit /news
# Test category filtering
# Test pagination

# Check individual posts
# Visit /news/kuris-parasitology-videos-2025

# Check featured posts display
```

### Deliverables

**By end of Week 5:**
- ✅ News feed with category filtering
- ✅ 15-20 professional news posts ← **Chair Priority #3**
- ✅ Individual news pages
- ✅ Featured posts highlighting
- ✅ Professional images for each post

---

## 🌈 SPRINT 5: DEI, Resources, Admin (Week 6: Dec 17-23)

### Goal
DEI section (Chair Priority #1) + Resources + Basic Admin

### Promptable Units

#### Module 1: DEI Overview Page (CHAIR PRIORITY #1)
**Claude Prompt:**
```
Create src/app/about/dei/page.tsx:
- Overview of EEMB's commitment to diversity
- Current DEI Committee structure (from Deron & Cherie)
- Link to diversity.eemb.ucsb.edu with prominent CTA
- Recent initiatives (FUERTE program, etc.)
- Resources section
- Comment box link
```

**Manual task:**
- Get updated content from Deron & Cherie
- Replace Working Group references
- Add committee member photos/names

#### Module 2: Resources Page
**Claude Prompt:**
```
Create src/app/resources/page.tsx:
- Sections: For Students, For Faculty, For Staff
- Links to: Handbooks, Forms, Support Services, Computing
- External links to: GSAC, Safety, Facilities
- Quick link cards
```

#### Module 3: Simple Admin Interface
**Claude Prompt:**
```
Create src/app/admin/page.tsx (password-protected):
- Form to add new news item
- Fields match NewsItem interface
- Image upload
- Preview before publish
- Saves to data/news-items.json
- Triggers rebuild (webhook to Vercel)
```

**Note:** For MVP, can use simple password auth or skip admin entirely (manual JSON editing)

### Testing

```bash
# Check DEI page
npm run dev
# Visit /about/dei
# Verify link to diversity.eemb.ucsb.edu works

# Check resources
# Visit /resources

# Test admin (if built)
# Visit /admin
```

### Deliverables

**By end of Week 6:**
- ✅ **Updated DEI section** ← Chair Priority #1
- ✅ Complete resources page
- ✅ All external links working
- ✅ Basic admin interface (optional)
- ✅ All three Chair priorities complete

---

## ✨ SPRINT 6: Polish, Test, Deploy (Week 7: Dec 24-31)

### Goal
Lighthouse >90, production deployment, demo ready

### Task Checklist

#### Performance Optimization
**Claude Prompt:**
```
Optimize Next.js app for performance:
- Add next/image for all images (automatic optimization)
- Implement lazy loading for below-fold content
- Enable static generation for all pages
- Add metadata for SEO
- Minify CSS/JS
```

**Run Lighthouse:**
```bash
npm run build
npx serve out -p 3000
npx lighthouse http://localhost:3000 --output html --output-path reports/lighthouse.html
```

**Target scores:**
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

#### Accessibility Audit
**Checklist:**
- [ ] All images have alt text
- [ ] Headings hierarchy correct (H1 → H2 → H3)
- [ ] Color contrast ratios ≥4.5:1
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels on interactive elements

**Tools:**
```bash
npm install -D @axe-core/cli
npx axe http://localhost:3000 --exit
```

#### Cross-Browser Testing
**Manual testing:**
- [ ] Chrome (desktop + mobile)
- [ ] Firefox
- [ ] Safari (desktop + mobile)
- [ ] Edge

#### 301 Redirects
**Create vercel.json:**
```json
{
  "redirects": [
    {
      "source": "/people/faculty/:slug",
      "destination": "/people/faculty/:slug",
      "permanent": true
    }
  ]
}
```

**Test redirects:**
```bash
# Deploy to Vercel preview
vercel --prod
# Test old URLs redirect correctly
```

#### Final Content Review
**Checklist:**
- [ ] All faculty bios accurate
- [ ] No broken links (run link checker)
- [ ] All images load
- [ ] Contact info correct
- [ ] Dates and deadlines current
- [ ] Typos fixed

**Link checker:**
```bash
npm install -g broken-link-checker
blc http://localhost:3000 -ro
```

#### Documentation
**Create comprehensive README.md:**
```markdown
# EEMB Website

## Quick Start
npm install
npm run dev

## Data Management
Edit JSON files in /data/
Run `make validate` to check

## Adding News
Edit data/news-items.json
Follow schema in PROJECT_CONTEXT.md

## Deployment
git push origin main
# Auto-deploys to Vercel

## Maintenance
- Update faculty: Edit data/faculty.json
- Add news: Edit data/news-items.json  
- Scrape fresh data: make scrape
```

### Deployment Steps

**Step 1: Vercel Setup**
```bash
npm install -g vercel
vercel login
vercel link
```

**Step 2: Environment Config**
```bash
# Add environment variables (if needed)
vercel env add NEXT_PUBLIC_SITE_URL
```

**Step 3: Deploy**
```bash
vercel --prod
```

**Step 4: Custom Domain**
```bash
# Add domain in Vercel dashboard
# Or use subdomain: beta.eemb.ucsb.edu
vercel domains add beta.eemb.ucsb.edu
```

### Deliverables

**By January 1:**
- ✅ Lighthouse scores >90 all categories
- ✅ Zero critical accessibility issues
- ✅ Works in all major browsers
- ✅ Live on Vercel with custom domain
- ✅ All 301 redirects working
- ✅ Documentation complete
- ✅ Demo presentation ready

---

## 📋 Daily Workflow with Claude Code

### Morning Session (2 hours)

**1. Start with PROJECT_CONTEXT.md**
```
[Paste PROJECT_CONTEXT.md into Claude Code]

Today I'm working on Sprint X, Module Y.
The goal is to [specific deliverable].
Here's the current file structure:
[paste relevant tree]
```

**2. Promptable Task**
```
Create [filename] that:
- [specific requirement 1]
- [specific requirement 2]
- Matches [schema/interface] from PROJECT_CONTEXT.md
- Includes error handling
- Max 200 lines
```

**3. Run-Test-Iterate**
```bash
# Run the code
python script.py
# OR
npm run dev

# If errors:
[Copy error traceback]
[Paste into Claude Code]
"Fix this error: [traceback]"

# Iterate until working
```

**4. Validate**
```bash
# Run validation test
npm run test
# OR
python -m pytest tests/

# Check manually
# Browse to relevant page
```

**5. Commit**
```bash
git add .
git commit -m "Add [feature]: [what it does]"
git push
```

### Afternoon Session (1 hour)

**Content Integration:**
- Add real text/images
- Test on different screen sizes
- Review and refine styling

**Evening:**
- Deploy preview to Vercel
- Share link if needed
- Plan tomorrow's tasks

---

## 🧪 Automated Testing Strategy

### Validation Tests (Run after every change)

**tests/data-validation.test.ts:**
```typescript
import { loadFaculty, loadNewsItems } from '../src/lib/data';

test('all faculty have required fields', async () => {
  const faculty = await loadFaculty();
  faculty.forEach(person => {
    expect(person.email).toBeTruthy();
    expect(person.photoUrl).toBeTruthy();
    expect(person.slug).toBeTruthy();
  });
});

test('all faculty photos exist', async () => {
  const faculty = await loadFaculty();
  // Check that public/images/faculty/[slug].jpg exists
  // ...
});

test('no broken external links', async () => {
  // Test all external URLs return 200
  // ...
});
```

**Run tests:**
```bash
npm run test
npm run test:watch  # While developing
```

### Sanity Checks

**Makefile:**
```makefile
.PHONY: validate test scrape

validate:
	python scripts/scrape/validate_scrape.py
	npm run type-check
	npm run test

test:
	npm run test
	npx lighthouse http://localhost:3000 --output html --output-path reports/lighthouse.html

scrape:
	python scripts/scrape/scrape_all.py
	python scripts/scrape/validate_scrape.py
	
deploy:
	make validate
	npm run build
	vercel --prod
```

### Data Diffing

**When re-scraping later:**
```python
# scripts/scrape/diff_data.py
import json
from deepdiff import DeepDiff

old = json.load(open('data/faculty.json.backup'))
new = json.load(open('data/faculty.json'))

diff = DeepDiff(old, new, ignore_order=True)
print("Changes detected:", diff)

# Generate HTML report
# ...
```

---

## 📊 Progress Tracking

### Weekly Checklist

**Week 1:** ☐ Scraping complete, JSON validated  
**Week 2:** ☐ Next.js setup, homepage live  
**Week 3:** ☐ Faculty pages + In Memoriam complete  
**Week 4:** ☐ Research/programs complete  
**Week 5:** ☐ Good News blog live  
**Week 6:** ☐ DEI updated, all priorities done  
**Week 7:** ☐ Polished, deployed, demo ready  

### Completion Signals

| Category | Signal |
|----------|--------|
| Content Preservation | `data/*.json` matches old site, validation passing |
| Design | Tailwind theme working, components reusable |
| Functionality | All pages render, navigation works |
| Performance | Lighthouse >90 all categories |
| Deployment | Live on Vercel, custom domain configured |
| Documentation | README complete, PROJECT_CONTEXT.md current |

---

## 🎯 Demo Day Presentation (January 1)

### Presentation Flow (15 minutes)

**1. Before/After (2 min)**
- Show current site issues (dated design, poor navigation)
- Reveal new site (modern, clean)

**2. Homepage Tour (3 min)**
- Hero banner and tagline
- Four audience modules
- Navigation (desktop + mobile responsive)
- Good News preview

**3. Key Features (5 min)**
- Faculty directory with live filtering demo
- Individual faculty page example
- **In Memoriam page** (Chair Priority #2)
- **Good News blog** with category filtering (Chair Priority #3)
- **Updated DEI section** (Chair Priority #1)

**4. Technical Quality (2 min)**
- Show Lighthouse scores (Performance >90)
- Demo mobile responsiveness
- Fast page loads
- Accessibility features

**5. Admin & Maintenance (2 min)**
- How to update content (edit JSON)
- How to add news items
- Deployment process (git push → auto-deploy)

**6. Next Steps (1 min)**
- Roadmap for enhancements (search, calendar, forms)
- Timeline for full launch
- Feedback process

### Demo Script

```
"The current EEMB website is dated and doesn't showcase our excellence. 
Let me show you what we've built..."

[Navigate to homepage]
"Clean, modern design. Hero banner with our field work. Clear navigation 
for different audiences - prospective students, faculty, community members."

[Click Faculty Directory]
"Complete faculty directory. Filter by research area. Here's Adrian's 
page - his bio, lab link, research interests, all pulled from our database."

[Navigate to In Memoriam]
"We've created an In Memoriam page honoring our departed colleagues - 
Trench, Connell, Wenner, and others. Professional, respectful tributes."

[Navigate to Good News]
"The Good News blog transforms our weekly emails into professional posts. 
Filter by category - publications, awards, grants. Here's the parasitology 
video story, looking polished and ready for external audiences."

[Navigate to DEI]
"Updated DEI section with current committee structure, linking to our 
full DEI microsite."

[Open mobile view]
"Fully responsive - works beautifully on phones. Navigation collapses to 
hamburger menu. Images scale properly."

[Show Lighthouse]
"Technical quality is excellent - Performance, Accessibility, SEO all 
scoring 90+. Fast page loads, optimized images."

"This is ready to launch. All content is in JSON files - easy to maintain. 
Push to GitHub, automatically deploys. No technical debt."

"Ready for feedback and full launch planning."
```

---

## 🚀 Post-Launch Roadmap (Phase 2)

**Q1 2026 Enhancements:**
- Advanced search (Algolia or similar)
- Google Calendar integration for events
- Publication feed from Google Scholar
- Photo galleries
- Video hosting
- Alumni directory

**Q2 2026:**
- Google Forms integration for Good News submissions
- Quarterly digest generator (PDF export)
- Advanced analytics dashboard
- Social media auto-posting

**Q3 2026:**
- Full CMS migration (if needed)
- Multi-language support
- Interactive research maps
- Student spotlights section

---

## 📞 Questions & Support

**During Build:**
- Paste PROJECT_CONTEXT.md at start of every Claude session
- Keep sessions focused (1-2 modules per session)
- Commit frequently (after every working module)
- Deploy preview weekly (share for feedback)

**Stuck?**
- Re-read PROJECT_CONTEXT.md
- Check similar component in repo
- Ask Claude for smaller chunks (break down further)
- Test in isolation (create minimal reproduction)

**Need Help?**
- GitHub issues for tracking bugs
- Daily commit messages document progress
- Weekly preview deployments for stakeholder feedback

---

## 🎉 Success Criteria

**On January 1, you can confidently show:**

✅ **Modern Design**
- Clean, professional aesthetic
- Fully responsive (mobile-first)
- Fast page loads (<3 seconds)
- UCSB branding with ocean accents

✅ **Complete Content**
- 40+ faculty profiles
- 5 In Memoriam pages
- 15+ Good News posts
- All research/program pages
- Updated DEI section

✅ **Technical Excellence**
- Lighthouse scores >90
- Zero accessibility issues
- All links working
- Smooth navigation
- Works in all browsers

✅ **Chair's Priorities**
1. ✅ DEI section updated
2. ✅ In Memoriam page live
3. ✅ Good News blog active

✅ **Maintainable**
- Clear documentation
- JSON-based content (easy edits)
- Automated deployment
- Version controlled

---

**Let's build this! 🚀**

Ready to start Sprint 0 (scraping) today?
