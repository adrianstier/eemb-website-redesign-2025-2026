# CLAUDE.md - EEMB Website Project Context

This file provides context for AI assistants (Claude) working on the EEMB website redesign project.

---

## Project Overview

**Department:** Ecology, Evolution & Marine Biology (EEMB), UC Santa Barbara
**Website Purpose:** Modern, accessible department website showcasing research, recruiting students, and connecting with the scientific community
**Tech Stack:** Next.js 14 + Supabase + TypeScript + Tailwind CSS

---

## Brand Identity: "Pacific Naturalism"

### Brand Essence
The EEMB brand embodies the intersection of rigorous scientific inquiry and the natural wonder of California's coastal ecosystems. Our visual and verbal identity reflects:

- **Place**: Where the Santa Ynez Mountains meet the Pacific Ocean
- **Purpose**: Research that matters for the planet
- **People**: A collaborative community of curious scientists

### Voice & Tone

**Primary Voice Attributes:**
- **Authoritative but Accessible**: We're experts, but we explain without condescension
- **Curious and Wonder-Driven**: We ask big questions about life on Earth
- **Warm and Welcoming**: Academia without elitism
- **Grounded in Place**: Our coastal location is part of our identity

**Writing Guidelines:**
- Lead with the "why" - what question are we answering?
- Use active voice and concrete examples
- Avoid unnecessary jargon; when technical terms are needed, provide context
- Celebrate discoveries without hyperbole
- Be direct: say "we" not "the department"

**Tone by Context:**
| Context | Tone | Example |
|---------|------|---------|
| Research descriptions | Curious, specific | "We're asking why kelp forests thrive here but collapse elsewhere" |
| Student recruitment | Inviting, honest | "Your research starts your first year, not after coursework" |
| News/discoveries | Excited but measured | "New findings reveal..." not "BREAKTHROUGH!" |
| Support pages | Clear, helpful | Direct instructions without bureaucratic language |

### Visual Identity

**Design System:** Pacific Naturalism v4.0

The visual system draws from our coastal environment—not in a decorative way, but as a genuine reflection of where we work and what we study.

**Color Philosophy:**
- **Ocean depths** (navy, teal) for authority and depth
- **Warm neutrals** (cream, sand) for approachability
- **Bioluminescent accents** (cyan) for moments of discovery
- **UCSB Gold** for institutional pride and calls-to-action

**Typography:**
- **Fraunces** (headings): Characterful serif that feels academic but not stuffy
- **DM Sans** (body): Clean, warm, highly readable

**Visual Metaphors:**
- Wave forms for section transitions
- Topographic patterns as subtle textures
- Floating orbs suggesting ocean depths and bioluminescence
- Photography of actual research sites and organisms

---

## Color Palette

### Primary Colors
```
ocean-deep:       #002244  - Headers, footer, primary text
ocean-midnight:   #001a33  - Hero backgrounds, dark sections
ocean-blue:       #0369a1  - Primary actions, links
ocean-teal:       #0d9488  - Accents, highlights
bioluminescent:   #22d3ee  - Special highlights, discovery moments
```

### Warm Neutrals
```
warm-50:   #FEFDFB  - Page background
warm-100:  #FAF8F5  - Card backgrounds
warm-200:  #F4F1EC  - Subtle borders
warm-500:  #9C9284  - Muted text
warm-600:  #6B6156  - Secondary text
warm-700:  #4A433B  - Body text
```

### Brand Accent
```
ucsb-gold:  #FEBC11  - CTAs, important highlights
```

---

## Typography

**Headings:** Fraunces (variable weight serif)
- Display: clamp(3rem, 8vw, 5.5rem)
- H1: clamp(2.5rem, 6vw, 4rem)
- H2: clamp(2rem, 4vw, 3rem)
- Letter-spacing: -0.02em to -0.03em

**Body:** DM Sans
- Base: 16px/1.7 line-height
- Lead paragraphs: 18-20px

---

## Key Messages

### Elevator Pitch
"EEMB is where the Santa Ynez Mountains meet the Pacific—and where scientists ask questions that matter for the future of life on Earth. Our research spans kelp forests, coral reefs, evolutionary origins, and ecosystem dynamics."

