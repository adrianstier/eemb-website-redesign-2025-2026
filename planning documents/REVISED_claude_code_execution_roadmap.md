# EEMB Website - Claude Code Execution Roadmap
## Complete Build Plan with Backend Management for Non-Technical Users

**Version:** 2.0 - Backend-First Approach
**Timeline:** 12 weeks (Jan 2026 launch realistic target)
**Philosophy:** Build infrastructure first, then beautiful UI on top

---

## 🎯 Core Revision: Why 12 Weeks Instead of 7

**Original plan** assumed JSON files = quick build
**Reality**: You need a proper backend for non-technical management

**Time breakdown:**
- Weeks 1-3: Backend & database (critical foundation)
- Weeks 4-7: Frontend with real data
- Weeks 8-10: Admin interface & training
- Weeks 11-12: Testing & launch prep

**This is right-sized** for enterprise quality + maintainability.

---

## PROJECT_CONTEXT.md (Updated for Backend-First)

```markdown
# EEMB Website - Complete Context

## Tech Stack (REVISED)
**Backend:**
- Strapi 4.x (Headless CMS)
- PostgreSQL 14+ (Railway/Supabase)
- REST + GraphQL APIs
- Cloudinary (image CDN)

**Frontend:**
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS + Shadcn/ui
- React Query (data fetching)
- Vercel (hosting)

**Why This Stack:**
- ✅ Non-technical CMS admin panel
- ✅ Flexible content types (add fields without code changes)
- ✅ Role-based permissions
- ✅ Built-in media manager
- ✅ API auto-generated from content types
- ✅ Open source (no vendor lock-in)

## Key URLs (After Setup)
- **CMS Admin**: https://cms.eemb.ucsb.edu/admin
- **API**: https://cms.eemb.ucsb.edu/api
- **Frontend**: https://eemb.ucsb.edu
- **Staging**: https://staging.eemb.ucsb.edu

## Content Types (Primary)
1. **Faculty** - Complete profile management
2. **Alumni** - Full directory with spotlights
3. **Staff** - Administrative team
4. **Graduate Students** - Current cohort
5. **News Items** - Good News blog
6. **Events** - Calendar system
7. **In Memoriam** - Honored scholars
8. **Research Areas** - Taxonomy
9. **Labs** - Research groups
10. **Alumni Spotlights** - Featured stories

## Design Tokens
Colors:
- primary: #003660 (UCSB Navy)
- secondary: #FEBC11 (UCSB Gold)
- accent: #4A9EC6 (Ocean Blue)
- text: #333333
- background: #FFFFFF, #F5F5F5

Typography:
- headings: Inter (700)
- body: Open Sans (400, 600)
- spacing: 8px base unit

## Key Decisions
- CMS-first approach (not JSON files)
- PostgreSQL (not MongoDB) for relational integrity
- Separate backend/frontend deployments
- Staging environment required
- Alumni engagement = priority feature
- Non-technical admin training = success metric

## Directory Structure
```
eemb-website/
├── backend/        # Strapi CMS
├── frontend/       # Next.js app
├── scripts/        # Automation
├── docs/           # Documentation
└── infrastructure/ # Docker/config
```

## Common Commands
```bash
# Backend
cd backend && npm run develop    # Start Strapi dev
cd backend && npm run build      # Build for production

# Frontend
cd frontend && npm run dev       # Start Next.js dev
cd frontend && npm run build     # Build static site

# Testing
npm run test                     # Run all tests
npm run lighthouse               # Performance audit

# Deployment
./scripts/deploy/deploy.sh staging
./scripts/deploy/deploy.sh production
```

## Admin Users (To Create)
1. **Super Admin**: Chair (full access)
2. **Content Editor**: Andi (add/edit content)
3. **Contributor**: Faculty (can submit news)

## Critical Requirements
- All images must have alt text
- Mobile-first design
- <3 second page loads
- WCAG 2.1 AA compliance
- Alumni privacy controls
- UC branding adherence

## Chair's Three Priorities
1. ✅ Updated DEI section (link to diversity microsite)
2. ✅ In Memoriam page (5 scholars, expandable)
3. ✅ Good News blog (professional transformation)

## PLUS: Alumni Platform
4. ✅ Alumni directory (searchable, privacy-aware)
5. ✅ Alumni spotlights (career stories)
6. ✅ Giving integration (track development)

---

## Data Relationships (Key to Understand)
```
Faculty
├── has many → Graduate Students (advisor)
├── has many → Alumni (former advisor)
├── belongs to many → Research Areas
├── has one → Lab
└── referenced by → News Items (featured person)

Alumni
├── belongs to → Faculty (advisor)
├── belongs to → Research Area
├── has many → Alumni Spotlights
└── has one → Giving Record

News Items
├── references many → Faculty
├── references many → Alumni
├── belongs to many → Research Areas
└── has one → Featured Image

Events
├── has many → Speakers (Faculty/External)
└── organized by → Faculty
```

Understanding these relationships is critical for:
- Building Strapi content types correctly
- Creating frontend queries
- Maintaining data integrity
```

---

## PHASE 0: Pre-Development (Week 0)

### Environment Setup

**Local Development Requirements:**
```bash
# Required installations
node --version      # v18+
npm --version       # v9+
python --version    # v3.11+
git --version       # v2.30+
docker --version    # v20+ (optional but recommended)
```

**Install Tools:**
```bash
# Strapi CLI
npm install -g @strapi/strapi

# Vercel CLI
npm install -g vercel

# Database tools
brew install postgresql  # macOS
```

**Create Accounts:**
1. ✅ Railway.app (backend hosting)
2. ✅ Supabase (database - free tier fine for dev)
3. ✅ Cloudinary (images - free tier: 25GB)
4. ✅ Vercel (frontend - free for edu)
5. ✅ GitHub (repo hosting)

### Repository Initialization

```bash
# Create repo
mkdir eemb-website
cd eemb-website
git init
git remote add origin [your-github-url]

# Create structure
mkdir -p backend frontend scripts docs infrastructure
mkdir -p scripts/{scraping,migration,maintenance,deployment}
mkdir -p docs/{api,admin,content,developer}
mkdir -p infrastructure/{docker,nginx}

# Initial commit
cp PROJECT_CONTEXT.md ./
git add .
git commit -m "Initial repository structure"
git push origin main
```

---

## PHASE 1: Backend Foundation (Weeks 1-3)

### WEEK 1: Strapi Setup & Core Content Types

#### Day 1: Strapi Installation & Configuration

**Claude Prompt 1:**
```
Initialize a new Strapi 4.x project in the /backend directory with:
- TypeScript
- PostgreSQL database
- Custom configuration for UCSB deployment
- Example .env.example file with all required variables
```

**Execute:**
```bash
cd backend
npx create-strapi-app@latest . --typescript --no-run

# Follow prompts:
# Database: PostgreSQL
# Install dependencies: Yes
# Start project: No (we'll configure first)
```

**Claude Prompt 2:**
```
Create /backend/.env with:
- Database connection (local PostgreSQL for dev)
- Admin JWT secret
- API token salt
- Transfer token salt
- Cloudinary configuration placeholder
Show me the complete .env.example
```

**Start Strapi:**
```bash
npm run develop
# Opens http://localhost:1337/admin
# Create admin user (save credentials in 1Password)
```

#### Day 2-3: Faculty Content Type

**Claude Prompt 3:**
```
Create a Strapi content type "Faculty" with these fields:

Text fields (single line):
- slug (required, unique, URL-safe)
- firstName (required)
- lastName (required)
- preferredName
- pronouns (short text)
- title (required)
- email (required, email format)
- phone
- officeLocation
- departmentRole (enumeration: chair, vice-chair, grad-advisor, none)

Text fields (long):
- bioShort (text, 500 chars)
- bioLong (rich text editor)

URLs:
- labWebsiteUrl
- personalWebsiteUrl
- googleScholarUrl
- orcid

Arrays:
- researchInterests (text array)

Relations:
- researchAreas (many-to-many with ResearchArea)
- advisedStudents (one-to-many with GraduateStudent)
- advisedAlumni (one-to-many with Alumni)

Media:
- photo (single image)
- cvDocument (single file)

Enumeration:
- status (active, emeritus, on-leave, deceased) default: active

Boolean:
- isDeceased (default: false)
- isFeatured (default: false)

Dates:
- startDate
- endDate

Number:
- displayOrder (integer, default: 0)

Enable Draft/Publish system.
Enable Internationalization: No (English only for now)

API Settings:
- Enable find, findOne, create, update, delete
- Public read access
- Authenticated write access
```

