# EEMB Website Comprehensive Style Guide
## Version 3.0 — Personality & Warmth Update

---

## 1. Design Philosophy

### Core Principles
1. **Distinctly EEMB**: Design should be unmistakably ours—not a generic template that could belong to any department
2. **Ocean-Inspired Elegance**: Fluid, calming, professional—but with warmth and personality
3. **Academic Authority with Approachability**: Credible enough for peer review, welcoming enough for prospective students
4. **Accessibility First**: WCAG AA compliance minimum; clear hierarchy, sufficient contrast
5. **Place-Based Identity**: Every design choice should evoke Santa Barbara—where mountains meet the sea

### Design Personality
- **Confident** not corporate
- **Warm** not sterile
- **Scientific** but curious
- **Modern** with timeless character
- **Grounded in place** — always connecting to Santa Barbara

### What Makes This Different from v2.0
- **Serif headlines** (Literata) for academic character
- **Warm neutral backgrounds** instead of cold grays
- **Reduced gradient usage** — simplified, not overwhelming
- **Wave dividers** for organic transitions
- **Asymmetric layouts** to break template syndrome
- **Nature accent colors** (kelp green, sand, sunset)

---

## 2. Color System

### Primary Palette
| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| Ocean Deep | `#003660` | `ocean-deep` | Headers, primary CTAs, footer, navigation backgrounds |
| Ocean Blue | `#047AB5` | `ocean-blue` | Links, secondary buttons, interactive elements, icons |
| Ocean Teal | `#20B2AA` | `ocean-teal` | Accents, success states, highlights |
| UCSB Navy | `#003660` | `ucsb-navy` | Text headings, formal elements (same as Ocean Deep) |
| UCSB Gold | `#FEBC11` | `ucsb-gold` | Primary CTAs, important callouts, awards, highlights |

### NEW: Warm Neutrals
Replace cold grays with these warmer tones:
| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| Warm 50 | `#FDFCFB` | `warm-50` | Warmest white, subtle cream |
| Warm 100 | `#FAF9F7` | `warm-100` | Primary page background (replaces gray-50) |
| Warm 200 | `#F5F3F0` | `warm-200` | Secondary backgrounds, alternating sections |
| Warm 300 | `#E8E4DE` | `warm-300` | Borders light |
| Warm 700 | `#5C574F` | `warm-700` | Primary body text |
| Warm 800 | `#3D3A35` | `warm-800` | Dark text |

### NEW: Nature-Inspired Accents
| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| Sand | `#E8E0D4` | `sand` | Warm neutral accent, beach evocation |
| Kelp 500 | `#1B5E45` | `kelp-500` | Nature connection, terrestrial research |
| Kelp 600 | `#1B4D3E` | `kelp-600` | Deep kelp green |
| Sunset | `#E07B4C` | `sunset` | Santa Barbara sunset (use sparingly) |

### Secondary & Accent Colors
| Name | Hex | Tailwind Class | Usage |
|------|-----|----------------|-------|
| UCSB Coral | `#EF5645` | `ucsb-coral` | Alerts, badges, urgent notices, error states |
| Success Green | `#10B981` | `emerald-500` | Success messages, positive indicators |
| Warning Amber | `#F59E0B` | `amber-500` | Warnings, pending states |

### Color Usage Rules
- **NEVER** use pure black (`#000000`) for text; use `warm-800` or `warm-900`
- **PREFER** `warm-100` over `gray-50` for backgrounds
- **REDUCE** 3-color gradients — use solid colors or simple 2-color gradients
- **ALWAYS** ensure link colors have sufficient contrast (4.5:1 minimum)
- **USE** `ocean-blue` for clickable text links

---

## 3. Typography System

### Font Families
```css
/* Body text - clean and modern */
font-family: var(--font-inter), system-ui, sans-serif;

/* Headlines - academic with warmth */
font-family: var(--font-literata), Georgia, serif;
```

### Tailwind Classes
```tsx
// Headlines (serif)
className="font-heading"  // or font-serif

// Body text (sans)
className="font-sans"  // default
```

