# EEMB Website - Comprehensive Technical Architecture
## Enterprise-Grade, Non-Technical User Friendly, Legally Compliant

**Version:** 2.0 - Full Stack Revision
**Date:** November 12, 2025
**Focus:** Backend Flexibility, Alumni Integration, Non-Coder Management
**Timeline:** 10-12 weeks (revised from 7 weeks for proper implementation)

---

## Executive Summary: The Real Requirements

This revision addresses critical gaps in the original plan:

### What Was Missing (And Now Fixed):
1. ❌ **Original**: JSON files requiring GitHub commits → ✅ **New**: Headless CMS with visual editor
2. ❌ **Original**: No alumni section → ✅ **New**: Comprehensive alumni database & engagement platform
3. ❌ **Original**: Manual image uploads → ✅ **New**: Media management system with crop/resize tools
4. ❌ **Original**: Developer-dependent updates → ✅ **New**: Admin dashboard for all content types
5. ❌ **Original**: No database flexibility → ✅ **New**: PostgreSQL with automated migrations
6. ❌ **Original**: Basic structure → ✅ **New**: Enterprise architecture for 10+ year lifespan

---

## 🎯 Core Principle: Non-Technical Users First

**Key Requirement**: Andi (admin staff) should be able to:
- Add/remove faculty with photos in 5 minutes
- Create news posts with images
- Update alumni spotlights
- Manage events calendar
- All without touching code, Git, or JSON files

---

## Tech Stack Architecture

### Frontend Layer
```
Next.js 14 (App Router) + React + TypeScript
├── Tailwind CSS (UCSB design system)
├── Shadcn/ui (accessible component library)
├── React Query (data fetching)
└── Vercel (hosting)
```

### Backend Layer (The Critical Addition)
```
Strapi CMS (Headless CMS)
├── PostgreSQL database (not JSON!)
├── REST + GraphQL APIs
├── Media Library (image management)
├── User roles & permissions
├── Content versioning
└── Webhooks (trigger builds)
```

**Why Strapi?**
- ✅ Open source, self-hostable
- ✅ Visual admin panel (non-technical friendly)
- ✅ Flexible content types
- ✅ Built-in media manager
- ✅ Role-based access control
- ✅ Integrates with Next.js perfectly

### Database Layer
```
PostgreSQL 14+
├── Relational structure
├── Foreign key constraints
├── Automated backups
├── Migration system
└── Hosted on Railway/Supabase
```

---

## Complete Database Schema (Production-Ready)

### People Management Tables