**Validation:**
```bash
# In Strapi admin:
1. Go to Content-Type Builder
2. Verify Faculty type exists with all fields
3. Create test faculty entry
4. Check API: http://localhost:1337/api/faculty
   (should return JSON)
```

#### Day 4-5: Alumni Content Type (NEW - Critical)

**Claude Prompt 4:**
```
Create Strapi content type "Alumni" with these fields:

Text (single):
- slug (required, unique)
- firstName (required)
- lastName (required)
- preferredName
- pronouns
- currentPosition
- currentEmployer
- currentLocation

Enumeration:
- degreeType (PhD, MS, BS, Postdoc)
- givingLevel (none, friend, supporter, patron, benefactor)
- visibility (public, alumni-only, private) default: public

Number:
- graduationYear (required)

Text (long):
- dissertationTitle
- bioShort (500 chars)
- bioLong (rich text)
- achievements (rich text)

Relations:
- advisor (many-to-one with Faculty)
- researchArea (many-to-one with ResearchArea)

URLs:
- email (optional, privacy-protected)
- linkedinUrl
- personalWebsite

Media:
- photo (single image)

Booleans:
- allowPublicContact (default: false)
- isFeatured (default: false)
- willingToMentor (default: false)
- willingToSpeak (default: false)
- newsletterSubscriber (default: false)

Number:
- totalGivingAmount (decimal)

Dates:
- lastGiftDate
- lastContactDate

Enable Draft/Publish.
API: Public read (filtered by visibility), authenticated write.
```

#### Day 6-7: Remaining Core Content Types

**Create in order (similar prompts):**
1. **Staff** (simplified Faculty without research)
2. **GraduateStudent** (with advisor relation)
3. **InMemoriam** (similar to Faculty but historical)
4. **ResearchArea** (taxonomy)
5. **Lab** (with PI relation)

**Validation Checklist:**
```
After each content type:
✅ Check in Content-Type Builder (correct fields)
✅ Add sample entry in Content Manager
✅ Test API endpoint (http://localhost:1337/api/[content-type])
✅ Verify relations work (e.g., Faculty → Students)
✅ Commit to Git
```

---

### WEEK 2: News, Events & Media Management

#### Day 1-2: News Items Content Type

**Claude Prompt:**
```
Create "News Item" content type with:

Text:
- title (required, 200 chars)
- slug (unique, auto-generate from title)
- excerpt (500 chars)

Rich Text:
- content (full article, supports markdown)

Enumeration:
- category (publication, award, grant, presentation, community, media, student_achievement)
- status (draft, published, archived) default: draft

Array:
- tags (text array)

Relations:
- featuredPeople (many-to-many with Faculty AND Alumni)
  // Note: May need component for polymorphic relation
- featuredLabs (many-to-many with Lab)
- researchAreas (many-to-many with ResearchArea)

Media:
- featuredImage (single, required)
- additionalImages (multiple)

Text (optional):
- featuredImageCaption
- journalName (for publications)
- publicationDoi
- publicationUrl

JSON:
- externalLinks (repeatable component: url, title, type)

Booleans:
- featured (highlight on homepage)
- includeInQuarterly (for digest)

Dates:
- datePublished (required)
- dateSubmitted

Number:
- viewCount (integer, default: 0)

API: Public read for published, authenticated write
Enable Draft/Publish
```

#### Day 3: Events Content Type

**Claude Prompt:**
```
Create "Event" content type with:

Text:
- title (required)
- slug (unique)
- location
- room
- virtualLink (URL)

Rich Text:
- description

DateTime:
- startDatetime (required)
- endDatetime

Booleans:
- allDay (default: false)
- recurring (default: false)
- isHybrid (default: false)
- requiresRegistration (default: false)
- isFeatured (default: false)

Text:
- registrationLink (URL)
- recurrenceRule (text, iCal format)

Enumeration:
- eventType (seminar, workshop, symposium, social, deadline)
- status (scheduled, cancelled, completed)

Array:
- targetAudience (text array: graduate-students, faculty, postdocs, public)

Component (repeatable):
- speakers (name, affiliation, bio, photo)

Relations:
- organizer (many-to-one with Faculty)

Number:
- maxCapacity (integer)

Media:
- featuredImage

API: Public read, authenticated write
```

#### Day 4-5: Alumni Spotlight Content Type (NEW)

**Claude Prompt:**
```
Create "Alumni Spotlight" content type:

Relation:
- alumni (many-to-one with Alumni) required

Text:
- title (required, 200 chars)
- slug (unique)

Rich Text:
- interviewContent (Q&A format, supports markdown)

Enumeration:
- spotlightType (career-achievement, research-impact, giving-back)

Media:
- featuredImage (required)
- additionalPhotos (multiple)

Booleans:
- isFeatured (default: true)

DateTime:
- datePublished

Number:
- displayOrder (integer)

API: Public read, authenticated write
Enable Draft/Publish
```

#### Day 6-7: Media Library Configuration

**Cloudinary Integration:**

**Claude Prompt:**
```
Configure Strapi to use Cloudinary for media storage:
1. Install @strapi/provider-upload-cloudinary
2. Update /backend/config/plugins.js
3. Add Cloudinary credentials to .env
4. Configure auto-optimization (WebP, quality: 80)
5. Set up folders: faculty, alumni, news, events, research
```

**Test Media Upload:**
```bash
# In Strapi admin:
1. Go to Media Library
2. Upload test image
3. Verify it appears in Cloudinary dashboard
4. Check that URL is cloudinary.com (not local)
5. Test image transformations (resize, crop)
```

---

### WEEK 3: Permissions, Roles & API Testing

#### Day 1-2: User Roles & Permissions

**Create Roles in Strapi Admin:**

```
1. Super Admin (you)
   ✅ All permissions
   ✅ Access to all content types
   ✅ Can manage users

2. Content Editor (Andi)
   ✅ Faculty: create, read, update, delete, publish
   ✅ Alumni: create, read, update, delete, publish
   ✅ Staff: create, read, update, delete, publish
   ✅ Graduate Students: create, read, update, delete, publish
   ✅ News Items: create, read, update, delete, publish
   ✅ Events: create, read, update, delete, publish
   ✅ In Memoriam: create, read, update, delete, publish
   ✅ Alumni Spotlights: create, read, update, delete, publish
   ✅ Media Library: upload, read, delete
   ❌ Users/Roles: no access
   ❌ Settings: no access

3. Contributor (Faculty)
   ✅ News Items: create, read (own only)
   ✅ Events: create, read
   ✅ Media Library: upload (own only)
   ❌ Faculty: read only (cannot edit)
   ❌ All other content types: read only

4. Public (unauthenticated API access)
   ✅ All content types: read only (published only)
   ❌ Cannot see drafts
   ❌ Cannot write
```

**Test Permissions:**
```bash
# Create test users for each role
# Try accessing /admin with each
# Verify restricted access works
```

#### Day 3-4: API Documentation & Testing

**Claude Prompt:**
```
Create /docs/api/API_REFERENCE.md documenting:

For each content type (Faculty, Alumni, News, etc.):
- GET /api/[content-type] (list all, with filters)
- GET /api/[content-type]/:id (single item)
- POST /api/[content-type] (create, authenticated)
- PUT /api/[content-type]/:id (update, authenticated)
- DELETE /api/[content-type]/:id (delete, authenticated)

Include example requests with curl:
- Get all faculty: curl http://localhost:1337/api/faculty?populate=*
- Get faculty by research area
- Get featured news items
- Get alumni by graduation year

Document query parameters:
- populate (relations)
- filters
- sort
- pagination
```

**Test All Endpoints:**
```bash
# Install HTTP client
npm install -g httpie

# Test endpoints
http GET localhost:1337/api/faculty
http GET localhost:1337/api/alumni?filters[graduationYear][$eq]=2020
http GET localhost:1337/api/news-items?filters[featured][$eq]=true&populate=*
```

#### Day 5-7: Data Migration Scripts

**Claude Prompt:**
```
Create /scripts/scraping/scrape_current_site.py that:
1. Scrapes existing eemb.ucsb.edu
2. Extracts:
   - Faculty profiles (name, title, email, bio, photo URL)
   - Staff directory
   - News items (if any)
   - Research area descriptions
3. Saves to /data/scraped/faculty.json
4. Downloads all images to /data/scraped/images/
5. Validates data integrity

Use BeautifulSoup4 + requests
Handle errors gracefully
Log progress
```