### Value Propositions

**For Prospective Graduate Students:**
- "Your research starts day one, not after years of coursework"
- "100% funded PhD and MS programs"
- "World-class research infrastructure at your doorstep"
- "A collaborative community, not a competitive hierarchy"

**For Collaborators:**
- "25 faculty across marine ecology, evolutionary biology, and ecosystem science"
- "Two NSF Long-Term Ecological Research sites"
- "Interdisciplinary by design"

**For Media/Public:**
- "Expert sources on climate, biodiversity, ocean health, and conservation"
- "Research that translates to real-world impact"

---

## Page Hierarchy & Purpose

| Page | Purpose | Hero Style |
|------|---------|------------|
| Home | First impression, show breadth | Full hero with rotating images |
| Research | Showcase research themes | Full hero with imagery |
| Academics | Recruit graduate students | Full hero with compelling messaging |
| About | Tell our story | Full hero with place-based imagery |
| People | Find someone quickly | Compact header, directory focus |
| News | Browse updates | Compact header, content focus |
| Support | Get help | Compact header, utility focus |

---

## Content Guidelines

### News Articles
- Lead with the discovery or finding
- Include researcher names and photos
- Connect to broader significance
- 300-600 words ideal
- Include image with caption

### Faculty Profiles
- Research description in first person when possible
- Concrete examples of current projects
- Link to lab website, Google Scholar, ORCID
- High-quality headshot (minimum 400x400)

### Event Descriptions
- Clear date, time, location at top
- Who should attend
- What they'll learn/experience
- Registration link if applicable

---

## Development Guidelines

### File Structure
```
frontend/
├── app/              # Next.js App Router pages
├── src/
│   ├── components/   # React components
│   ├── data/         # Static data files
│   └── lib/          # Utilities
└── public/
    └── images/       # Static assets
```

### Component Patterns
- Use Tailwind utility classes from design system
- Prefer composition over configuration
- Keep components focused (single responsibility)
- Add scroll-triggered animations for key sections

### CSS Classes to Use
```css
/* Backgrounds */
bg-warm-50          /* Page background */
bg-white            /* Cards */
bg-ocean-deep       /* Dark sections */

/* Text */
text-ocean-deep     /* Headings */
text-warm-600       /* Body text */
text-ocean-teal     /* Links, accents */

/* Buttons */
bg-ucsb-gold text-ocean-deep  /* Primary CTA */
border-ocean-teal text-ocean-teal  /* Secondary */

/* Shadows */
shadow-warm-sm      /* Subtle depth */
shadow-warm-lg      /* Card hover states */

/* Borders */
border-warm-200     /* Light borders */
rounded-2xl         /* Standard radius */
rounded-3xl         /* Cards */
```

---

## Common Pitfalls to Avoid

1. **Don't use generic academic language**: "The department is committed to excellence" → "We ask questions that matter"
2. **Don't hide the research**: Lead with specific, interesting research topics
3. **Don't forget the place**: Our coastal location is a competitive advantage
4. **Don't be cold**: Warm neutrals and friendly tone matter
5. **Don't overuse heroes**: Utility pages need compact headers
6. **Don't ignore mobile**: Test all layouts at 375px width

---

## Quick Reference

### Start Development
```bash
cd frontend && npm run dev
# Website: http://localhost:3000
# Supabase dashboard: https://supabase.com/dashboard (cloud-hosted, no local backend needed)
```

### Key URLs
- Frontend: http://localhost:3000
- Supabase Dashboard: https://supabase.com/dashboard
- Admin Panel: http://localhost:3000/admin

### Database
Supabase PostgreSQL (cloud-hosted). Manage via Supabase dashboard or CLI.
Types auto-generated at `frontend/src/lib/supabase/types.ts`.

---

*Last updated: February 2026*

---

## File Ownership (parallel work)
- `frontend/` — web UI, splittable by page/component
- `backend/` — API server, independent from frontend
- `scraping/` — data collection scripts, independent
- `scripts/` — utility scripts, independent
- `infrastructure/` — deployment config, independent
- `docs/` — documentation, independent
- `planning documents/` — specs, independent