```sql
-- Faculty table
CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),
    pronouns VARCHAR(50),

    -- Professional Info
    title VARCHAR(255) NOT NULL,
    department_role VARCHAR(100), -- chair, vice-chair, grad-advisor
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    office_location VARCHAR(100),

    -- Media
    photo_id INT REFERENCES media(id),
    cv_document_id INT REFERENCES media(id),

    -- Content
    bio_short TEXT(500),
    bio_long TEXT,

    -- Research
    research_interests TEXT[],
    lab_website_url VARCHAR(500),
    personal_website_url VARCHAR(500),
    google_scholar_url VARCHAR(500),
    orcid VARCHAR(50),

    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, emeritus, on_leave, deceased
    is_deceased BOOLEAN DEFAULT FALSE,
    start_date DATE,
    end_date DATE,

    -- Relationships
    research_areas INT[] REFERENCES research_areas(id),

    -- Metadata
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by INT REFERENCES users(id),
    updated_by INT REFERENCES users(id),

    -- Search
    search_vector tsvector
);

CREATE INDEX idx_faculty_status ON faculty(status);
CREATE INDEX idx_faculty_slug ON faculty(slug);
CREATE INDEX idx_faculty_search ON faculty USING GIN(search_vector);


-- Alumni table (NEW - Critical Addition)
CREATE TABLE alumni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Personal
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),
    pronouns VARCHAR(50),

    -- Academic History
    degree_type VARCHAR(50), -- PhD, MS, BS, Postdoc
    graduation_year INT,
    dissertation_title TEXT,
    advisor_id UUID REFERENCES faculty(id),
    research_area_id INT REFERENCES research_areas(id),

    -- Contact (optional, privacy-aware)
    email VARCHAR(255),
    linkedin_url VARCHAR(500),
    personal_website VARCHAR(500),
    allow_public_contact BOOLEAN DEFAULT FALSE,

    -- Current Position
    current_position VARCHAR(255),
    current_employer VARCHAR(255),
    current_location VARCHAR(255),

    -- Media
    photo_id INT REFERENCES media(id),

    -- Content
    bio_short TEXT(500),
    bio_long TEXT,
    achievements TEXT,

    -- Engagement
    is_featured BOOLEAN DEFAULT FALSE,
    willing_to_mentor BOOLEAN DEFAULT FALSE,
    willing_to_speak BOOLEAN DEFAULT FALSE,
    newsletter_subscriber BOOLEAN DEFAULT FALSE,

    -- Giving
    total_giving_amount DECIMAL(10,2) DEFAULT 0,
    last_gift_date DATE,
    giving_level VARCHAR(50), -- friend, supporter, patron, benefactor

    -- Privacy
    visibility VARCHAR(50) DEFAULT 'public', -- public, alumni-only, private

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_contact_date DATE,

    -- Search
    search_vector tsvector
);

CREATE INDEX idx_alumni_year ON alumni(graduation_year);
CREATE INDEX idx_alumni_degree ON alumni(degree_type);
CREATE INDEX idx_alumni_featured ON alumni(is_featured);
CREATE INDEX idx_alumni_search ON alumni USING GIN(search_vector);


-- In Memoriam table
CREATE TABLE in_memoriam (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID, -- May reference faculty OR alumni
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Personal
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),

    -- Dates
    birth_year INT,
    death_year INT NOT NULL,
    death_date DATE,

    -- Professional
    title VARCHAR(255),
    affiliation VARCHAR(255), -- Faculty, Emeritus, Research Affiliate

    -- Content
    photo_id INT REFERENCES media(id),
    biography TEXT NOT NULL,
    personal_remembrance TEXT,
    legacy_text TEXT,

    -- Research
    research_areas INT[] REFERENCES research_areas(id),

    -- External Links
    memorial_links JSONB, -- [{url, title, source}]

    -- Display
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- Staff table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Personal
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),
    pronouns VARCHAR(50),

    -- Professional
    title VARCHAR(255) NOT NULL,
    role_category VARCHAR(100), -- administration, academic-support, facilities, computing
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    office_location VARCHAR(100),

    -- Media
    photo_id INT REFERENCES media(id),

    -- Content
    bio TEXT,
    responsibilities TEXT[],

    -- Status
    status VARCHAR(50) DEFAULT 'active',
    start_date DATE,

    -- Display
    display_order INT DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- Graduate Students table
CREATE TABLE graduate_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Personal
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),
    pronouns VARCHAR(50),

    -- Academic
    program VARCHAR(50), -- PhD, MS
    year_entered INT NOT NULL,
    expected_graduation_year INT,
    advisor_id UUID REFERENCES faculty(id),
    research_area_id INT REFERENCES research_areas(id),

    -- Contact
    email VARCHAR(255) NOT NULL,
    office_location VARCHAR(100),

    -- Media
    photo_id INT REFERENCES media(id),

    -- Content
    bio TEXT,
    research_description TEXT,
    personal_website VARCHAR(500),

    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, on-leave, completed

    -- Display
    display_order INT DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Content Management Tables

```sql
-- News/Good News table
CREATE TABLE news_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Dates
    date_published TIMESTAMP NOT NULL,
    date_submitted TIMESTAMP,

    -- Content
    title VARCHAR(200) NOT NULL,
    excerpt TEXT(500),
    content TEXT NOT NULL, -- Markdown or Rich Text

    -- Categorization
    category VARCHAR(50) NOT NULL, -- publication, award, grant, etc.
    tags TEXT[],

    -- Associations
    featured_people JSONB, -- [{type: 'faculty', id: 'uuid'}]
    featured_labs JSONB,
    research_areas INT[],

    -- Media
    featured_image_id INT REFERENCES media(id),
    featured_image_caption TEXT,
    additional_images INT[] REFERENCES media(id),

    -- Links
    external_links JSONB, -- [{url, title, type}]
    related_news_items UUID[] REFERENCES news_items(id),

    -- Publication Details (if applicable)
    journal_name VARCHAR(255),
    publication_doi VARCHAR(255),
    publication_url VARCHAR(500),

    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived

    -- Display
    featured BOOLEAN DEFAULT FALSE,
    include_in_quarterly BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,

    -- Submission tracking
    submitted_by_email VARCHAR(255),
    submitted_via_form BOOLEAN DEFAULT FALSE,
    form_response_id VARCHAR(100),

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_by INT REFERENCES users(id),

    -- Search
    search_vector tsvector
);