**Claude Prompt:**
```
Create /scripts/migration/import_to_strapi.js that:
1. Reads /data/scraped/faculty.json
2. Uploads images to Strapi Media Library
3. Creates Faculty entries via Strapi API
4. Creates relations (research areas)
5. Logs success/failures
6. Handles duplicates (skip or update)

Use: axios, form-data, fs
Include progress bar (cli-progress)
```

**Execute Migration:**
```bash
# Scrape
python scripts/scraping/scrape_current_site.py

# Review scraped data
cat data/scraped/faculty.json | jq '.[] | {name, title}'

# Import to Strapi
cd scripts/migration
npm install
node import_to_strapi.js

# Verify in Strapi admin
# Check that Faculty entries exist with photos
```

---

## PHASE 2: Frontend Development (Weeks 4-7)

### WEEK 4: Next.js Setup & Design System

#### Day 1: Project Initialization

**Claude Prompt:**
```
Initialize Next.js 14 project in /frontend with:
- TypeScript
- App Router (not pages router)
- Tailwind CSS
- ESLint + Prettier
- Path aliases (@/components, @/lib, etc.)

Directory structure:
src/
├── app/
├── components/
├── lib/
└── styles/
```

**Execute:**
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --app --eslint
```

#### Day 2: Design System & Component Library

**Claude Prompt:**
```
Set up Shadcn/ui component library:
1. Install: npx shadcn-ui@latest init
2. Configure with UCSB colors in tailwind.config.js
3. Add components: button, card, input, select, dialog, dropdown-menu

Create /src/styles/globals.css with:
- UCSB color variables (navy, gold, ocean blue)
- Typography scale (Inter headings, Open Sans body)
- Spacing system (8px base unit)
- Responsive breakpoints
```

**Tailwind Config:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        navy: '#003660',
        gold: '#FEBC11',
        ocean: {
          light: '#4A9EC6',
          deep: '#1B5E7E'
        }
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        heading: ['Inter', 'sans-serif']
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      }
    }
  }
}
```

#### Day 3: API Client & Data Fetching

**Claude Prompt:**
```
Create /src/lib/api.ts with functions to fetch from Strapi:

- getFaculty(filters?: object): Promise<Faculty[]>
- getFacultyBySlug(slug: string): Promise<Faculty>
- getAlumni(filters?: object): Promise<Alumni[]>
- getNewsItems(filters?: object): Promise<NewsItem[]>
- getEvents(filters?: object): Promise<Event[]>

Use fetch with:
- Base URL from env variable
- Populate relations (e.g., ?populate[researchAreas]=*)
- Error handling
- TypeScript interfaces for responses

Also create /src/lib/types.ts with TypeScript interfaces matching Strapi content types.
```

#### Day 4-5: Core Layout Components

**Create in order:**

**1. Navigation**
```
Claude: Create /src/components/layout/Navigation.tsx

Desktop:
- Horizontal nav bar (UCSB navy background)
- Dropdowns for: People, Research, Programs, News
- Logo (left), CTAs (right): "Apply" + "Give"

Mobile:
- Hamburger menu icon
- Full-screen overlay navigation
- Smooth animations

Use Shadcn dropdown-menu component
```

**2. Footer**
```
Claude: Create /src/components/layout/Footer.tsx

Three columns:
- Quick Links (DEI, GSAC, Support, Safety)
- Contact (address, phone, email)
- Social Media (icons with links)

Include:
- UC Santa Barbara logo
- Copyright notice
- Accessibility statement link
- Privacy policy link
```

**3. Hero Component**
```
Claude: Create /src/components/Hero.tsx

Full-width banner:
- Background image with overlay (dark gradient)
- Centered text: h1 + subtitle
- Two CTA buttons
- Responsive (full height desktop, shorter mobile)
- Optimized next/image
```

#### Day 6-7: Homepage

**Claude Prompt:**
```
Create /src/app/page.tsx (homepage):

Structure:
1. Hero section
   - Rotating taglines:
     * "Advancing ocean science from genes to ecosystems"
     * "Pioneering marine biology at the ocean's edge"
     * "Ecology, evolution, and conservation for a changing world"
   - CTAs: "Apply to Graduate Program" | "Explore Our Research"

2. Four Audience Modules (card grid)
   - Prospective Grad Students
   - Research Excellence
   - Faculty Opportunities
   - Community Engagement
   Each card: image, heading, brief text, CTA link

3. Latest News (3 featured items)
   - Fetch from API: getNewsItems({featured: true, limit: 3})
   - NewsCard component (create separately)
   - "View All News" button

4. Upcoming Events (next 3)
   - Fetch from API: getEvents({upcoming: true, limit: 3})
   - EventCard component
   - "View Calendar" button

5. Quick Stats (optional, if data available)
   - Faculty count
   - Graduate students
   - Research areas
   - Alumni network size

Fully responsive, optimized images, accessible.
```

---

### WEEK 5: People Pages (Faculty, Alumni, Staff)

#### Day 1-2: Faculty Directory & Profiles

**Claude Prompt 1:**
```
Create /src/components/cards/FacultyCard.tsx:

Props: faculty (Faculty type)

Display:
- Photo (rounded, 200x200)
- Name (preferred name, bold)
- Title (below name)
- Research areas (colored badges)
- Email icon (mailto link)
- "View Profile" link to /people/faculty/[slug]

Card styling:
- White background
- Subtle shadow
- Hover: lift effect (shadow increase)
- Fully responsive
```

**Claude Prompt 2:**
```
Create /src/app/people/faculty/page.tsx (directory):

Features:
1. Filter panel (left sidebar desktop, top mobile)
   - Research area checkboxes (Ecology, Evolution, Marine Biology)
   - Status radio buttons (All, Active, Emeritus)
   - Search input (filter by name)

2. Results grid (right/main area)
   - 3 columns desktop, 2 tablet, 1 mobile
   - FacultyCard components
   - Show count (e.g., "Showing 42 faculty")
   - Sort dropdown (Last Name, Research Area)

3. State management
   - useState for filters
   - useEffect to fetch from API with filter params
   - Loading skeleton while fetching

Fetch: getFaculty() with filters
```

**Claude Prompt 3:**
```
Create /src/app/people/faculty/[slug]/page.tsx (individual profile):

Layout (two-column desktop, stacked mobile):

Left Column:
- Large photo (400x400)
- Contact card:
  * Email (with icon, mailto)
  * Phone
  * Office location
- Links:
  * Lab Website
  * Google Scholar
  * Personal Site
- Research Areas (badges)

Right Column:
- Name (h1)
- Title
- Bio (rich text, bioLong)
- Research Interests (bulleted list)
- Current Graduate Students (if any, links to their pages)
- Recent News (filtered by this faculty member)

Fetch: getFacultyBySlug(params.slug)
Use Next.js generateStaticParams for all faculty slugs
```

**Validation:**
```bash
npm run dev
# Visit http://localhost:3000/people/faculty
# Test filters (research area, search)
# Click a faculty card
# Verify individual page loads with correct data
# Test on mobile viewport
```

#### Day 3-4: Alumni Directory & Spotlights (NEW)

**Claude Prompt 4:**
```
Create /src/components/cards/AlumniCard.tsx:

Props: alumni (Alumni type)

Display:
- Photo (circular, 150x150)
- Name (preferred name)
- Degree & Year (e.g., "PhD '18")
- Current Position (e.g., "Assistant Professor, MIT")
- "View Profile" link (if visibility = public)

Conditional rendering:
- Show email icon only if allowPublicContact = true
- Show "Featured" badge if isFeatured = true
```

**Claude Prompt 5:**
```
Create /src/app/people/alumni/page.tsx:

Three sections (tabs or stacked):

1. Alumni Directory
   - Filter panel:
     * Degree type (PhD, MS, BS, Postdoc)
     * Graduation year (decade select: 1980s, 1990s, 2000s, 2010s, 2020s)
     * Research area
     * Location (text search)
   - Grid of AlumniCard components
   - Privacy: only show alumni with visibility = "public"
   - Sort: Graduation year (desc default)

2. Featured Alumni Spotlights
   - Large cards with interview excerpts
   - Link to full spotlight page
   - Filter by spotlightType

3. Give Back Section
   - Statistics: Total alumni, Countries represented, Top employers
   - Engagement options:
     * Update your info (form)
     * Mentor current students (link)
     * Make a gift (link to giving page)

Fetch: getAlumni() with filters
```