### Type Scale

#### Display (Hero Headlines)
```tsx
className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
// Use for: Main hero headlines only
// Color: text-white (on gradient) or text-ucsb-navy (on light)
// NEW: Uses serif font for character
```

#### H1 (Page Titles)
```tsx
className="font-heading text-3xl md:text-4xl font-bold text-ucsb-navy"
// Use for: Single page title, top of content area
// Spacing: mb-4 or mb-6
```

#### H2 (Section Titles)
```tsx
className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-ucsb-navy"
// Use for: Major section divisions
// Spacing: mb-6 md:mb-8
```

#### H3 (Subsection Titles)
```tsx
className="font-heading text-xl md:text-2xl font-semibold text-ucsb-navy"
// Use for: Card titles, subsections within sections
// Spacing: mb-3 md:mb-4
```

#### H4 (Component Titles)
```tsx
className="font-heading text-lg font-semibold text-warm-800"
// Use for: Smaller component headers, list titles
// Spacing: mb-2
```

#### Body Large (Lead Text)
```tsx
className="text-lg md:text-xl text-warm-600 leading-relaxed"
// Use for: Hero subtitles, section introductions
// Spacing: mb-6 md:mb-8
// Or use: className="text-lead"
```

#### Body (Default)
```tsx
className="text-base text-warm-700 leading-relaxed"
// Use for: All body copy, paragraphs
// Spacing: mb-4 between paragraphs
```

#### Body Small
```tsx
className="text-sm text-warm-600"
// Use for: Captions, metadata, secondary information
```

#### Caption/Fine Print
```tsx
className="text-xs text-warm-500"
// Use for: Timestamps, legal text, tertiary information
```

### Typography Rules
- **Headings**: Always use `font-heading` (Literata serif) for h1-h4
- **Body**: Uses Inter (sans-serif) by default
- **Line Height**: `leading-relaxed` (1.625) for body, tight for headings
- **Letter Spacing**: `tracking-tight` for large display text, `-0.02em` for headings (built in)
- **Max Width**: `max-w-prose` (65ch) for optimal readability
- **Font Weight**:
  - `font-bold` (700) for H1, H2, display
  - `font-semibold` (600) for H3, H4
  - `font-medium` (500) for emphasized body text
  - `font-normal` (400) for body text

---

## 4. Spacing System