CREATE INDEX idx_news_published ON news_items(date_published);
CREATE INDEX idx_news_category ON news_items(category);
CREATE INDEX idx_news_status ON news_items(status);
CREATE INDEX idx_news_featured ON news_items(featured);
CREATE INDEX idx_news_search ON news_items USING GIN(search_vector);


-- Alumni Spotlights (NEW)
CREATE TABLE alumni_spotlights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alumni_id UUID REFERENCES alumni(id) NOT NULL,

    -- Content
    title VARCHAR(200) NOT NULL,
    interview_content TEXT NOT NULL, -- Q&A format, markdown
    featured_image_id INT REFERENCES media(id),

    -- Categorization
    spotlight_type VARCHAR(50), -- career-achievement, research-impact, giving-back

    -- Display
    is_featured BOOLEAN DEFAULT TRUE,
    date_published TIMESTAMP DEFAULT NOW(),
    display_order INT DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- Research Areas taxonomy
CREATE TABLE research_areas (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    parent_id INT REFERENCES research_areas(id), -- For sub-areas

    -- Content
    description TEXT,
    representative_image_id INT REFERENCES media(id),

    -- Display
    display_order INT DEFAULT 0,
    color VARCHAR(7), -- Hex color for badges

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Research area associations (many-to-many)
CREATE TABLE faculty_research_areas (
    faculty_id UUID REFERENCES faculty(id) ON DELETE CASCADE,
    research_area_id INT REFERENCES research_areas(id) ON DELETE CASCADE,
    PRIMARY KEY (faculty_id, research_area_id)
);


-- Labs table
CREATE TABLE labs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Basic Info
    lab_name VARCHAR(255) NOT NULL,
    pi_id UUID REFERENCES faculty(id) NOT NULL,
    lab_website_url VARCHAR(500),

    -- Content
    description TEXT,
    research_focus TEXT[],

    -- Media
    featured_image_id INT REFERENCES media(id),

    -- Members
    current_members JSONB, -- [{type: 'grad_student', id: 'uuid'}]

    -- Status
    status VARCHAR(50) DEFAULT 'active',

    -- Display
    display_order INT DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- Media/Asset Management
CREATE TABLE media (
    id SERIAL PRIMARY KEY,

    -- File Info
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_path VARCHAR(500) NOT NULL, -- S3 or local path
    file_size INT, -- bytes
    mime_type VARCHAR(100),

    -- Image specific
    width INT,
    height INT,
    alt_text TEXT, -- Critical for accessibility
    caption TEXT,

    -- Variants (auto-generated thumbnails)
    variants JSONB, -- {thumbnail: 'path', medium: 'path', large: 'path'}

    -- Metadata
    uploaded_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),

    -- Organization
    folder VARCHAR(255), -- faculty, news, research, etc.
    tags TEXT[]
);

CREATE INDEX idx_media_folder ON media(folder);
CREATE INDEX idx_media_type ON media(mime_type);


-- Events/Calendar
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Basic Info
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Date/Time
    start_datetime TIMESTAMP NOT NULL,
    end_datetime TIMESTAMP,
    all_day BOOLEAN DEFAULT FALSE,
    recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT, -- iCal format

    -- Location
    location VARCHAR(255),
    room VARCHAR(100),
    virtual_link VARCHAR(500),
    is_hybrid BOOLEAN DEFAULT FALSE,

    -- Categorization
    event_type VARCHAR(50), -- seminar, workshop, symposium, social
    target_audience TEXT[], -- graduate-students, faculty, public

    -- Media
    featured_image_id INT REFERENCES media(id),

    -- Registration
    requires_registration BOOLEAN DEFAULT FALSE,
    registration_link VARCHAR(500),
    max_capacity INT,

    -- Associated People
    speakers JSONB, -- [{name, affiliation, bio}]
    organizer_id UUID REFERENCES faculty(id),

    -- Display
    is_featured BOOLEAN DEFAULT FALSE,

    -- Status
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, cancelled, completed

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(start_datetime);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);