**Claude Prompt 6:**
```
Create /src/app/people/alumni/spotlights/[slug]/page.tsx:

Layout:
- Hero section:
  * Featured image (full width, 1920x600)
  * Alumni name & headline overlay

- Interview content:
  * Q&A format (rich text with styling)
  * Pull quotes (highlighted, large text)
  * Additional photos (gallery)

- Sidebar:
  * Alumni quick facts (degree, year, advisor)
  * Current position
  * Contact (if allowed)
  * "See all spotlights" link

Fetch: getAlumniSpotlight(params.slug)
```

#### Day 5: Staff & Graduate Students

**Claude Prompt 7:**
```
Create /src/app/people/staff/page.tsx:

Simple directory (no heavy filtering needed):
- Grouped by roleCategory:
  * Administration
  * Academic Support
  * Facilities
  * Computing

Each group:
- StaffCard component (name, title, photo, email, phone)
- Sorted by displayOrder then lastName

Simpler than faculty directory (staff changes less frequently)
```

**Claude Prompt 8:**
```
Create /src/app/people/students/page.tsx:

Graduate students directory:
- Grouped by program (PhD, MS)
- Within group, sorted by year entered
- StudentCard component:
  * Name, photo
  * Year entered
  * Advisor (link to faculty page)
  * Research area
  * Email

Optional: Add "Find a mentor" CTA (for prospective students)
```

#### Day 6-7: In Memoriam Page

**Claude Prompt 9:**
```
Create /src/app/people/in-memoriam/page.tsx:

Respectful, elegant design:
- Introduction paragraph explaining purpose
- Filter/Sort:
  * All / Faculty / Emeriti / Affiliates
  * Sort by: Death Year (recent first) or Alphabetical

- Memorial cards (grid):
  * Photo (grayscale or sepia effect)
  * Name, title
  * Years (1940-2018)
  * Brief excerpt (150 chars from biography)
  * "Read Full Memorial" link

- Styling: Muted colors, serif font for body text, respectful spacing

Fetch: getInMemoriam()
```

**Claude Prompt 10:**
```
Create /src/app/people/in-memoriam/[slug]/page.tsx:

Individual memorial page:

Layout (single column, centered, max-width 800px):

1. Header
   - Photo (large, centered)
   - Name (h1, serif font)
   - Title
   - Years (birth-death)

2. Biography Section
   - Rich text content
   - Academic achievements
   - Research contributions

3. Personal Remembrance
   - Colleague quotes (blockquote styling)
   - Anecdotes
   - Teaching legacy

4. Legacy Section
   - Continuing influence
   - Named awards/facilities
   - Publications highlight

5. External Links
   - Chancellor's memorial
   - Academic society tributes
   - Memorial service info

Fetch: getInMemoriamBySlug(params.slug)
```

---

### WEEK 6: Research & Programs Pages

#### Day 1-2: Research Area Pages

**Claude Prompt:**
```
Create /src/app/research/[area]/page.tsx:

Dynamic route for: ecology, evolution, marine-biology

Layout:
1. Hero section
   - Representative image (specific to area)
   - Area name (h1)
   - Tagline

2. Overview
   - Description (rich text)
   - Key themes (bulleted)

3. Faculty in this area
   - Grid of FacultyCard components
   - Filter: getFaculty({researchArea: params.area})

4. Associated Labs
   - Lab cards (name, PI, focus, link)

5. Recent Research Highlights
   - News items tagged with this research area
   - Publications (if available)

6. Field Sites (if applicable)
   - Mo'orea LTER, SBC LTER, etc.

Use generateStaticParams for three areas
```

#### Day 3: Labs Directory

**Claude Prompt:**
```
Create /src/app/research/labs/page.tsx:

Grid of lab cards:
- Lab name
- PI name & photo
- Research focus (brief)
- Website link (external)
- Current members count

Filter by research area
Sort alphabetically

Fetch: getLabs()
```

#### Day 4-5: Graduate Program Pages

**Claude Prompt:**
```
Create /src/app/programs/graduate/page.tsx:

Sections:
1. Overview
   - Why EEMB UCSB
   - World-class research opportunities
   - Coastal California location

2. Degree Programs (tabs or accordion)
   - PhD Program
     * Requirements
     * Timeline (5-6 years)
     * Funding guarantee
     * Application process
   - MS Program
     * Requirements
     * Timeline (2 years)
     * Funding options

3. Application Information
   - Deadline: December 1 (highlighted)
   - Requirements checklist
   - GRE (if required)
   - Letters of recommendation
   - Statement of purpose tips
   - Apply button (CTA, links to UC application portal)

4. Student Resources
   - PhD Handbook (PDF link)
   - MS Handbook (PDF link)
   - FAQs
   - Contact grad advisor

5. Current Students section
   - Testimonials (quotes)
   - Photos from field work
   - "Meet Our Students" link

Content: Mix of Strapi CMS (editable sections) + static (handbooks)
```

#### Day 6-7: About & DEI Pages

**Claude Prompt:**
```
Create /src/app/about/dei/page.tsx:

Structure:
1. Overview
   - EEMB's commitment to diversity
   - Current initiatives

2. DEI Committee
   - Committee structure (from Strapi content type)
   - Member photos & roles
   - Co-chairs: Deron & Cherie (highlighted)
   - Contact committee (email link)

3. Programs & Resources
   - FUERTE program (link to microsite)
   - Recruitment efforts
   - Support services
   - Reporting mechanisms

4. External Link (prominent CTA)
   - "Visit our full DEI website" → diversity.eemb.ucsb.edu
   - Opens in new tab

5. Recent DEI News
   - Filter news items by DEI tag

Fetch: getDEICommittee(), getNewsItems({tags: 'dei'})

Note: This is overview page, not full DEI site (that's separate microsite)
```

---

### WEEK 7: News & Events

#### Day 1-3: Good News Blog

**Claude Prompt 1:**
```
Create /src/components/cards/NewsCard.tsx:

Props: newsItem (NewsItem type)

Display:
- Featured image (16:9 ratio, 600x400)
- Category badge (colored, top-left on image)
- Date (formatted: Nov 7, 2025)
- Title (h3, 2 line clamp)
- Excerpt (3 line clamp)
- "Read More" link

Badge colors by category:
- publication: blue
- award: gold
- grant: green
- community: teal
- media: red
```

**Claude Prompt 2:**
```
Create /src/app/news/page.tsx:

Layout:
1. Header
   - Title: "Good News Digest"
   - Subtitle: "Celebrating achievements, publications, and milestones"
   - Subscribe button (links to newsletter form)

2. Filter Tabs (horizontal, sticky on scroll)
   - All
   - Publications
   - Awards & Honors
   - Grants
   - Community
   - Media Coverage
   - Student Achievements

3. Featured Section (if any featured = true)
   - Large card (full width or 2-col)
   - Most recent featured item

4. News Grid
   - 3 columns desktop, 2 tablet, 1 mobile
   - NewsCard components
   - Pagination (10 per page) or Load More button

5. Sidebar (desktop only)
   - Upcoming Events (next 3)
   - Submit Good News (link to Google Form)
   - Quarterly Digest (PDF download)

Fetch: getNewsItems() with category filter
State management: useState for activeCategory
```

**Claude Prompt 3:**
```
Create /src/app/news/[slug]/page.tsx:

Layout:
1. Header
   - Category badge
   - Date
   - Title (h1)

2. Featured Image
   - Full width (1200x675)
   - Caption below

3. Article Content
   - Rich text (bioLong)
   - Proper typography (readable line length, generous spacing)
   - Pull quotes if any

4. Metadata Section
   - Featured Faculty (links to profiles)
   - Research Areas (links)
   - External Links (publication DOI, etc.)
   - Tags

5. Share Section
   - Share buttons (Email, Twitter, LinkedIn)

6. Related News
   - 3 related items (same category or research area)

Fetch: getNewsItemBySlug(params.slug)
Generate metadata for SEO
```

#### Day 4-5: Events Calendar

