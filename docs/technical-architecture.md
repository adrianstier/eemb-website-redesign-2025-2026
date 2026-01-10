# Technical Architecture Document
## EEMB Website Redesign - Phase 1

**Document Version:** 1.0
**Date:** January 10, 2026
**Prepared By:** Tech Lead
**Project:** EEMB Website Redesign 2025-2026
**Status:** Ready for Implementation

---

## Executive Summary

This document defines the technical architecture for the EEMB website Phase 1 implementation. The architecture builds on the existing Next.js 14 + Supabase foundation, addressing gaps identified during the Strapi→Supabase migration and aligning with UX requirements.

**Key Architecture Decisions:**
- Server-first data fetching with Next.js App Router
- Supabase as sole backend (complete Strapi deprecation)
- Admin-only content management (no faculty self-service)
- ISR caching with webhook-triggered revalidation
- API routes for forms and server-side operations

**Current State:** 60% complete (schema + UI done, data layer incomplete)
**Target State:** Production-ready Phase 1 launch

---

## Table of Contents

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Database Architecture](#3-database-architecture)
4. [API Architecture](#4-api-architecture)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Data Access Patterns](#6-data-access-patterns)
7. [Caching & Performance](#7-caching--performance)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Admin System Architecture](#9-admin-system-architecture)
10. [Integration Architecture](#10-integration-architecture)
11. [Development Standards](#11-development-standards)
12. [Migration Plan](#12-migration-plan)
13. [Implementation Priorities](#13-implementation-priorities)

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS                                          │
│  [Prospective Students] [Faculty] [Media] [Admin] [Current Students]       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VERCEL EDGE NETWORK                               │
│  • Global CDN                                                               │
│  • Edge Caching (ISR)                                                       │
│  • SSL/TLS                                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NEXT.JS 14 APPLICATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  Server         │  │  API Routes     │  │  Middleware     │             │
│  │  Components     │  │  /api/*         │  │  Auth + Routing │             │
│  │  (RSC)          │  │                 │  │                 │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                │                                            │
│  ┌─────────────────────────────┴─────────────────────────────┐             │
│  │                    DATA ACCESS LAYER                       │             │
│  │  • Supabase Server Client                                 │             │
│  │  • Type-safe queries                                      │             │
│  │  • Error handling                                         │             │
│  └─────────────────────────────┬─────────────────────────────┘             │
└────────────────────────────────┼────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SUPABASE                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  PostgreSQL     │  │  Auth           │  │  Storage        │             │
│  │  Database       │  │  (Magic Links)  │  │  (Images)       │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                                  │
│  │  Row Level      │  │  Webhooks       │                                  │
│  │  Security       │  │  (Revalidation) │                                  │
│  └─────────────────┘  └─────────────────┘                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                    │
│  [Google Analytics 4]  [Resend (Email)]  [Google Calendar API]             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

| Principle | Implementation |
|-----------|---------------|
| **Server-First** | Default to React Server Components; client components only when needed |
| **Type Safety** | End-to-end TypeScript with generated Supabase types |
| **Security by Default** | Row Level Security on all tables; admin-only writes |
| **Performance** | ISR caching, optimized images, minimal client JS |
| **Simplicity** | Single data source (Supabase), minimal external dependencies |

---

## 2. Technology Stack

### 2.1 Core Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | Next.js | 14.0.4 | React framework with App Router |
| **Runtime** | React | 18.x | UI library |
| **Language** | TypeScript | 5.x | Type safety |
| **Styling** | Tailwind CSS | 3.3.0 | Utility-first CSS |
| **Database** | Supabase (PostgreSQL) | 14.1 | Database + Auth + Storage |
| **Hosting** | Vercel | — | Deployment + CDN |

### 2.2 Key Dependencies

```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "@supabase/supabase-js": "^2.89.0",
    "@supabase/ssr": "^0.8.0",
    "tailwindcss": "^3.3.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.554.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.56.1",
    "typescript": "^5"
  }
}
```

### 2.3 New Dependencies Required

| Package | Purpose | Priority |
|---------|---------|----------|
| `@tiptap/react` | Rich text editor for admin | High |
| `@tiptap/starter-kit` | TipTap core extensions | High |
| `resend` | Email service for contact form | High |
| `zod` | Schema validation for forms/API | High |
| `next-themes` | Theme management (future) | Low |

### 2.4 Dependencies to Remove

| Package | Reason |
|---------|--------|
| `axios` | Use native fetch; Supabase client handles API |
| `@tanstack/react-query` | Not actively used; server components handle caching |

---

## 3. Database Architecture

### 3.1 Current Schema Assessment

The existing Supabase schema covers core requirements. Assessment against UX needs:

| UX Requirement | Table | Status | Gap |
|---------------|-------|--------|-----|
| Faculty profiles | `faculty` | ✅ Complete | — |
| Faculty research themes | `faculty_research_areas` | ✅ Complete | — |
| Graduate students | `graduate_students` | ✅ Complete | — |
| Student testimonials | — | ❌ Missing | **NEW TABLE NEEDED** |
| Staff profiles | `staff` | ✅ Complete | — |
| News articles | `news_articles` | ✅ Complete | — |
| Events | `events` | ✅ Complete | — |
| Research areas | `research_areas` | ✅ Complete | — |
| "Accepting students" flag | `faculty` | ❌ Missing | **NEW COLUMN NEEDED** |
| Profile version history | — | ❌ Missing | **NEW TABLE NEEDED** |
| Audit logging | — | ❌ Missing | **NEW TABLE NEEDED** |
| Contact submissions | — | ❌ Missing | **NEW TABLE NEEDED** |

### 3.2 Schema Modifications Required

#### 3.2.1 New Table: `student_testimonials`

```sql
CREATE TABLE student_testimonials (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES graduate_students(id),
  quote TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE student_testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON student_testimonials
  FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admin write access" ON student_testimonials
  FOR ALL USING (is_admin());
```

#### 3.2.2 New Columns on `faculty`

```sql
ALTER TABLE faculty
  ADD COLUMN accepting_students BOOLEAN DEFAULT false,
  ADD COLUMN accepting_students_note TEXT;
```

#### 3.2.3 New Table: `profile_versions`

```sql
CREATE TABLE profile_versions (
  id SERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'faculty', 'staff', 'student'
  entity_id INTEGER NOT NULL,
  data JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_reason TEXT
);

-- Enable RLS
ALTER TABLE profile_versions ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admin access" ON profile_versions
  FOR ALL USING (is_admin());

-- Index for lookups
CREATE INDEX idx_profile_versions_entity ON profile_versions(entity_type, entity_id);
```

#### 3.2.4 New Table: `audit_log`

```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  table_name TEXT NOT NULL,
  record_id INTEGER,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Admin-only read
CREATE POLICY "Admin read" ON audit_log
  FOR SELECT USING (is_admin());

-- System write (no user policy needed, use service role)
```

#### 3.2.5 New Table: `contact_submissions`

```sql
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'responded', 'archived'
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admin access" ON contact_submissions
  FOR ALL USING (is_admin());
```

### 3.3 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────────┐       ┌─────────────────┐
│    faculty      │───────│faculty_research_areas│───────│ research_areas  │
├─────────────────┤       └─────────────────────┘       ├─────────────────┤
│ id              │                                      │ id              │
│ first_name      │       ┌─────────────────────┐       │ name            │
│ last_name       │───────│ graduate_students   │───────│ category        │
│ email           │       ├─────────────────────┤       │ description     │
│ title           │       │ id                  │       └─────────────────┘
│ bio             │       │ advisor_id (FK)     │
│ photo_url       │       │ first_name          │       ┌─────────────────┐
│ accepting_students│     │ last_name           │───────│student_research │
│ ...             │       │ degree_program      │       │    _areas       │
└─────────────────┘       │ ...                 │       └─────────────────┘
        │                 └─────────────────────┘
        │                           │
        │                           ▼
        │                 ┌─────────────────────┐
        │                 │student_testimonials │
        │                 ├─────────────────────┤
        │                 │ id                  │
        │                 │ student_id (FK)     │
        │                 │ quote               │
        │                 │ featured            │
        │                 └─────────────────────┘
        │
        ▼
┌─────────────────┐       ┌─────────────────────┐
│  news_faculty   │───────│   news_articles     │
└─────────────────┘       ├─────────────────────┤
                          │ id                  │
┌─────────────────┐       │ title               │
│     events      │       │ content             │
├─────────────────┤       │ category            │
│ id              │       │ publish_date        │
│ title           │       └─────────────────────┘
│ host_faculty_id │
│ start_date      │
│ event_type      │       ┌─────────────────────┐
└─────────────────┘       │     user_roles      │
                          ├─────────────────────┤
┌─────────────────┐       │ id                  │
│     staff       │       │ user_id (FK)        │
├─────────────────┤       │ role                │
│ id              │       └─────────────────────┘
│ first_name      │
│ last_name       │       ┌─────────────────────┐
│ title           │       │   audit_log         │
│ ...             │       ├─────────────────────┤
└─────────────────┘       │ id                  │
                          │ user_id             │
                          │ action              │
                          │ table_name          │
                          │ record_id           │
                          └─────────────────────┘
```

### 3.4 Row Level Security Policies

All tables use RLS with a consistent pattern:

| Table | Read | Write |
|-------|------|-------|
| `faculty` | Public | Admin only |
| `graduate_students` | Public | Admin only |
| `staff` | Public | Admin only |
| `news_articles` | Public (published only) | Admin only |
| `events` | Public | Admin only |
| `research_areas` | Public | Admin only |
| `student_testimonials` | Public | Admin only |
| `user_roles` | Admin only | Admin only |
| `profile_versions` | Admin only | Admin only |
| `audit_log` | Admin only | Service role only |
| `contact_submissions` | Admin only | Public insert, Admin read |

---

## 4. API Architecture

### 4.1 API Route Structure

```
frontend/app/api/
├── contact/
│   └── route.ts          # POST: Submit contact form
├── revalidate/
│   └── route.ts          # POST: Webhook for cache invalidation
├── admin/
│   ├── faculty/
│   │   └── route.ts      # CRUD for faculty profiles
│   ├── students/
│   │   └── route.ts      # CRUD for student profiles
│   ├── news/
│   │   └── route.ts      # CRUD for news articles
│   └── events/
│       └── route.ts      # CRUD for events
└── auth/
    └── callback/
        └── route.ts      # OAuth callback (exists)
```

### 4.2 API Route Specifications

#### 4.2.1 Contact Form API

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = contactSchema.parse(body)

    // Store in database
    const supabase = await createClient()
    await supabase.from('contact_submissions').insert({
      name: validated.name,
      email: validated.email,
      subject: validated.subject,
      message: validated.message,
      ip_address: request.headers.get('x-forwarded-for'),
    })

    // Send email notification
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'EEMB Website <noreply@eemb.ucsb.edu>',
      to: 'andrea.jorgensen@lifesci.ucsb.edu',
      subject: `[EEMB Website] Contact Form: ${validated.subject || 'New Message'}`,
      text: `
Name: ${validated.name}
Email: ${validated.email}
Subject: ${validated.subject || 'N/A'}

Message:
${validated.message}

---
Submitted: ${new Date().toISOString()}
      `.trim(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

#### 4.2.2 Revalidation Webhook

```typescript
// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { table, type } = body // type: INSERT, UPDATE, DELETE

  // Revalidate based on table
  const pathMap: Record<string, string[]> = {
    faculty: ['/people', '/people/faculty'],
    graduate_students: ['/people', '/people/students'],
    staff: ['/people'],
    news_articles: ['/news', '/'],
    events: ['/events', '/calendar', '/'],
    research_areas: ['/research'],
  }

  const paths = pathMap[table] || []
  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: paths })
}
```

### 4.3 Admin API Pattern

All admin APIs follow this pattern:

```typescript
// app/api/admin/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Middleware: Check admin role
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: isAdmin } = await supabase.rpc('is_admin')
  if (!isAdmin) {
    throw new Error('Forbidden')
  }

  return { supabase, user }
}

// GET: List resources
export async function GET(request: NextRequest) {
  try {
    const { supabase } = await requireAdmin()
    const { data, error } = await supabase.from('table').select('*')
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return handleError(error)
  }
}

// POST: Create resource
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireAdmin()
    const body = await request.json()

    // Validate with Zod schema
    const validated = schema.parse(body)

    // Insert with audit
    const { data, error } = await supabase
      .from('table')
      .insert(validated)
      .select()
      .single()

    if (error) throw error

    // Log audit
    await logAudit(supabase, user.id, 'create', 'table', data.id, null, data)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return handleError(error)
  }
}
```

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ADMIN AUTHENTICATION FLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

1. Admin navigates to /admin
         │
         ▼
2. Middleware checks session
         │
    ┌────┴────┐
    │ Session │
    │ valid?  │
    └────┬────┘
         │
    No   │   Yes
    ┌────┴────┐────────────────────┐
    │                               │
    ▼                               ▼
3. Redirect to /auth/login    5. Check user role
         │                          │
         ▼                     ┌────┴────┐
4. Magic Link email sent       │ Admin?  │
   (via Supabase Auth)         └────┬────┘
         │                          │
         ▼                     No   │   Yes
   Click link → /auth/callback ┌────┴────┐────────────────┐
         │                     │                          │
         ▼                     ▼                          ▼
   Session created        Redirect to /           Access granted
   Redirect to /admin     (Not authorized)        to /admin
```

### 5.2 Authorization Model

| Role | Permissions |
|------|-------------|
| **Anonymous** | Read public content (faculty, news, events, etc.) |
| **Authenticated** | Same as anonymous (no self-service) |
| **Admin** | Full CRUD on all content; access to admin dashboard |

### 5.3 Middleware Implementation

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Check admin role
    const { data: isAdmin } = await supabase.rpc('is_admin')
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
}
```

### 5.4 Magic Link Configuration

```typescript
// Supabase Auth Settings (in Supabase Dashboard)
{
  "site_url": "https://eemb.ucsb.edu",
  "redirect_urls": [
    "https://eemb.ucsb.edu/auth/callback",
    "http://localhost:3000/auth/callback"
  ],
  "email": {
    "enable_signup": false,  // Admin-invite only
    "enable_confirmations": true,
    "template_magic_link": "..."
  }
}
```

---

## 6. Data Access Patterns

### 6.1 Server Component Data Fetching

All public pages use React Server Components with direct Supabase queries:

```typescript
// app/people/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/lib/supabase/types'

type Faculty = Tables<'faculty'>

export default async function PeoplePage() {
  const supabase = await createClient()

  const { data: faculty } = await supabase
    .from('faculty')
    .select(`
      *,
      research_areas:faculty_research_areas(
        research_area:research_areas(id, name, category)
      )
    `)
    .eq('active', true)
    .order('last_name')

  return <PeopleDirectory faculty={faculty} />
}
```

### 6.2 Data Access Layer

Create a dedicated data access layer for complex queries:

```typescript
// lib/data/faculty.ts
import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/lib/supabase/types'

export type FacultyWithResearch = Tables<'faculty'> & {
  research_areas: Array<{
    research_area: Tables<'research_areas'>
  }>
}

export async function getAllFaculty(): Promise<FacultyWithResearch[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('faculty')
    .select(`
      *,
      research_areas:faculty_research_areas(
        research_area:research_areas(id, name, category)
      )
    `)
    .eq('active', true)
    .order('last_name')

  if (error) throw error
  return data ?? []
}

export async function getFacultyBySlug(slug: string): Promise<FacultyWithResearch | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('faculty')
    .select(`
      *,
      research_areas:faculty_research_areas(
        research_area:research_areas(id, name, category)
      ),
      students:graduate_students(id, first_name, last_name, slug, photo_url)
    `)
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getFacultyAcceptingStudents(): Promise<FacultyWithResearch[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('faculty')
    .select(`
      *,
      research_areas:faculty_research_areas(
        research_area:research_areas(id, name, category)
      )
    `)
    .eq('active', true)
    .eq('accepting_students', true)
    .order('last_name')

  if (error) throw error
  return data ?? []
}
```

### 6.3 Query Patterns by Entity

| Entity | Common Queries | Caching |
|--------|---------------|---------|
| Faculty | All active, by slug, by research area, accepting students | ISR 15min |
| Students | All active, by advisor, by program | ISR 15min |
| News | Published, featured, by category, by faculty | ISR 15min |
| Events | Upcoming, past, by type, featured | ISR 15min |
| Research | All, featured, by category | ISR 1hr |

---

## 7. Caching & Performance

### 7.1 Caching Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CACHING LAYERS                                    │
└─────────────────────────────────────────────────────────────────────────────┘

Layer 1: Vercel Edge Cache (CDN)
├── Static assets: Immutable (images, fonts, CSS)
├── ISR pages: 15 minutes default, on-demand revalidation
└── API routes: No cache (dynamic)

Layer 2: Next.js Data Cache
├── Server component fetches: Deduplicated per request
├── fetch() with cache options: revalidate: 900 (15 min)
└── Unstable_cache for expensive operations

Layer 3: Supabase Connection Pooling
├── Connection reuse via Supabase client
└── Query optimization via indexes
```

### 7.2 ISR Configuration

```typescript
// app/people/page.tsx
export const revalidate = 900 // 15 minutes

// OR per-fetch configuration
const { data } = await supabase
  .from('faculty')
  .select('*')
// Combined with Next.js fetch caching
```

### 7.3 On-Demand Revalidation

When content changes in Supabase, trigger revalidation:

```typescript
// Supabase Database Webhook → /api/revalidate
// Configured in Supabase Dashboard under Database → Webhooks

// Webhook configuration:
{
  "name": "content-update",
  "table": "*",  // Or specific tables
  "events": ["INSERT", "UPDATE", "DELETE"],
  "url": "https://eemb.ucsb.edu/api/revalidate",
  "headers": {
    "x-webhook-secret": "${REVALIDATION_SECRET}"
  }
}
```

### 7.4 Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | ISR + optimized images |
| FCP | < 1.8s | Server components, minimal JS |
| CLS | < 0.1 | Image dimensions, font loading |
| TTI | < 3.5s | Code splitting, lazy loading |
| TTFB | < 200ms | Edge caching, connection pooling |

### 7.5 Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

// Usage in components
<Image
  src={faculty.photo_url}
  alt={`${faculty.first_name} ${faculty.last_name}`}
  width={400}
  height={400}
  sizes="(max-width: 768px) 200px, 400px"
  className="rounded-full"
/>
```

---

## 8. Frontend Architecture

### 8.1 Component Architecture

```
src/components/
├── ui/                       # Base UI components (atomic)
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Loading.tsx
│   └── ...
├── layout/                   # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── PageWrapper.tsx
├── features/                 # Feature-specific components
│   ├── faculty/
│   │   ├── FacultyCard.tsx
│   │   ├── FacultyGrid.tsx
│   │   └── FacultyProfile.tsx
│   ├── news/
│   │   ├── NewsCard.tsx
│   │   └── NewsList.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   └── EventCalendar.tsx
│   └── home/
│       ├── HeroSection.tsx
│       ├── QuickNav.tsx
│       └── ...
└── admin/                    # Admin-specific components
    ├── Dashboard.tsx
    ├── FacultyEditor.tsx
    └── ...
```

### 8.2 Server vs Client Components

| Pattern | Use Server Component | Use Client Component |
|---------|---------------------|---------------------|
| Data fetching | ✅ | ❌ |
| Static content | ✅ | ❌ |
| SEO-critical content | ✅ | ❌ |
| Interactive forms | ❌ | ✅ |
| Real-time updates | ❌ | ✅ |
| Browser APIs | ❌ | ✅ |
| Event handlers | ❌ | ✅ |
| useState/useEffect | ❌ | ✅ |

### 8.3 State Management

No global state management library needed. Use:

1. **Server Components** for data fetching
2. **URL State** for filters/search (using `searchParams`)
3. **React State** for component-local interactivity
4. **Form State** with controlled inputs or react-hook-form

### 8.4 File Organization Pattern

```typescript
// Each page follows this pattern:
app/
└── people/
    ├── page.tsx              # Server component: fetches data, renders layout
    ├── loading.tsx           # Loading UI
    ├── error.tsx             # Error UI
    └── faculty/
        └── [slug]/
            └── page.tsx      # Faculty profile page
```

---

## 9. Admin System Architecture

### 9.1 Admin Dashboard Structure

```
app/admin/
├── page.tsx                  # Dashboard overview
├── layout.tsx                # Admin layout with nav
├── faculty/
│   ├── page.tsx              # Faculty list
│   ├── new/
│   │   └── page.tsx          # Create faculty
│   └── [id]/
│       └── page.tsx          # Edit faculty
├── students/
│   ├── page.tsx
│   └── [id]/page.tsx
├── staff/
│   ├── page.tsx
│   └── [id]/page.tsx
├── news/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/page.tsx
├── events/
│   ├── page.tsx
│   ├── new/page.tsx
│   └── [id]/page.tsx
└── settings/
    └── page.tsx              # Site settings
```

### 9.2 Admin Layout

```typescript
// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-100">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 9.3 Rich Text Editor Integration

```typescript
// components/admin/RichTextEditor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="border rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  )
}
```

### 9.4 Audit Logging

```typescript
// lib/audit.ts
import { createClient } from '@/lib/supabase/server'

export async function logAudit(
  userId: string,
  action: 'create' | 'update' | 'delete',
  tableName: string,
  recordId: number | null,
  oldData: object | null,
  newData: object | null
) {
  const supabase = await createClient()

  await supabase.from('audit_log').insert({
    user_id: userId,
    action,
    table_name: tableName,
    record_id: recordId,
    old_data: oldData,
    new_data: newData,
  })
}
```

---

## 10. Integration Architecture

### 10.1 External Services

| Service | Purpose | Integration Method |
|---------|---------|-------------------|
| Google Analytics 4 | Analytics | Client-side script |
| Resend | Email delivery | Server-side API |
| Google Calendar | Event sync (future) | API integration |
| Supabase Storage | Image hosting | Direct upload |

### 10.2 Google Analytics 4 Integration

```typescript
// components/Analytics.tsx
'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_ID) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '')
    window.gtag?.('config', GA_ID, { page_path: url })
  }, [pathname, searchParams])

  if (!GA_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}

// Custom event tracking
export function trackEvent(action: string, params?: Record<string, unknown>) {
  window.gtag?.('event', action, params)
}
```

### 10.3 Email Integration (Resend)

```typescript
// lib/email.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactEmailData {
  name: string
  email: string
  subject?: string
  message: string
}

export async function sendContactNotification(data: ContactEmailData) {
  return resend.emails.send({
    from: 'EEMB Website <noreply@eemb.ucsb.edu>',
    to: 'andrea.jorgensen@lifesci.ucsb.edu',
    subject: `[EEMB Website] Contact Form: ${data.subject || 'New Message'}`,
    text: formatContactEmail(data),
  })
}

function formatContactEmail(data: ContactEmailData): string {
  return `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject || 'N/A'}

Message:
${data.message}

---
Submitted: ${new Date().toISOString()}
  `.trim()
}
```

---

## 11. Development Standards

### 11.1 Code Standards

| Standard | Rule |
|----------|------|
| TypeScript | Strict mode enabled |
| ESLint | Next.js default + custom rules |
| Formatting | Prettier (2-space indent, single quotes) |
| Imports | Absolute imports via `@/` alias |
| Components | PascalCase, one component per file |
| Functions | camelCase, descriptive names |
| Types | Explicit return types on exports |

### 11.2 Git Workflow

```
main (production)
  │
  ├── develop (staging)
  │     │
  │     ├── feature/xxx
  │     ├── fix/xxx
  │     └── ...
  │
  └── hotfix/xxx (emergency fixes)
```

### 11.3 Commit Message Format

```
type(scope): description

[optional body]

[optional footer]

Types: feat, fix, docs, style, refactor, test, chore
Scope: ui, api, db, auth, admin, etc.

Examples:
feat(ui): add faculty accepting students badge
fix(api): handle empty contact form submission
docs(readme): update development setup instructions
```

### 11.4 Testing Strategy

| Type | Tool | Coverage Target |
|------|------|-----------------|
| Unit | Jest | Core utilities, data transforms |
| Component | React Testing Library | Key UI components |
| E2E | Playwright | Critical user paths |
| Visual | Playwright screenshots | Key pages |

### 11.5 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## 12. Migration Plan

### 12.1 Strapi Deprecation

The codebase currently has legacy Strapi code that needs removal:

| File | Action |
|------|--------|
| `lib/strapi.ts` | Delete |
| `lib/api.ts` | Refactor to Supabase or delete |
| `lib/events.ts` | Refactor to use Supabase |
| Pages with `localhost:1337` | Update to Supabase queries |

### 12.2 Migration Steps

1. **Database schema updates** (Day 1)
   - Add missing columns (`accepting_students`)
   - Create new tables (`student_testimonials`, `audit_log`, etc.)
   - Update RLS policies

2. **Data access layer** (Day 1-2)
   - Create `lib/data/` with typed query functions
   - Update all pages to use new data layer

3. **API routes** (Day 2-3)
   - Create `/api/contact`
   - Create `/api/revalidate`
   - Create admin CRUD routes

4. **Page updates** (Day 3-5)
   - Convert client-side pages to server components
   - Remove Strapi references
   - Update types to use Supabase types

5. **Admin system** (Day 5-7)
   - Build admin dashboard
   - Implement TipTap editor
   - Add audit logging

6. **Testing & cleanup** (Day 7-8)
   - Remove unused Strapi code
   - Run full test suite
   - Performance optimization

---

## 13. Implementation Priorities

### 13.1 Sprint 1: Foundation (Days 1-3)

| Priority | Task | Owner | Status |
|----------|------|-------|--------|
| P0 | Database schema updates | Database Engineer | Pending |
| P0 | Data access layer (`lib/data/`) | Backend Developer | Pending |
| P0 | Contact form API route | Backend Developer | Pending |
| P1 | Revalidation webhook | Backend Developer | Pending |
| P1 | Remove Strapi client code | Frontend Developer | Pending |

### 13.2 Sprint 2: Pages (Days 4-6)

| Priority | Task | Owner | Status |
|----------|------|-------|--------|
| P0 | Faculty page → server component | Frontend Developer | Pending |
| P0 | Events page → server component | Frontend Developer | Pending |
| P0 | Faculty profile with "accepting" badge | Frontend Developer | Pending |
| P1 | Student testimonials component | Frontend Developer | Pending |
| P1 | News page filtering by theme | Frontend Developer | Pending |

### 13.3 Sprint 3: Admin (Days 7-10)

| Priority | Task | Owner | Status |
|----------|------|-------|--------|
| P0 | Admin layout & navigation | Frontend Developer | Pending |
| P0 | Faculty CRUD interface | Full Stack Developer | Pending |
| P1 | News CRUD with TipTap | Full Stack Developer | Pending |
| P1 | Events CRUD | Full Stack Developer | Pending |
| P2 | Audit log viewer | Full Stack Developer | Pending |

### 13.4 Sprint 4: Polish (Days 11-14)

| Priority | Task | Owner | Status |
|----------|------|-------|--------|
| P0 | E2E testing | QA Engineer | Pending |
| P0 | Accessibility audit | Frontend Developer | Pending |
| P1 | Performance optimization | Tech Lead | Pending |
| P1 | GA4 integration | Frontend Developer | Pending |
| P2 | Documentation | Tech Lead | Pending |

---

## Appendix A: Environment Variables

```env
# .env.local (development)
# .env.production (production)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# Server-only
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # For admin operations
REVALIDATION_SECRET=xxx                 # Webhook authentication
RESEND_API_KEY=re_xxx                   # Email service

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# App
NEXT_PUBLIC_SITE_URL=https://eemb.ucsb.edu
```

---

## Appendix B: Database Functions

```sql
-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 10, 2026 | Tech Lead | Initial architecture document |

---

*This Technical Architecture Document is ready for team implementation. Next step: Database Engineer executes schema migrations.*