-- DEI Committee Members
CREATE TABLE dei_committee (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID, -- Can reference faculty or grad_students
    person_type VARCHAR(50), -- faculty, staff, grad-student

    -- Role
    role VARCHAR(100), -- co-chair, member, ad-hoc
    role_description TEXT,

    -- Term
    term_start DATE NOT NULL,
    term_end DATE,
    is_current BOOLEAN DEFAULT TRUE,

    -- Display
    display_order INT DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


-- User Management (CMS access)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- Profile
    first_name VARCHAR(255),
    last_name VARCHAR(255),

    -- Permissions
    role VARCHAR(50) NOT NULL, -- admin, editor, contributor
    permissions JSONB, -- Granular permissions

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log (track all changes)
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),

    -- Action
    action VARCHAR(50) NOT NULL, -- create, update, delete, publish
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(255) NOT NULL,

    -- Changes
    old_values JSONB,
    new_values JSONB,

    -- Context
    ip_address INET,
    user_agent TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_table ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_date ON audit_log(created_at);
```

---

## Admin Dashboard Design (Non-Technical User Interface)

### Main Admin Sections

```
Dashboard Home
├── Quick Stats
│   ├── Faculty count (with add/remove indicators)
│   ├── Pending news items
│   ├── Upcoming events
│   └── Recent alumni updates
│
├── Content Management
│   ├── 👥 People
│   │   ├── Faculty (Add/Edit/Archive)
│   │   ├── Staff
│   │   ├── Graduate Students
│   │   ├── Alumni (with search/filter)
│   │   └── In Memoriam
│   │
│   ├── 📰 News & Events
│   │   ├── Good News (approve submissions)
│   │   ├── Events Calendar
│   │   └── Alumni Spotlights
│   │
│   ├── 🔬 Research
│   │   ├── Research Areas
│   │   ├── Labs Directory
│   │   └── Publications
│   │
│   └── 📄 Pages
│       ├── About
│       ├── Programs
│       └── DEI Content
│
├── Media Library
│   ├── Upload (drag & drop interface)
│   ├── Auto-crop tools
│   ├── Alt text editor
│   └── Organized folders
│
└── Settings
    ├── Users & Permissions
    ├── Form Submissions
    └── Site Backup
```

### Faculty Management Workflow (5-Minute Process)

**Adding New Faculty:**
1. Click "People" → "Faculty" → "Add New"
2. Fill form:
   - Name, title, email (required)
   - Upload photo (auto-cropped to 400x400)
   - Paste bio (rich text editor)
   - Select research areas (checkboxes)
   - Add lab URL
3. Click "Publish"
4. Done! Auto-generates:
   - Slug (firstname-lastname)
   - Profile page
   - Faculty directory entry
   - Search index

**Retiring Faculty:**
1. Find faculty member
2. Click "Change Status" → "Emeritus"
3. Optionally move to "In Memoriam" if deceased
4. System automatically:
   - Updates directory filters
   - Preserves profile page
   - Maintains alumni advisor connections

---

## Alumni Engagement Platform (NEW)

### Alumni Page Structure

```
/alumni
├── /directory (searchable, filterable)
│   ├── By graduation year
│   ├── By degree type
│   ├── By current location
│   ├── By research area
│   └── By advisor
│
├── /spotlights (featured stories)
│   ├── Career achievements
│   ├── Research impact
│   ├── Giving back
│   └── Where are they now?
│
├── /news (alumni-relevant updates)
│   ├── Department news
│   ├── Alumni achievements
│   └── Reunion announcements
│
├── /giving (development integration)
│   ├── Why give to EEMB
│   ├── Impact stories
│   ├── Donation portal
│   └── Named funds
│
└── /stay-connected
    ├── Update your info
    ├── Subscribe to newsletter
    ├── Volunteer opportunities
    └── Mentor current students
```

### Alumni Spotlight Template

```markdown
**Featured Alumni: Dr. Jane Smith '15**

*From Mo'orea coral reefs to climate policy at NOAA*