**Claude Prompt 4:**
```
Create /src/app/events/page.tsx:

Two views (toggle):
1. Calendar View
   - Month calendar (use library: react-big-calendar)
   - Events as dots/blocks
   - Click to see details popup

2. List View (default)
   - Grouped by month
   - EventCard components
   - Filter by eventType:
     * All
     * Seminars
     * Workshops
     * Symposia
     * Social Events

Each event card:
- Date & time (formatted)
- Title
- Location (or "Virtual")
- Brief description
- "Add to Calendar" button (.ics download)
- RSVP link (if requiresRegistration)

Fetch: getEvents({status: 'scheduled', startDatetime: {$gte: new Date()}})
Sort by startDatetime ascending
```

#### Day 6-7: Forms & Interactivity

**Claude Prompt 5:**
```
Create /src/app/contact/page.tsx:

Contact form:
- Name (required)
- Email (required, validated)
- Subject dropdown (General Inquiry, Graduate Admissions, Faculty Position, Media, Other)
- Message (textarea, required)
- Submit button

On submit:
- POST to Strapi (or email service like SendGrid)
- Show success message
- Clear form

Include:
- Department contact info (sidebar)
- Map (Google Maps embed of UCSB campus)
- Directions
- Parking info
```

**Claude Prompt 6:**
```
Create /src/components/SearchBar.tsx:

Global search component:
- Input field (prominent)
- Search icon
- Autocomplete dropdown
  * Searches: Faculty names, Alumni, News titles, Pages
  * Shows category badges
  * Click to navigate

Implement with:
- Debounced input (wait 300ms after typing)
- Fetch from Strapi search API or use Algolia
- Keyboard navigation (arrow keys, enter)

Place in: Navigation component (desktop) & mobile menu
```

---

## PHASE 3: Admin Interface & Training (Weeks 8-10)

### WEEK 8: Admin Dashboard Enhancements

#### Day 1-3: Custom Strapi Admin Panels

**Claude Prompt:**
```
Create custom Strapi admin widgets in /backend/src/admin/app.js:

1. Welcome Dashboard
   - Quick stats:
     * Total faculty (with +/- since last month)
     * Pending news items (draft status)
     * Upcoming events (next 7 days)
     * Recent alumni submissions
   - Quick actions:
     * Add Faculty
     * Add News Item
     * Add Event
     * View Media Library

2. Shortcuts Panel
   - Common tasks:
     * Faculty directory
     * Alumni directory
     * In Memoriam
     * News items (filter: published, drafts)
     * Events (upcoming)

3. Recent Activity Feed
   - Last 10 content updates (any type)
   - Show: timestamp, user, action, content type

Use Strapi's admin panel API to inject custom components
```

#### Day 4-5: Form Submission Management

**Claude Prompt:**
```
Create Strapi content type "FormSubmission":

Fields:
- formType (enumeration: good-news, contact, alumni-update)
- submitterName
- submitterEmail
- submissionData (JSON - flexible for different form types)
- status (new, reviewed, processed, archived)
- notes (text, for admin comments)
- dateSubmitted (auto)
- processedBy (relation to User)
- dateProcessed

API: Authenticated read/write only

Create view in admin panel:
- List of submissions
- Filter by formType and status
- Quick actions: Mark as Reviewed, Archive
- Click to expand and see full data
```

**Google Forms Integration:**
```javascript
// /backend/src/api/form-submission/content-types/form-submission/lifecycles.js

module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // Send notification email to content coordinator
    if (result.formType === 'good-news') {
      await strapi.plugins['email'].services.email.send({
        to: process.env.CONTENT_COORDINATOR_EMAIL,
        subject: 'New Good News Submission',
        text: `New submission from ${result.submitterName}: ${result.submissionData.title}`
      });
    }
  }
};
```

#### Day 6-7: Bulk Operations & Import Tools

**Claude Prompt:**
```
Create admin plugin for bulk operations:

Features:
1. Bulk Import Faculty (CSV)
   - Upload CSV with columns: firstName, lastName, email, title, bio
   - Preview before import
   - Map CSV columns to Strapi fields
   - Validate data
   - Import with progress bar
   - Report: X created, Y updated, Z errors

2. Bulk Update
   - Select multiple items (checkboxes)
   - Change status, add tags, update research area
   - Confirm before applying

3. Bulk Export
   - Export content type to CSV
   - Choose fields to include
   - Download

Implement as Strapi admin plugin in /backend/src/plugins/bulk-operations/
```

---

### WEEK 9: Documentation & Training Materials

#### Day 1-2: Admin Handbook

**Create comprehensive documentation:**

**File: /docs/admin/ADMIN_HANDBOOK.md**