### Base Unit
All spacing should be multiples of 4px (Tailwind's default scale).

### Section Spacing
| Element | Mobile | Desktop | Classes |
|---------|--------|---------|---------|
| Hero Section Padding | 48px (py-12) | 64px (py-16) | `py-12 md:py-16` |
| Content Section Padding | 48px (py-12) | 64px (py-16) | `py-12 md:py-16` |
| Between Major Sections | 0 | 0 | Sections stack; use bg color to separate |
| Footer Padding | 48px (py-12) | 64px (py-16) | `py-12 md:py-16` |

### Component Spacing
| Element | Value | Classes |
|---------|-------|---------|
| Card Padding | 24px / 32px | `p-6` or `p-8` |
| Card Gap in Grid | 24px | `gap-6` |
| Button Padding | 12px 24px / 16px 32px | `px-6 py-3` or `px-8 py-4` |
| Form Field Spacing | 16px | `space-y-4` |
| List Item Spacing | 12px | `space-y-3` |
| Icon + Text Gap | 8px / 12px | `gap-2` or `gap-3` |

### Container
```tsx
className="container mx-auto px-4 sm:px-6 lg:px-8"
// Max widths:
// - Full content: max-w-7xl (1280px)
// - Reading content: max-w-4xl (896px)
// - Narrow content: max-w-2xl (672px)
```

---

## 5. Component Library

### 5.1 Hero Sections

#### Primary Hero (Homepage)
```tsx
<section className="relative bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16 md:py-24 overflow-hidden">
  {/* Optional: Decorative background pattern */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute inset-0 bg-[url('/patterns/waves.svg')] bg-repeat" />
  </div>
  
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="max-w-4xl">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
        Page Title Here
      </h1>
      <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl">
        Supporting description text that provides context and draws users in.
      </p>
      {/* Optional CTA */}
      <div className="flex flex-wrap gap-4">
        <a href="#" className="inline-flex items-center bg-ucsb-gold text-ucsb-navy px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition-all hover:shadow-lg">
          Primary Action
        </a>
        <a href="#" className="inline-flex items-center bg-white/10 backdrop-blur text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/30">
          Secondary Action
        </a>
      </div>
    </div>
  </div>
</section>
```

#### Secondary Hero (Subpages)
```tsx
<section className="bg-gradient-to-r from-ocean-deep to-ocean-blue text-white py-12 md:py-16">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl">
      {/* Optional breadcrumb */}
      <nav className="text-sm text-white/70 mb-4">
        <a href="/" className="hover:text-white transition">Home</a>
        <span className="mx-2">/</span>
        <span className="text-white">Current Page</span>
      </nav>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        Page Title
      </h1>
      <p className="text-lg text-white/90 max-w-2xl">
        Brief page description.
      </p>
    </div>
  </div>
</section>
```

#### Compact Hero (Interior Pages)
```tsx
<section className="bg-ocean-deep text-white py-8 md:py-12">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-2xl md:text-3xl font-bold">Page Title</h1>
  </div>
</section>
```

### 5.2 Cards

#### Standard Card
```tsx
<article className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
  {/* Optional image */}
  <div className="aspect-video rounded-lg overflow-hidden mb-6 bg-gray-100">
    <img 
      src="..." 
      alt="Descriptive alt text" 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  </div>
  
  {/* Optional badge */}
  <span className="inline-block text-xs font-bold text-white bg-gradient-to-r from-ocean-blue to-ocean-teal px-3 py-1 rounded-full mb-4">
    Category
  </span>
  
  <h3 className="text-xl md:text-2xl font-semibold text-ucsb-navy mb-3 group-hover:text-ocean-blue transition-colors">
    Card Title
  </h3>
  
  <p className="text-gray-600 mb-4 line-clamp-3">
    Card description text that provides useful information about the content.
  </p>
  
  {/* Optional metadata */}
  <div className="flex items-center gap-4 text-sm text-gray-500">
    <span>Date</span>
    <span>•</span>
    <span>Author</span>
  </div>
</article>
```

#### Profile Card (People)
```tsx
<article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
  {/* Photo */}
  <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
    <img 
      src="..." 
      alt="Name's headshot" 
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  </div>
  
  <div className="p-6">
    <h3 className="text-xl font-semibold text-ucsb-navy mb-1">
      Person Name
    </h3>
    <p className="text-ocean-blue font-medium mb-3">Title / Role</p>
    <p className="text-sm text-gray-600 mb-4">
      Brief bio or research interests.
    </p>
    
    {/* Contact links */}
    <div className="flex gap-3">
      <a href="mailto:..." className="text-gray-400 hover:text-ocean-blue transition" aria-label="Email">
        <svg className="w-5 h-5">...</svg>
      </a>
      <a href="..." className="text-gray-400 hover:text-ocean-blue transition" aria-label="Website">
        <svg className="w-5 h-5">...</svg>
      </a>
    </div>
  </div>
</article>
```

#### Feature Card (with Icon)
```tsx
<div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-8 border border-gray-100 hover:border-ocean-blue/30 transition-all duration-300 hover:shadow-lg">
  <div className="w-14 h-14 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-xl flex items-center justify-center mb-6">
    <svg className="w-7 h-7 text-white">...</svg>
  </div>
  
  <h3 className="text-xl font-semibold text-ucsb-navy mb-3">
    Feature Title
  </h3>
  
  <p className="text-gray-600 leading-relaxed">
    Description of this feature or service.
  </p>
</div>
```

#### Stat Card
```tsx
<div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
  <div className="text-4xl md:text-5xl font-bold text-ocean-blue mb-2">
    42+
  </div>
  <div className="text-gray-600 font-medium">
    Metric Label
  </div>
</div>
```

### 5.3 Buttons

#### Primary Button
```tsx
<button className="inline-flex items-center justify-center bg-ocean-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-ocean-deep focus:ring-2 focus:ring-ocean-blue focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
  Button Text
</button>
```

#### Secondary Button
```tsx
<button className="inline-flex items-center justify-center bg-white text-ocean-blue px-6 py-3 rounded-lg font-semibold border-2 border-ocean-blue hover:bg-ocean-blue hover:text-white focus:ring-2 focus:ring-ocean-blue focus:ring-offset-2 transition-all">
  Button Text
</button>
```

#### Ghost Button
```tsx
<button className="inline-flex items-center justify-center text-ocean-blue px-6 py-3 rounded-lg font-semibold hover:bg-ocean-blue/10 focus:ring-2 focus:ring-ocean-blue transition-all">
  Button Text
</button>
```

#### Gold CTA Button
```tsx
<button className="inline-flex items-center justify-center bg-ucsb-gold text-ucsb-navy px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 hover:shadow-lg focus:ring-2 focus:ring-ucsb-gold focus:ring-offset-2 transition-all">
  Call to Action
</button>
```

#### Button with Icon
```tsx
<button className="inline-flex items-center gap-2 bg-ocean-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-ocean-deep transition-all">
  <svg className="w-5 h-5">...</svg>
  Button Text
</button>
```

#### Button Sizes
```tsx
// Small
className="px-4 py-2 text-sm rounded-md"

// Default
className="px-6 py-3 text-base rounded-lg"

// Large
className="px-8 py-4 text-lg rounded-lg"
```

### 5.4 Navigation

#### Main Navigation
```tsx
<header className="bg-ocean-deep text-white sticky top-0 z-50">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <nav className="flex items-center justify-between h-16 md:h-20">
      {/* Logo */}
      <a href="/" className="flex items-center gap-3">
        <img src="/logo.svg" alt="EEMB" className="h-10" />
        <span className="font-bold text-lg hidden sm:block">EEMB</span>
      </a>
      
      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center gap-8">
        <a href="/about" className="text-white/90 hover:text-ucsb-gold transition font-medium">
          About
        </a>
        {/* Dropdown example */}
        <div className="relative group">
          <button className="flex items-center gap-1 text-white/90 hover:text-ucsb-gold transition font-medium">
            Research
            <svg className="w-4 h-4">...</svg>
          </button>
          <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="bg-white rounded-lg shadow-xl py-2 min-w-[200px]">
              <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-ocean-blue">
                Link
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu button */}
      <button className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition" aria-label="Open menu">
        <svg className="w-6 h-6">...</svg>
      </button>
    </nav>
  </div>
</header>
```

### 5.5 Forms

#### Text Input
```tsx
<div className="space-y-2">
  <label htmlFor="field" className="block text-sm font-medium text-gray-700">
    Label
  </label>
  <input
    type="text"
    id="field"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue focus:outline-none transition"
    placeholder="Placeholder text"
  />
  <p className="text-sm text-gray-500">Helper text if needed.</p>
</div>
```

#### Select
```tsx
<select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue focus:outline-none transition appearance-none cursor-pointer">
  <option value="">Select an option</option>
  <option value="1">Option 1</option>
</select>
```

#### Textarea
```tsx
<textarea
  rows={4}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-ocean-blue focus:border-ocean-blue focus:outline-none transition resize-y"
  placeholder="Enter your message"
/>
```

#### Checkbox
```tsx
<label className="flex items-start gap-3 cursor-pointer">
  <input
    type="checkbox"
    className="mt-1 w-5 h-5 text-ocean-blue border-gray-300 rounded focus:ring-ocean-blue"
  />
  <span className="text-gray-700">Checkbox label text</span>
</label>
```

### 5.6 Footer

```tsx
<footer className="bg-ocean-deep text-white">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
      {/* Brand column */}
      <div className="lg:col-span-1">
        <img src="/logo-white.svg" alt="EEMB" className="h-12 mb-4" />
        <p className="text-white/70 text-sm leading-relaxed">
          Department of Ecology, Evolution & Marine Biology at UC Santa Barbara.
        </p>
      </div>
      
      {/* Link columns */}
      <div>
        <h4 className="font-semibold text-ucsb-gold mb-4">Quick Links</h4>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-white/70 hover:text-white transition text-sm">
              Link text
            </a>
          </li>
        </ul>
      </div>
      
      {/* Repeat for other columns */}
    </div>
    
    {/* Bottom bar */}
    <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-white/60 text-sm">
        © {new Date().getFullYear()} UC Santa Barbara. All rights reserved.
      </p>
      <div className="flex gap-4">
        <a href="#" className="text-white/60 hover:text-white transition" aria-label="Twitter">
          <svg className="w-5 h-5">...</svg>
        </a>
      </div>
    </div>
  </div>
</footer>
```

### 5.7 Alerts & Notices

#### Info Alert
```tsx
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
  <svg className="w-5 h-5 text-ocean-blue flex-shrink-0 mt-0.5">...</svg>
  <div>
    <h4 className="font-semibold text-ocean-blue">Info Title</h4>
    <p className="text-sm text-blue-700 mt-1">Alert message content.</p>
  </div>
</div>
```

#### Warning Alert
```tsx
<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5">...</svg>
  <div>
    <h4 className="font-semibold text-amber-800">Warning Title</h4>
    <p className="text-sm text-amber-700 mt-1">Warning message content.</p>
  </div>
</div>
```

### 5.8 Badges & Tags

#### Category Badge
```tsx
<span className="inline-flex items-center text-xs font-bold text-white bg-gradient-to-r from-ocean-blue to-ocean-teal px-3 py-1 rounded-full">
  Category
</span>
```

#### Status Badge
```tsx
// Active/Success
<span className="inline-flex items-center text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
  Active
</span>

// Pending
<span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
  Pending
</span>

// Inactive
<span className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
  Inactive
</span>
```

#### Tag (Removable)
```tsx
<span className="inline-flex items-center gap-1 text-sm text-ocean-blue bg-blue-50 px-3 py-1 rounded-full">
  Tag Name
  <button className="hover:text-ocean-deep" aria-label="Remove tag">
    <svg className="w-4 h-4">...</svg>
  </button>
</span>
```

---

## 6. Layout Patterns

### 6.1 Page Structure
```tsx
<>
  <Header />
  <main>
    <HeroSection />
    <ContentSection />
    {/* ... more sections */}
  </main>
  <Footer />
</>
```

### 6.2 Section Wrapper
```tsx
<section className="py-12 md:py-16 bg-white"> {/* or bg-gray-50 for alternating */}
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section header */}
    <div className="max-w-3xl mb-8 md:mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">
        Section Title
      </h2>
      <p className="text-lg text-gray-600">
        Optional section description.
      </p>
    </div>
    
    {/* Section content */}
    <div>
      {/* Content here */}
    </div>
  </div>
</section>
```

### 6.3 Grid Patterns

#### 3-Column Grid (Cards)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
  {/* Cards */}
</div>
```

#### 4-Column Grid (Small Items)
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
  {/* Items */}
</div>
```

#### 2-Column Content + Sidebar
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
  <div className="lg:col-span-2">
    {/* Main content */}
  </div>
  <aside className="lg:col-span-1">
    {/* Sidebar */}
  </aside>
</div>
```

#### Centered Content
```tsx
<div className="max-w-3xl mx-auto">
  {/* Centered prose content */}
</div>
```

---

## 7. Animation & Interaction

### Hover Effects
```tsx
// Card lift
className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300"

// Image zoom
className="group-hover:scale-105 transition-transform duration-500"

// Color transition
className="hover:text-ocean-blue transition-colors duration-200"

// Background fade
className="hover:bg-gray-50 transition-colors duration-200"
```

### Focus States
```tsx
// Standard focus ring
className="focus:ring-2 focus:ring-ocean-blue focus:ring-offset-2 focus:outline-none"

// Focus within (for groups)
className="focus-within:ring-2 focus-within:ring-ocean-blue"
```

### Loading States
```tsx
// Skeleton loader
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
  <div className="h-4 bg-gray-200 rounded w-1/2" />
</div>

// Spinner
<svg className="animate-spin h-5 w-5 text-ocean-blue">...</svg>
```

---

## 8. Accessibility Requirements

### Focus Management
- All interactive elements MUST have visible focus indicators
- Focus order MUST be logical (left-to-right, top-to-bottom)
- Skip links SHOULD be provided for main content

### Color Contrast
- Normal text: 4.5:1 minimum contrast ratio
- Large text (18px+ bold or 24px+): 3:1 minimum
- Interactive elements: 3:1 minimum

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3, never skip levels)
- Use `<nav>` for navigation
- Use `<main>` for main content
- Use `<article>` for self-contained content
- Use `<section>` with headings for major divisions
- Use `<button>` for actions, `<a>` for navigation

### ARIA Labels
```tsx
// Icon-only buttons
<button aria-label="Open menu">
  <svg aria-hidden="true">...</svg>
</button>

// Descriptive links
<a href="#" aria-label="Read more about coral reef research">
  Read More
</a>

// Live regions
<div aria-live="polite" aria-atomic="true">
  {/* Dynamic content */}
</div>
```

### Images
```tsx
// Decorative
<img src="..." alt="" aria-hidden="true" />

// Informative
<img src="..." alt="Descriptive text explaining the image content" />
```

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Tailwind Prefix | Usage |
|------------|-------|-----------------|-------|
| Mobile | 0-639px | (default) | Single column, stacked layouts |
| Small | 640px+ | `sm:` | Minor adjustments |
| Medium | 768px+ | `md:` | 2-column layouts, larger text |
| Large | 1024px+ | `lg:` | 3-column layouts, full navigation |
| XL | 1280px+ | `xl:` | Max container widths |

### Mobile-First Approach
Always write mobile styles first, then add responsive prefixes:
```tsx
// ✅ Correct: Mobile-first
className="text-base md:text-lg lg:text-xl"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="p-4 md:p-6 lg:p-8"

// ❌ Incorrect: Desktop-first (don't do this)
className="lg:text-xl md:text-lg text-base"
```

---

## 10. Icons

### Icon Library
Use Heroicons (`@heroicons/react`) as the primary icon set.

### Icon Sizes
| Context | Size | Classes |
|---------|------|---------|
| Inline with text | 16-20px | `w-4 h-4` or `w-5 h-5` |
| Buttons | 20px | `w-5 h-5` |
| Cards/Features | 24-28px | `w-6 h-6` or `w-7 h-7` |
| Large decorative | 32-48px | `w-8 h-8` to `w-12 h-12` |

### Icon Styling
```tsx
// Outline icons (default)
import { AcademicCapIcon } from '@heroicons/react/24/outline'

// Solid icons (for filled states)
import { AcademicCapIcon } from '@heroicons/react/24/solid'

// Usage
<AcademicCapIcon className="w-6 h-6 text-ocean-blue" />
```

---

## 11. NEW: Visual Motifs & Components

### Wave Dividers
Use wave dividers to create organic transitions between sections:

```tsx
import WaveDivider from '@/components/ui/WaveDivider'

// Between sections
<WaveDivider variant="subtle" toColor="fill-warm-100" />

// Before footer
<WaveDivider variant="bold" toColor="fill-ocean-deep" />

// Flipped (wave goes up)
<WaveDivider variant="subtle" toColor="fill-white" flip />
```

**Variants:**
- `subtle` - Light wave for similar backgrounds
- `bold` - Multi-layer wave for major transitions
- `layered` - Multiple translucent waves for depth

### Section Eyebrows
Use eyebrows to introduce sections consistently:

```tsx
<div className="flex items-center gap-3 mb-4">
  <div className="w-8 h-0.5 bg-ocean-teal" />
  <span className="text-ocean-teal text-sm font-semibold tracking-wide uppercase">
    Section Label
  </span>
</div>
```

### Asymmetric Layouts
Break the template feel with 12-column grids:

```tsx
<div className="grid md:grid-cols-12 gap-8 lg:gap-16 items-center">
  <div className="md:col-span-5">
    {/* Smaller column - image */}
  </div>
  <div className="md:col-span-7">
    {/* Larger column - content */}
  </div>
</div>
```

### Decorative Background Elements

```tsx
// Decorative offset background behind image
<div className="relative">
  <div className="absolute -top-4 -left-4 w-full h-full bg-ocean-teal/10 rounded-2xl -z-10" />
  <div className="relative rounded-2xl overflow-hidden">
    <Image ... />
  </div>
</div>

// Floating accent blob
<div className="absolute -bottom-6 -right-6 w-24 h-24 bg-ucsb-gold/10 rounded-full blur-2xl" />
```

---

## 12. Common Anti-Patterns to Avoid

### ❌ Don't Do This

1. **Three-color gradients**: Use solid colors or 2-color gradients max
2. **Cold gray backgrounds**: Use `warm-100` instead of `gray-50`
3. **System fonts for headlines**: Always use `font-heading` (Literata)
4. **Centered everything**: Use asymmetric layouts for visual interest
5. **Missing hover/focus states**: All interactive elements need these
6. **Text on images without overlay**: Always add a gradient overlay
7. **Generic alt text**: Never use "image" or "photo" as alt text
8. **Missing responsive design**: Every component must work at all breakpoints
9. **Overusing animations**: Keep motion subtle and purposeful
10. **Template syndrome**: Make it feel like EEMB, not a generic template

---

## 13. Quick Reference Cheatsheet v3.0

### Most Common Patterns

```tsx
// Hero section (simplified gradient)
className="bg-gradient-to-t from-ocean-deep via-ocean-deep/70 to-ocean-deep/40"

// Section wrapper (warm background)
className="py-16 md:py-24 bg-warm-100"

// Container
className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl"

// Section title (with serif)
className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-ucsb-navy mb-8"

// Card (warm shadows)
className="bg-white rounded-2xl p-6 shadow-warm-md hover:shadow-warm-xl transition-all border border-warm-200"

// Primary button (gold CTA)
className="bg-ucsb-gold text-ucsb-navy px-7 py-3.5 rounded-xl font-bold hover:bg-yellow-400 transition-all"

// Secondary button
className="bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl border border-white/30"

// Link with animated underline
className="link-underline text-ocean-blue"

// Grid
className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"

// Badge (ocean)
className="badge-ocean" // or use full classes

// Body text (warm)
className="text-warm-700 leading-relaxed"
```

### CSS Utility Classes (from globals.css)

```tsx
// Components
.section           // Standard section padding
.section-warm      // Section with warm background
.container-content // Max-width container
.card              // Base card with warm shadow
.card-tilt         // Card with 3D tilt hover
.btn-primary       // Primary button
.btn-gold          // Gold CTA button
.btn-secondary     // Outline button
.badge-ocean       // Ocean gradient badge
.badge-gold        // Gold badge
.badge-kelp        // Kelp green badge

// Typography
.text-display      // Large display headlines
.section-title     // Section headings
.text-lead         // Intro paragraphs
.link-underline    // Animated underline link

// Decorative
.gradient-ocean    // Ocean gradient background
.gradient-warm     // Warm gradient background
.accent-bar        // Vertical accent line
.hr-wave           // Horizontal wave line
.underline-gold    // Gold underline accent

// Interactive
.hover-lift        // Lift on hover
.hover-zoom        // Zoom on hover (for group)
.hover-glow        // Subtle glow on hover
```

---

*Last updated: December 2025*
*Version: 3.0 — Personality & Warmth Update*