---

**Q: What are you doing now?**
Jane leads the Marine Ecosystems division at NOAA, shaping federal policy on coral reef conservation.

**Q: How did EEMB prepare you?**
"The field work at Mo'orea taught me to ask big questions. Adrian's mentorship gave me confidence to pursue policy alongside science."

**Q: Advice for current students?**
"Don't silo yourself. The interdisciplinary culture at EEMB is rare—embrace it."

**Q: Favorite EEMB memory?**
"Sunrise dives at Moorea Coral Reef LTER. Seeing those reefs changed my life trajectory."

---

**Want to connect with Jane?**
[LinkedIn] [Email] [Lab Website]

**Give back:** Support the Adrian Stier Lab Coral Conservation Fund
```

### Alumni Data Privacy Controls

**Three-Tier Visibility System:**

1. **Public Profile** (default for opt-in)
   - Name, degree, year
   - Current position/employer
   - Professional contact (LinkedIn)
   - Research interests

2. **Alumni-Only Profile**
   - Above + personal email
   - Willing to mentor
   - Open to networking

3. **Private Profile**
   - In database for department use only
   - Not shown in directory
   - Can still receive newsletters

**GDPR/CCPA Compliance:**
- Opt-in for public directory
- Data download option
- Right to be forgotten
- Clear privacy policy
- Annual data audit

---

## Image & Media Management System

### Automated Image Pipeline

```
User uploads photo
    ↓
[Strapi Media Library]
    ↓
Auto-generate variants:
    ├── thumbnail (150x150)
    ├── small (400x400)
    ├── medium (800x800)
    ├── large (1200x1200)
    └── hero (1920x800)
    ↓
[Cloudinary/ImageKit CDN]
    ↓
Optimized WebP/AVIF formats
    ↓