```markdown
# EEMB Website - Admin Handbook
## Complete Guide for Content Management

### Table of Contents
1. Getting Started
2. Managing Faculty
3. Managing Alumni
4. Managing News & Events
5. Media Library
6. Forms & Submissions
7. Troubleshooting
8. Contact for Help

---

## 1. Getting Started

### Logging In
1. Go to https://cms.eemb.ucsb.edu/admin
2. Enter your email and password
3. Click "Sign In"

If you forgot your password: [password reset link]

### Dashboard Overview
[Screenshot of dashboard with labels]

Your dashboard shows:
- Quick stats (faculty count, pending news)
- Recent activity
- Quick action buttons

---

## 2. Managing Faculty

### Adding New Faculty (5-Minute Process)

**Step 1: Navigate to Faculty**
- Click "Faculty" in left sidebar
- Click "Create new entry" button (top right)

**Step 2: Fill Required Fields**
[Screenshots for each step]

- First Name: Enter first name (e.g., "Jane")
- Last Name: Enter last name (e.g., "Smith")
- Email: Enter UCSB email (e.g., "jsmith@ucsb.edu")
- Title: Enter title (e.g., "Associate Professor")

**Step 3: Upload Photo**
- Click "Add new assets" in Photo field
- Drag & drop photo OR click to browse
- Photo requirements:
  * Minimum: 400x400 pixels
  * Format: JPG or PNG
  * File size: Under 5MB
  * Professional headshot preferred
- Click "Upload"
- Add alt text (e.g., "Professor Jane Smith headshot")

**Step 4: Add Biography**
- Bio Short: 1-2 sentences (max 500 characters)
  Example: "Jane Smith studies coral reef ecology and climate change impacts on marine ecosystems."

- Bio Long: Full biography (use rich text editor)
  Tips:
  * Keep paragraphs short (3-4 sentences)
  * Use bullet points for research interests
  * Include awards/honors
  * Mention lab website

**Step 5: Select Research Areas**
- Check applicable boxes:
  ☐ Ecology
  ☐ Evolution
  ☐ Marine Biology
- Can select multiple

**Step 6: Add URLs (Optional)**
- Lab Website: Full URL (https://...)
- Personal Website: If applicable
- Google Scholar: Profile URL

**Step 7: Set Status**
- Status: Select "Active" (default)
- Start Date: Enter hire date

**Step 8: Publish**
- Click "Save" (top right) to save as draft
- OR click "Publish" to make live immediately

✅ Done! New faculty member will appear on website within 5 minutes.

### Updating Existing Faculty
1. Go to Faculty list
2. Find faculty member (use search)
3. Click to open
4. Make changes
5. Click "Publish" to save

Common updates:
- New photo: Upload in Photo field
- Title change: Edit Title field
- Retirement: Change Status to "Emeritus"

### Removing Faculty (Retirement or Departure)
❌ Do NOT delete faculty entries!

**For Retirement:**
1. Open faculty profile
2. Change Status to "Emeritus"
3. Add End Date (retirement date)
4. Publish

Effect: Faculty moved to "Emeritus" section, profile page preserved

**For Deceased Faculty:**
1. Change Status to "Deceased"
2. Check "Is Deceased" checkbox
3. Create corresponding "In Memoriam" entry (see section 6)

---

## 3. Managing Alumni

### Adding Alumni

**From Form Submission:**
1. Go to "Form Submissions"
2. Filter by Type: "Alumni Update"
3. Click submission to review
4. Click "Create Alumni Entry" button
5. Pre-filled form opens
6. Verify data, make any edits
7. Publish

**Manual Entry:**
1. Go to "Alumni"
2. Click "Create new entry"
3. Fill fields:
   - Name (required)
   - Degree Type: PhD, MS, BS, or Postdoc
   - Graduation Year (required)
   - Advisor: Select from faculty list
   - Current Position (if known)
   - Current Employer (if known)
4. Privacy Settings:
   - Visibility:
     * Public: Shown in directory (default if they opted in)
     * Alumni-Only: Only visible to logged-in alumni
     * Private: Not shown, internal record only
   - Allow Public Contact: Check if they agreed to share email
5. Upload photo (optional)
6. Add bio (optional)
7. Publish

### Alumni Spotlights

**Creating Featured Stories:**
1. Go to "Alumni Spotlights"
2. Click "Create new entry"
3. Select alumni from dropdown (must exist in alumni database)
4. Title: Catchy headline (e.g., "From UCSB to National Geographic")
5. Interview Content: Paste Q&A (use markdown)
6. Upload featured image (1200x675 recommended)
7. Spotlight Type: Career Achievement, Research Impact, or Giving Back
8. Check "Is Featured" to highlight on homepage
9. Publish

---

## 4. Managing News & Events

### Adding News Items (Good News)

**Step 1: Review Submission**
If submitted via form:
1. Go to "Form Submissions" → Filter: "Good News"
2. Click submission to review
3. Read original content (casual email style)

**Step 2: Transform to Professional**
[Show before/after example]

Before (Email):
"Check out Holly's new paper in Nature! So exciting!"

After (Website):
Title: "Moeller Publishes Groundbreaking Phytoplankton Study in Nature"
Excerpt: "Assistant Professor Holly Moeller's research reveals new mechanisms of symbiosis in marine phytoplankton, with implications for ocean productivity under climate change."

Tips:
- Active voice, present tense
- Lead with the achievement
- 8-12 word titles
- 150-character excerpts (2 sentences)
- Professional but not stuffy

**Step 3: Create News Item**
1. Go to "News Items" → "Create new entry"
2. Fill fields:
   - Title: Professional headline
   - Excerpt: Brief summary for cards
   - Content: Full article (300-500 words)
   - Category: Select (Publication, Award, Grant, etc.)
   - Tags: Add relevant (e.g., "coral reefs", "genomics")
3. Featured People: Select faculty/alumni from list
4. Featured Image:
   - Upload relevant photo
   - Add caption
   - Add alt text (describe image)
5. External Links:
   - Add publication DOI, press release URL, etc.
   - Click "Add component" for each link
6. Featured: Check if should be highlighted on homepage
7. Date Published: Set to today (or publication date)
8. Publish

**Step 4: Mark Submission as Processed**
1. Return to Form Submission
2. Status: Change to "Processed"
3. Add note: "Published as news item [link]"
4. Save

### Adding Events

1. Go to "Events" → "Create new entry"
2. Fill fields:
   - Title: Event name
   - Description: Details (who should attend, what to expect)
   - Start DateTime: Click calendar, select date & time
   - End DateTime: If applicable
   - Event Type: Seminar, Workshop, Symposium, or Social
   - Location: Building & room (or "Virtual")
   - Virtual Link: Zoom link if hybrid/online
3. Speakers (if applicable):
   - Click "Add component"
   - Name, affiliation, brief bio
4. Registration:
   - Check "Requires Registration" if needed
   - Add registration link
5. Upload featured image (optional)
6. Publish

Event will appear on calendar automatically.

---

## 5. Media Library

### Uploading Images

**Step 1: Navigate to Media Library**
- Click "Media Library" in left sidebar

**Step 2: Upload**
Method A: Drag & Drop
- Drag files from your computer into the upload area

Method B: Browse
- Click "Add new assets"
- Select files
- Click "Upload"

**Step 3: Add Metadata (Critical for Accessibility)**
For each image:
- Alt Text: Describe the image for screen readers
  * Good: "Professor Jane Smith examining coral samples in laboratory"
  * Bad: "IMG_1234" or blank
- Caption: Optional, for context
- Folder: Select category (Faculty, News, Research, Events)

**Step 4: Organize**
- Use folders to keep organized
- Add tags for easy searching later

### Image Best Practices

**File Specifications:**
- Faculty headshots: 400x400px minimum, square crop
- News featured images: 1200x675px (16:9 ratio)
- Hero images: 1920x800px minimum
- File format: JPG or PNG
- File size: Under 5MB (tool auto-compresses to 200KB)

**Photo Guidelines:**
- Use high-resolution originals
- Avoid stock photos when possible (use real EEMB photos)
- Ensure people photos have consent (use photo release form)
- Professional quality (in focus, good lighting)

### Finding Images Later

Use search:
- Search by filename, alt text, or tags
- Filter by folder
- Sort by upload date

---

## 6. Forms & Submissions

### Managing Form Submissions

**Good News Submissions:**
1. Weekly task: Review new submissions (Friday morning recommended)
2. Go to "Form Submissions" → Filter: "Good News" + Status: "New"
3. For each submission:
   - Read content
   - Decide: Website-worthy or internal-only?
   - If website:
     * Transform to professional style
     * Create News Item (see section 4)
     * Mark submission as "Processed"
   - If internal-only:
     * Mark as "Archived"
     * Add note explaining why

**Contact Form Submissions:**
1. Go to "Form Submissions" → Filter: "Contact"
2. Review daily
3. For each:
   - Read message
   - Respond via email
   - Mark as "Processed"
   - If needs follow-up, add note

**Alumni Update Submissions:**
1. Alumni fill out form to update their info
2. Review submissions
3. Options:
   - Update existing alumni entry
   - Create new alumni entry (if not in database)
   - Request more info (reply via email)

---

## 7. Troubleshooting

### Common Issues & Solutions

**Problem: Image won't upload**
- Check file size (max 5MB before compression)
- Check format (JPG, PNG, or WebP only)
- Try a different browser
- Clear browser cache

**Problem: Changes not showing on website**
- Did you click "Publish" (not just "Save")?
- Wait 5 minutes (CDN cache refresh time)
- Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on PC)
- If still not working, contact tech support

**Problem: Can't find content**
- Check filters (may be filtering out what you're looking for)
- Use search (top right)
- Check status (Draft vs Published)

**Problem: Accidentally deleted something**
- Don't panic! Contact tech support immediately
- We have daily backups (can restore)

**Problem: Forgot password**
- Go to login page
- Click "Forgot password?"
- Enter email
- Check inbox for reset link

---

## 8. Contact for Help

### Support Resources

**Documentation:**
- Admin Handbook: /docs/admin/
- Content Style Guide: /docs/content/
- Video Tutorials: [link to video playlist]

**Technical Support:**
- Email: [IT contact]
- Phone: [phone number]
- Office hours: Mon-Fri 9am-5pm

**Content Questions:**
- Contact: [Content Coordinator name]
- Email: [email]

**Emergency Issues:**
(Website down, security issue, data loss)
- Call: [emergency number]
- Email: [emergency email]

### Monthly Checklist

**Week 1:**
☐ Review faculty changes
☐ Update any status changes (retirements, new hires)
☐ Check for updated faculty photos

**Week 2:**
☐ Review Good News submissions
☐ Create 2-3 news posts
☐ Update events calendar

**Week 3:**
☐ Check alumni submissions
☐ Update alumni directory
☐ Review giving data

**Week 4:**
☐ Run broken link checker (email IT to run script)
☐ Review analytics report
☐ Archive old events

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Save | Cmd/Ctrl + S |
| Search | Cmd/Ctrl + K |
| Open media library | Cmd/Ctrl + M |
| Preview | Cmd/Ctrl + P |

---

**Questions?** Don't hesitate to ask! We're here to help.
```

#### Day 3-4: Video Tutorials

**Create screen recording tutorials (10-15 videos, 3-5 min each):**

1. ✅ **Logging into the CMS** (2 min)
2. ✅ **Dashboard Overview** (3 min)
3. ✅ **Adding a New Faculty Member** (5 min) - Most important!
4. ✅ **Updating Faculty Information** (3 min)
5. ✅ **Uploading and Managing Photos** (4 min)
6. ✅ **Creating a News Post** (5 min)
7. ✅ **Adding Events to the Calendar** (4 min)
8. ✅ **Managing Alumni Directory** (4 min)
9. ✅ **Creating an Alumni Spotlight** (4 min)
10. ✅ **Reviewing Form Submissions** (3 min)
11. ✅ **Media Library Organization** (3 min)
12. ✅ **Troubleshooting Common Issues** (3 min)

**Tools:**
- Loom or Camtasia (screen recording)
- Add captions (accessibility)
- Upload to private YouTube playlist
- Embed in admin dashboard

#### Day 5-7: Live Training Sessions

**Schedule with Andi (Content Coordinator):**

**Session 1: Introduction (1 hour)**
- Tour of admin dashboard
- Basic navigation
- Adding first faculty member together
- Q&A