Served with lazy loading
```

### Non-Technical Photo Upload

**In Admin Dashboard:**
1. Drag & drop photo anywhere
2. Auto-crops to appropriate size (with preview)
3. AI suggests alt text (can edit)
4. Choose usage: Faculty photo, News image, Hero banner
5. Saves to appropriate folder
6. Available in media library for future use

**Photo Guidelines Built-In:**
- Minimum dimensions shown
- File size warnings
- Accessibility checklist
- UCSB style guide references

---

## Legal & Compliance Requirements

### UC System Requirements

**Accessibility (ADA/Section 508):**
- WCAG 2.1 AA compliance (minimum)
- All images with alt text (enforced at upload)
- Color contrast checker (built into design system)
- Keyboard navigation testing
- Screen reader compatibility
- Annual WAVE audit
- Remediation tracking

**Privacy & Data Protection:**
- CCPA compliance (California residents)
- FERPA compliance (student data)
- Cookie consent banner
- Privacy policy (template from UC legal)
- Data retention policy
- Secure data handling (encrypted at rest)

**Branding & Identity:**
- UCSB brand guidelines adherence
- UC system identity standards
- Logo usage restrictions
- Color palette requirements
- Typography specifications

**Content Policies:**
- Photo release forms for student images
- Copyright compliance
- Third-party content attribution
- Research ethics clearance

### Implementation Checklist

```
Legal Compliance:
✅ Privacy Policy page (UC template)
✅ Cookie consent (via OneTrust or similar)
✅ Accessibility statement
✅ DMCA takedown procedure
✅ Photo consent tracking in media table
✅ Student data protection (FERPA)
✅ Alumni opt-in consent logging
✅ Data breach response plan
✅ Regular security audits
✅ SSL certificate (HTTPS only)
```

---

## Performance & UX Requirements

### UC Website Standards

**Page Load Performance:**
- Lighthouse Performance: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Core Web Vitals: Green across all metrics
- Mobile-first optimization

**Browser Support:**
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- iOS Safari (last 2 versions)

**Responsive Breakpoints:**
```css
mobile: 320px - 767px
tablet: 768px - 1023px
desktop: 1024px - 1439px
wide: 1440px+
```

**Accessibility Testing:**
- Automated: axe DevTools, WAVE
- Manual: Screen reader testing (NVDA, JAWS, VoiceOver)
- Keyboard navigation
- Focus management
- ARIA labels audit

---

## Content Update Workflows

### Monthly Content Maintenance

**Week 1: Faculty Updates**
- Review faculty changes
- Update photos if needed
- Check lab URLs
- Verify contact info

**Week 2: News & Events**
- Curate Good News submissions
- Add upcoming seminars
- Update event calendar
- Feature alumni spotlight

**Week 3: Alumni Engagement**
- Review new alumni submissions
- Update giving totals
- Process privacy requests
- Send alumni newsletter

**Week 4: Quality Assurance**
- Run broken link checker
- Review analytics
- Test forms
- Backup database

### Annual Content Audit

**September (Academic Year Start):**
- Update graduate student roster
- New faculty onboarding
- Refresh research area descriptions
- Review In Memoriam page

**December (Application Season):**
- Update program deadlines
- Refresh application materials
- Feature prospective student content

**June (End of Year):**
- Add graduating students to alumni
- Update department stats
- Archive old events
- Generate annual report content

---

## Repository Organization for Long-Term Development

```
eemb-website/
├── 📁 docs/
│   ├── ARCHITECTURE.md (this document)
│   ├── DEPLOYMENT.md
│   ├── CONTENT_GUIDELINES.md
│   ├── API_DOCUMENTATION.md
│   └── ADMIN_HANDBOOK.md
│
├── 📁 frontend/ (Next.js application)
│   ├── src/
│   │   ├── app/ (Next.js 14 App Router)
│   │   │   ├── (public)/ (public pages)
│   │   │   │   ├── page.tsx (homepage)
│   │   │   │   ├── people/
│   │   │   │   │   ├── faculty/
│   │   │   │   │   │   ├── page.tsx (directory)
│   │   │   │   │   │   └── [slug]/page.tsx (individual)
│   │   │   │   │   ├── alumni/
│   │   │   │   │   │   ├── page.tsx (directory)
│   │   │   │   │   │   ├── spotlights/page.tsx
│   │   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   │   ├── in-memoriam/page.tsx
│   │   │   │   │   └── staff/page.tsx
│   │   │   │   ├── research/
│   │   │   │   ├── programs/
│   │   │   │   ├── news/
│   │   │   │   ├── events/
│   │   │   │   └── about/
│   │   │   │       └── dei/page.tsx
│   │   │   │
│   │   │   └── api/ (API routes if needed)
│   │   │
│   │   ├── components/
│   │   │   ├── ui/ (Shadcn components)
│   │   │   ├── layout/
│   │   │   │   ├── Navigation.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Header.tsx
│   │   │   ├── cards/
│   │   │   │   ├── FacultyCard.tsx
│   │   │   │   ├── AlumniCard.tsx
│   │   │   │   ├── NewsCard.tsx
│   │   │   │   └── EventCard.tsx
│   │   │   ├── features/
│   │   │   │   ├── FacultyDirectory.tsx
│   │   │   │   ├── AlumniDirectory.tsx
│   │   │   │   ├── NewsFilter.tsx
│   │   │   │   └── EventCalendar.tsx
│   │   │   └── common/
│   │   │       ├── SearchBar.tsx
│   │   │       ├── FilterPanel.tsx
│   │   │       └── ImageWithFallback.tsx
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts (API client for Strapi)
│   │   │   ├── types.ts (TypeScript interfaces)
│   │   │   ├── utils.ts
│   │   │   └── constants.ts
│   │   │
│   │   └── styles/
│   │       ├── globals.css
│   │       └── theme.ts (UCSB design tokens)
│   │
│   ├── public/
│   │   ├── images/
│   │   └── assets/
│   │
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── 📁 backend/ (Strapi CMS)
│   ├── config/
│   │   ├── database.js
│   │   ├── server.js
│   │   ├── admin.js
│   │   └── plugins.js
│   │
│   ├── src/
│   │   ├── api/ (Content types)
│   │   │   ├── faculty/
│   │   │   │   ├── content-types/
│   │   │   │   │   └── faculty/
│   │   │   │   │       └── schema.json
│   │   │   │   ├── controllers/
│   │   │   │   ├── routes/
│   │   │   │   └── services/
│   │   │   ├── alumni/
│   │   │   ├── news-item/
│   │   │   ├── event/
│   │   │   ├── in-memoriam/
│   │   │   └── research-area/
│   │   │
│   │   ├── extensions/ (custom functionality)
│   │   │   └── users-permissions/
│   │   │
│   │   └── middleware/
│   │
│   ├── database/
│   │   ├── migrations/
│   │   └── seeds/
│   │
│   ├── public/
│   │   └── uploads/ (media files)
│   │
│   └── package.json
│
├── 📁 scripts/ (automation & utilities)
│   ├── scraping/
│   │   ├── scrape_current_site.py
│   │   ├── faculty_parser.py
│   │   ├── validate_data.py
│   │   └── import_to_strapi.py
│   │
│   ├── migration/
│   │   ├── migrate_faculty.js
│   │   ├── migrate_news.js
│   │   └── migrate_images.js
│   │
│   ├── maintenance/
│   │   ├── check_broken_links.js
│   │   ├── optimize_images.sh
│   │   └── backup_database.sh
│   │
│   └── deployment/
│       ├── deploy.sh
│       └── rollback.sh
│
├── 📁 infrastructure/ (hosting configs)
│   ├── docker/
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.backend
│   │   └── docker-compose.yml
│   │
│   ├── nginx/
│   │   └── nginx.conf
│   │
│   └── kubernetes/ (if needed)
│
├── 📁 monitoring/
│   ├── lighthouse/
│   ├── uptime/
│   └── analytics/
│
├── .env.example
├── .gitignore
├── Makefile (common commands)
├── README.md
└── PROJECT_CONTEXT.md (Claude session memory)
```

---

## Claude Code Development Workflow

### Starting New Development Session

```bash
# 1. Start with project context
cat PROJECT_CONTEXT.md
# Paste into Claude Code

# 2. State current phase
"Working on Sprint X: [specific feature]"

# 3. Show relevant code structure
tree -L 3 frontend/src/app/people/
```

### Iterative Development Pattern

**For each feature module:**

1. **Define schema/types**
   ```typescript
   // Show Claude the TypeScript interface
   // Ask: "Create Strapi content type matching this"
   ```

2. **Build backend first**
   ```bash
   # Create Strapi content type
   # Add test data
   # Verify API endpoint
   ```

3. **Build frontend next**
   ```bash
   # Create page components
   # Fetch from API
   # Style with Tailwind
   ```

4. **Test & iterate**
   ```bash
   npm run dev
   # Test in browser
   # Fix issues
   # Commit
   ```

### Prompt Templates for Common Tasks

**Adding New Content Type:**
```
Create a Strapi content type for [entity] with these fields:
- [field 1]: [type] (required)
- [field 2]: [type] (optional)
Include relationship to [other entity].
Follow the pattern from faculty content type.
```

**Creating New Page:**
```
Create Next.js page at /app/[path]/page.tsx that:
- Fetches [entity] from Strapi API
- Uses [Component] for display
- Includes filters for [criteria]
- Is responsive and accessible
- Follows UCSB design system
```

**Building Component:**
```
Create React component [ComponentName] that:
- Takes props: [list props with types]
- Displays: [describe layout]
- Handles: [interactions]
- Uses Tailwind for styling
- Includes proper ARIA labels
```

---

## Deployment Architecture

### Hosting Setup

```
Frontend (Next.js)
└── Vercel
    ├── Production: eemb.ucsb.edu
    ├── Staging: staging.eemb.ucsb.edu
    └── Preview: PR-specific URLs

Backend (Strapi CMS)
└── Railway.app / DigitalOcean
    ├── Production: cms.eemb.ucsb.edu
    ├── Staging: cms-staging.eemb.ucsb.edu
    └── Load balanced, auto-scaling

Database (PostgreSQL)
└── Supabase / Railway
    ├── Production database
    ├── Automated daily backups
    ├── Point-in-time recovery (7 days)
    └── Read replicas for analytics

Media Storage
└── Cloudinary / AWS S3
    ├── CDN delivery
    ├── Auto-optimization
    ├── Image transformations
    └── 99.99% uptime SLA
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml

# On push to main:
1. Run tests (unit + integration)
2. Build Next.js (static export)
3. Deploy to Vercel
4. Run Lighthouse audit
5. Post metrics to Slack
6. Trigger Strapi rebuild (if needed)