**Session 2: Content Management (1.5 hours)**
- News post creation workflow
- Event calendar management
- Image upload and editing
- Practice exercises

**Session 3: Advanced Features (1 hour)**
- Alumni management
- Form submission review
- Bulk operations
- Tips and tricks

**Session 4: Maintenance & Troubleshooting (30 min)**
- Monthly checklist review
- Common issues
- When to call for help
- Q&A

**Follow-up:**
- Schedule check-in after 2 weeks
- Offer "office hours" for questions
- Create feedback form

---

### WEEK 10: Testing & Quality Assurance

#### Day 1-2: Automated Testing

**Frontend Tests:**

**Create: /frontend/tests/unit/components.test.tsx**
```typescript
import { render, screen } from '@testing-library/react';
import FacultyCard from '@/components/cards/FacultyCard';

describe('FacultyCard', () => {
  const mockFaculty = {
    slug: 'smith-jane',
    firstName: 'Jane',
    lastName: 'Smith',
    title: 'Associate Professor',
    email: 'jsmith@ucsb.edu',
    photoUrl: '/images/faculty/smith-jane.jpg',
    bioShort: 'Studies coral reefs',
    researchAreas: ['ecology', 'marine-biology']
  };

  it('renders faculty name', () => {
    render(<FacultyCard faculty={mockFaculty} />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays title', () => {
    render(<FacultyCard faculty={mockFaculty} />);
    expect(screen.getByText('Associate Professor')).toBeInTheDocument();
  });

  it('shows research area badges', () => {
    render(<FacultyCard faculty={mockFaculty} />);
    expect(screen.getByText('Ecology')).toBeInTheDocument();
    expect(screen.getByText('Marine Biology')).toBeInTheDocument();
  });

  it('links to faculty profile page', () => {
    render(<FacultyCard faculty={mockFaculty} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/people/faculty/smith-jane');
  });
});
```

**Run tests:**
```bash
cd frontend
npm run test
# Should see: ✓ All tests passed
```

#### Day 3-4: Accessibility Audit

**Tools:**
```bash
# Install axe DevTools
npm install -D @axe-core/cli

# Run audit on all pages
npx axe http://localhost:3000 --exit
npx axe http://localhost:3000/people/faculty --exit
npx axe http://localhost:3000/people/alumni --exit
# etc.
```

**Manual Testing Checklist:**
```
Keyboard Navigation:
☐ Tab through all interactive elements (links, buttons, forms)
☐ Focus indicators visible
☐ Skip navigation link works
☐ Dropdown menus keyboard accessible
☐ Modal dialogs trap focus

Screen Reader:
☐ Test with VoiceOver (Mac) or NVDA (Windows)
☐ All images have alt text
☐ Headings hierarchy correct (H1 → H2 → H3)
☐ ARIA labels on icons
☐ Form fields properly labeled
☐ Error messages announced

Color & Contrast:
☐ Text contrast ≥ 4.5:1 (use WebAIM contrast checker)
☐ Interactive elements ≥ 3:1
☐ Color not sole indicator (use icons too)

Responsive:
☐ Test on iPhone (Safari)
☐ Test on Android (Chrome)
☐ Test on iPad (Safari)
☐ Test on desktop (Chrome, Firefox, Safari, Edge)
☐ All features work on touch devices
```

#### Day 5: Performance Optimization

**Lighthouse Audit:**
```bash
npm run build
npm run start
npx lighthouse http://localhost:3000 --output html --output-path reports/lighthouse-homepage.html --view

# Repeat for key pages:
# /people/faculty
# /people/alumni
# /news
# /programs/graduate
```

**Target Scores:**
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

**Common Optimizations:**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['res.cloudinary.com'], // Your image CDN
    formats: ['image/avif', 'image/webp'],
  },

  // Enable compression
  compress: true,

  // Static export for best performance
  output: 'export',

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

#### Day 6-7: Cross-Browser & Device Testing

**Manual Testing Matrix:**

| Page | Chrome | Firefox | Safari | Edge | iOS Safari | Android Chrome |
|------|--------|---------|--------|------|------------|----------------|
| Homepage | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Faculty Directory | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Faculty Profile | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Alumni Directory | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| News Feed | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| News Article | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Events | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Programs | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Contact | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

**Test in each:**
- Layout renders correctly
- Images load
- Navigation works (mobile hamburger)
- Forms submit
- Links work
- No console errors

**Tools:**
- BrowserStack (cross-browser testing service)
- Responsively App (test multiple devices at once)

---

## PHASE 4: Polish & Launch (Weeks 11-12)

### WEEK 11: Final Content & Legal Compliance

#### Day 1-2: Content Review

**Content Audit Checklist:**
```
Faculty:
☐ All bios reviewed and approved
☐ All photos professional quality
☐ All contact info current
☐ All lab URLs working
☐ Research areas accurate

Alumni:
☐ Privacy settings reviewed
☐ Opt-in confirmed for public profiles
☐ Featured spotlights proofread
☐ Giving data accurate

News:
☐ All posts professional tone
☐ All images have alt text and captions
☐ All external links working
☐ Categories correct

Events:
☐ Upcoming events verified
☐ Old events archived
☐ Registration links working

Pages:
☐ About page current
☐ DEI page updated (no Working Group references)
☐ Programs page deadlines correct
☐ Contact info current
```

#### Day 3-4: Legal & Compliance

**Required Pages (Create if missing):**

**1. Privacy Policy** (`/legal/privacy`)
```markdown
# Privacy Policy
Last Updated: [Date]

UC Santa Barbara EEMB Department ("we", "us", "our") respects your privacy.

## Information We Collect
- Contact form submissions (name, email, message)
- Analytics data (anonymized)
- Cookies (for functionality only)

## How We Use Information
- Respond to inquiries
- Improve website experience
- Track website performance

## Alumni Directory
- Public profiles: opted-in only
- Contact info: only if "Allow Public Contact" checked
- Right to update or remove profile anytime

## Your Rights (CCPA)
California residents have the right to:
- Know what data we collect
- Request deletion
- Opt-out of sale (we don't sell data)

Contact: [privacy email]

## Third-Party Services
- Cloudinary (image hosting)
- Vercel (website hosting)
- Google Analytics (anonymized)

[Full legal template from UC legal]
```

**2. Accessibility Statement** (`/legal/accessibility`)
```markdown
# Accessibility Statement

UCSB EEMB is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience and apply relevant accessibility standards.

## Conformance Status
This website strives for WCAG 2.1 Level AA conformance.

## Measures
- Alt text on all images
- Keyboard navigation support
- Semantic HTML structure
- Color contrast ratios ≥ 4.5:1
- Screen reader compatibility

## Feedback
If you encounter accessibility barriers:
Email: [accessibility contact]
Phone: [phone]

We aim to respond within 3 business days.

## Technical Specifications
Accessibility relies on:
- HTML, CSS, JavaScript
- Works with assistive technologies

Last reviewed: [Date]
```

**3. Cookie Consent Banner**
```typescript
// /frontend/src/components/CookieConsent.tsx
// Simple banner (not tracking cookies, so just informational)

"This website uses essential cookies for functionality.
We do not use tracking cookies.
By continuing to use this site, you accept our cookie policy.
[Learn More]"
```

**4. Photo Release Tracking**
- Add field to Media Library: "Photo Release on File" (yes/no)
- For any student/identifiable person photos, ensure release exists

#### Day 5-7: Security Audit

**Checklist:**
```
Infrastructure:
☐ HTTPS only (force SSL)
☐ Security headers configured (X-Frame-Options, etc.)
☐ CORS properly configured
☐ Rate limiting on API
☐ SQL injection protection (Strapi handles this)

Authentication:
☐ Strong password policy (8+ chars, mixed case, numbers)
☐ Brute force protection
☐ Session timeouts configured
☐ Two-factor authentication enabled for admin

Data:
☐ Database encrypted at rest
☐ Backups automated and tested
☐ No sensitive data in Git (check .env files)
☐ Alumni privacy settings enforced

API:
☐ Authentication required for write operations
☐ Rate limiting (prevent DDoS)
☐ Input validation on all fields
☐ No sensitive data in error messages

Code:
☐ Dependencies up to date (npm audit)
☐ No exposed API keys
☐ Environment variables properly set
☐ OWASP Top 10 reviewed
```