# On push to staging:
1. Deploy to staging environment
2. Run E2E tests
3. Generate preview link
4. Notify team

# On PR:
1. Run linting
2. Type check
3. Unit tests
4. Deploy preview
5. Post preview link to PR
```

---

## Training & Documentation

### Admin User Training Plan

**Week 1: CMS Basics**
- Log in to Strapi
- Navigate content types
- Create/edit/delete entries
- Upload images

**Week 2: Content Management**
- Add new faculty member
- Create news post
- Update event calendar
- Manage alumni directory

**Week 3: Advanced Features**
- Bulk operations
- Media library organization
- User management
- Backup/restore

**Week 4: Maintenance**
- Monthly checklist
- Common troubleshooting
- When to call for help
- Emergency procedures

### Documentation Suite

1. **Admin Handbook** (50 pages)
   - Step-by-step guides with screenshots
   - Common tasks
   - Troubleshooting
   - FAQs

2. **Content Style Guide** (30 pages)
   - Writing guidelines
   - Image specifications
   - Accessibility checklist
   - UCSB brand standards

3. **Developer Documentation** (100+ pages)
   - Architecture overview
   - API reference
   - Component library
   - Deployment procedures

4. **Video Tutorials** (10-15 videos)
   - Adding faculty
   - Creating news posts
   - Managing events
   - Alumni spotlight workflow

---

## Cost Estimates (Annual)

### Hosting & Infrastructure
- **Vercel Pro**: $240/year (Next.js hosting)
- **Railway/DigitalOcean**: $600/year (Strapi + DB)
- **Supabase Pro**: $300/year (Database + backups)
- **Cloudinary**: $500/year (Media CDN)
- **Domain & SSL**: $50/year

**Total Infrastructure**: ~$1,690/year

### Development (Initial Build)
- **Phase 1** (10-12 weeks): Design + Development
  - If contracted: $40,000-60,000
  - If in-house (with Claude assistance): Staff time only

### Ongoing Maintenance
- **Content Manager** (5-10 hrs/month): Existing staff
- **Technical Support** (2-4 hrs/month): UCSB IT or contractor
- **Annual Updates**: $2,000-5,000/year

**Total Annual Cost**: $3,000-7,000 (after initial build)

---

## Success Metrics

### Technical Performance
- ✅ Lighthouse >90 all categories
- ✅ 99.9% uptime
- ✅ <3 second page loads
- ✅ Zero critical accessibility issues
- ✅ Mobile-first responsive

### Content Management
- ✅ Non-technical user can add faculty in <5 minutes
- ✅ News posts published same day
- ✅ Zero broken links
- ✅ Images properly labeled/optimized
- ✅ Alumni database growing monthly

### User Engagement
- ✅ 40% increase in prospective student inquiries
- ✅ 30% growth in alumni directory
- ✅ 25% increase in giving (tracked via alumni page)
- ✅ 50% mobile traffic (up from current)
- ✅ Positive user feedback (>4/5 rating)

---

## Next Steps

### Immediate (This Week)
1. ✅ Review and approve revised architecture
2. ✅ Set up development environments
3. ✅ Create Strapi + PostgreSQL on staging
4. ✅ Initialize Next.js project
5. ✅ Begin content scraping

### Phase 1 (Weeks 1-4): Foundation
- Backend: Strapi setup, content types, test data
- Frontend: Design system, core components
- Infrastructure: Hosting, CI/CD, monitoring

### Phase 2 (Weeks 5-8): Core Features
- People management (faculty, staff, students, alumni)
- News & events
- Research areas & labs
- Admin training begins

### Phase 3 (Weeks 9-12): Polish & Launch
- In Memoriam page
- Alumni spotlights
- DEI content updates
- Performance optimization
- Legal compliance final check
- User acceptance testing
- Soft launch

### Post-Launch (Ongoing)
- Monthly content updates
- Quarterly feature additions
- Annual comprehensive audit
- Continuous improvement based on analytics

---

**This architecture ensures:**
✅ Non-technical users can manage all content
✅ Alumni engagement drives giving
✅ Database is flexible for 10+ year growth
✅ Legal/accessibility compliance
✅ Beautiful, performant, modern UX
✅ Long-term sustainability

**Ready to build a world-class department website that lasts.**