**Run Security Scans:**
```bash
# Frontend dependencies
cd frontend
npm audit
npm audit fix

# Backend dependencies
cd backend
npm audit
npm audit fix

# Check for exposed secrets
git secrets --scan
```

---

### WEEK 12: Deployment & Launch

#### Day 1-2: Staging Deployment

**Deploy to Staging:**
```bash
# Backend (Railway/DigitalOcean)
cd backend
git push staging main
# Verify: https://cms-staging.eemb.ucsb.edu/admin

# Frontend (Vercel staging)
cd frontend
vercel --env staging
# Verify: https://staging.eemb.ucsb.edu
```

**Final Staging Tests:**
```
☐ All pages load
☐ All API endpoints working
☐ Images load from CDN
☐ Forms submit correctly
☐ Search works
☐ Mobile responsive
☐ No console errors
☐ Lighthouse >90
```

**Stakeholder Review:**
- Share staging link with chair & committee
- Gather feedback
- Make final adjustments

#### Day 3-4: Production Deployment

**Pre-Launch Checklist:**
```
Content:
☐ All faculty approved profiles
☐ Alumni spotlights reviewed
☐ News posts published (at least 10)
☐ Events calendar populated
☐ In Memoriam complete (5 scholars)
☐ DEI page updated

Technical:
☐ DNS configured (eemb.ucsb.edu → Vercel)
☐ SSL certificate active
☐ Backup systems tested
☐ Monitoring configured (UptimeRobot)
☐ Analytics installed (Google Analytics)
☐ Error logging configured (Sentry)

Legal:
☐ Privacy policy live
☐ Accessibility statement live
☐ Cookie consent banner
☐ Photo releases filed

Training:
☐ Admin users created
☐ Training completed
☐ Documentation delivered
☐ Video tutorials accessible
```

**Production Deployment:**
```bash
# 1. Backend to production
cd backend
git push production main
# Verify: https://cms.eemb.ucsb.edu/admin

# 2. Run final database migration
npm run migration:run

# 3. Frontend to production
cd frontend
npm run build
vercel --prod
# Verify: https://eemb.ucsb.edu

# 4. Configure DNS (coordinate with UCSB IT)
# Point eemb.ucsb.edu to Vercel IPs

# 5. Test production
# - Visit eemb.ucsb.edu
# - Check all pages
# - Submit test form
# - Check admin panel
```

**301 Redirects (Old → New URLs):**
```javascript
// vercel.json
{
  "redirects": [
    {
      "source": "/people/faculty/adrian-stier",
      "destination": "/people/faculty/stier-adrian",
      "permanent": true
    },
    {
      "source": "/academics/graduate/:path*",
      "destination": "/programs/graduate/:path*",
      "permanent": true
    },
    {
      "source": "/spotlights",
      "destination": "/news",
      "permanent": true
    }
    // Add all old URLs
  ]
}
```

**Test Redirects:**
```bash
# Check that old URLs redirect correctly
curl -I https://eemb.ucsb.edu/people/faculty/adrian-stier
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://eemb.ucsb.edu/people/faculty/stier-adrian
```

#### Day 5: Soft Launch

**Internal Announcement:**
```
Subject: New EEMB Website is Live! 🎉

Dear EEMB Community,

We're excited to announce the launch of our newly redesigned department website!

🌐 Visit: https://eemb.ucsb.edu

✨ New Features:
- Modern, mobile-friendly design
- Alumni directory and spotlights
- Good News blog showcasing achievements
- In Memoriam page honoring our colleagues
- Updated DEI section

🙋 Your Profile:
Faculty: Please review your profile and let us know if anything needs updating.
Alumni: Join our alumni directory! Update your info: [link]

📰 Share Your News:
Submit achievements for our Good News blog: [form link]

💬 Feedback Welcome:
We'd love to hear your thoughts: [feedback form]

Questions? Contact [Andi's email]

Best regards,
[Chair name]
```

#### Day 6: Public Launch

**External Announcement:**
- Social media posts (Twitter, Instagram, Facebook)
- Update links from other UCSB sites (Biology dept, MSI, etc.)
- Notify campus communications office
- Update email signatures with new URL
- Press release (if desired)

**Social Media Posts:**
```
Twitter/X:
Excited to unveil our newly redesigned website! 🌊
Explore our world-class research in ecology, evolution,
and marine biology. Visit https://eemb.ucsb.edu
#UCSB #MarineScience #OceanConservation

Instagram:
[Carousel of screenshots]
Our new website is live! 🎉 Swipe to see:
1. Modern design showcasing our coastal research
2. Faculty profiles & labs
3. Alumni success stories
4. Latest research news

Link in bio to explore!

LinkedIn:
The UCSB EEMB Department is proud to launch our
redesigned website, featuring:
• Comprehensive faculty and alumni directories
• Research highlights and publications
• Graduate program information
• Opportunities to engage with our community

Discover how we're advancing ocean science:
https://eemb.ucsb.edu
```

#### Day 7: Monitoring & Support

**Set Up Monitoring:**
```yaml
# monitoring/uptime.yml
Uptime Robot monitors:
- Homepage (check every 5 min)
- API health endpoint (every 5 min)
- Admin login (every 15 min)

Alerts:
- Email to IT contact if down >10 min
- Slack notification to team

Google Analytics:
- Daily active users
- Top pages
- Traffic sources
- Mobile vs desktop ratio

Error Tracking (Sentry):
- Frontend errors
- API errors
- Performance issues
```

**First Week Support Plan:**
- Monitor analytics daily
- Check error logs
- Respond to feedback quickly
- Be ready for quick fixes
- Gather user feedback

---

## Post-Launch: Month 1-3

### Week 1 Post-Launch
- Monitor metrics daily
- Fix any critical bugs
- Respond to user feedback
- Check that forms/emails working
- Verify search engines indexing

### Week 2-4
- Gather feedback via survey
- Make minor improvements
- Add any missing content
- Optimize based on analytics
- Create first quarterly digest

### Month 2
- Review analytics (what's popular?)
- A/B test CTAs (apply, give buttons)
- Add more alumni spotlights
- Expand news archive
- Plan feature additions

### Month 3
- Major content audit
- Update any stale info
- Add new features based on feedback
- Prepare case study/presentation
- Celebrate success! 🎉

---

## Success Metrics (Track Monthly)

**Content Management Efficiency:**
- ✅ Andi can add faculty in <5 minutes (Goal: 100% success rate)
- ✅ News posts published same day as submission
- ✅ No broken links
- ✅ All images properly labeled
- ✅ Alumni database growing (goal: +10/month)

**Technical Performance:**
- ✅ Lighthouse >90 all categories
- ✅ 99.9% uptime
- ✅ <3 second page loads
- ✅ Zero critical accessibility issues

**User Engagement:**
- ✅ 40% increase in prospective student inquiries
- ✅ 30% growth in alumni directory
- ✅ 25% increase in giving (tracked via alumni page)
- ✅ 50% mobile traffic

**Content Quality:**
- ✅ All faculty profiles complete
- ✅ 20+ professional news posts
- ✅ 5+ alumni spotlights
- ✅ Event calendar current
- ✅ Zero outdated content

---

## Ongoing Maintenance (After Launch)

### Monthly Tasks
- Content updates (faculty changes, news, events)
- Review form submissions
- Check broken links
- Update events calendar
- Add alumni spotlights

### Quarterly Tasks
- Comprehensive content audit
- Analytics review & optimization
- Security updates
- Backup verification
- User feedback survey

### Annual Tasks
- Major content refresh
- Technology updates
- Security audit
- Accessibility audit
- Design refresh (minor)
- Training refresher for staff

---

## Final Notes

**This roadmap provides:**
✅ Realistic 12-week timeline
✅ Backend-first approach (proper foundation)
✅ Non-technical user management (Strapi CMS)
✅ Comprehensive alumni platform
✅ Legal compliance (UC requirements)
✅ Extensive documentation & training
✅ Quality assurance processes
✅ Long-term sustainability

**You now have:**
- 📊 Flexible database (add/remove faculty easily)
- 🎓 Alumni engagement platform (directory + spotlights)
- 📝 Simple content management (no code required)
- 🔒 Legal compliance (privacy, accessibility)
- 📈 Analytics & monitoring
- 📚 Complete documentation
- 🎓 Training materials

**Ready to build a department website that will serve EEMB for the next decade.**

---

**Next Step:** Review this roadmap with stakeholders, then begin Week 0 (environment setup).
