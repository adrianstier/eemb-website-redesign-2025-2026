# EEMB Website - Comprehensive Improvement Plan
## 100x Better UX/UI Implementation Guide

Based on comprehensive analysis, this document outlines all improvements needed to transform the EEMB website into a world-class, accessible, and performant application.

---

## Table of Contents
1. [Immediate Fixes (Week 1)](#week-1-immediate-fixes)
2. [High Priority (Weeks 2-3)](#weeks-2-3-high-priority)
3. [Medium Priority (Month 1)](#month-1-medium-priority)
4. [Long-term Improvements (Month 2+)](#month-2-long-term-improvements)
5. [Component Library](#component-library)
6. [Page-by-Page Improvements](#page-by-page-improvements)

---

## Week 1: Immediate Fixes

### 1. Environment Variables Setup ✅
**Status:** STARTED

**Create `.env.local`:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Update all API calls across:**
- `/app/people/page.tsx` (lines 51-53)
- `/app/faculty/page.tsx` (lines 37, 51-53)
- `/app/alumni/page.tsx`
- Any other pages with fetch calls

**Pattern:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
fetch(`${API_URL}/api/faculties`)
```

---

### 2. Replace All Emoji Icons with SVG
**Priority:** CRITICAL

**Files to Update:**
1. `/app/faculty/page.tsx` - Lines 194, 200, 206
2. `/app/alumni/page.tsx` - Line 235
3. `/app/contact/page.tsx` - Lines 60, 71, 82, 101, 111, 319, 324
4. `/app/events/page.tsx` - Lines 218, 224, 336, 344
5. `/app/error.tsx` - Line 20

**Emoji to SVG Mapping:**
```typescript
// Create /src/components/icons/index.tsx

📧 → <MailIcon />
📞 → <PhoneIcon />
📍 → <LocationIcon />
📅 → <CalendarIcon />
🎓 → <AcademicCapIcon />
🔬 → <BeakerIcon />
🌊 → <WaveIcon /> (custom)
```

**Use Heroicons (already in use):**
```typescript
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
```

---

### 3. Add Skip Navigation
**File:** `/app/layout.tsx`

**Add at the beginning of body:**
```typescript
<body className={inter.className}>
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-ocean-teal focus:text-white focus:rounded-lg"
  >
    Skip to main content
  </a>
  <Header />
  <main id="main-content">
    {children}
  </main>
  <Footer />
</body>
```

**Add to `globals.css`:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

### 4. Fix Footer Navigation Inconsistencies
**File:** `/src/components/Footer.tsx`

**Current Issues:**
- Links to `/faculty` and `/alumni` but header uses `/people`
- Links to non-existent routes: `/apply`, `/privacy`, `/accessibility`

**Solution:**
```typescript
// Update footer links to match header
<Link href="/people">Faculty & Staff</Link>
<Link href="/people?category=students">Students</Link>

// Create placeholder pages or remove links
<Link href="/academics#apply">Apply</Link>
<Link href="/about#privacy">Privacy Policy</Link>
<Link href="/about#accessibility">Accessibility</Link>
```

---

### 5. Add ARIA Labels to All Interactive Elements

**Priority Files:**

**Faculty Page:**
```typescript
<input
  type="text"
  placeholder="Search faculty..."
  aria-label="Search faculty members"
  role="searchbox"
/>

<select
  aria-label="Filter faculty by research area"
>
```

**Alumni Page:**
```typescript
<input
  aria-label="Search alumni by name or year"
  role="searchbox"
/>
```

**All Card Components:**
```typescript
<article
  role="article"
  aria-label={`${person.name} profile`}
>
```

---

## Weeks 2-3: High Priority

### 1. Create Shared Component Library

#### Button Component ✅
**File:** `/src/components/ui/Button.tsx` - CREATED

**Usage:**
```typescript
import { Button } from '@/components/ui/Button'

<Button variant="primary" size="lg" href="/academics">
  Apply Now
</Button>

<Button variant="outline" onClick={handleClick} loading={isLoading}>
  Submit
</Button>
```

---

#### Card Component
**File:** `/src/components/ui/Card.tsx`

```typescript
import React from 'react'

interface CardProps {
  children: React.ReactNode
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = true,
  padding = 'md',
  className = '',
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const hoverClass = hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 ${paddingClasses[padding]} ${hoverClass} ${className}`}>
      {children}
    </div>
  )
}

export default Card
```

---

#### Loading Component
**File:** `/src/components/ui/Loading.tsx`

```typescript
import React from 'react'

interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'dots'
  text?: string
  fullScreen?: boolean
}

export const Loading: React.FC<LoadingProps> = ({
  type = 'spinner',
  text,
  fullScreen = false,
}) => {
  if (type === 'spinner') {
    return (
      <div className={fullScreen ? 'flex items-center justify-center min-h-screen' : 'flex items-center justify-center py-12'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-ocean-light border-t-ocean-deep mx-auto mb-4"></div>
          {text && <p className="text-gray-600 font-medium">{text}</p>}
        </div>
      </div>
    )
  }

  if (type === 'skeleton') {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200"></div>
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <div className="w-3 h-3 bg-ocean-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-3 h-3 bg-ocean-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-3 h-3 bg-ocean-deep rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  )
}

export default Loading
```

---

#### Error Boundary Component
**File:** `/src/components/ui/ErrorBoundary.tsx`

```typescript
'use client'

import React from 'react'
import { Button } from './Button'

interface ErrorStateProps {
  error?: Error | string
  reset?: () => void
  title?: string
  message?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  reset,
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
}) => {
  return (
    <div className="max-w-md mx-auto text-center py-20">
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
        <svg
          className="w-16 h-16 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-bold text-red-900 mb-2">{title}</h3>
        <p className="text-red-700 mb-6">{message}</p>
        {typeof error === 'string' && (
          <p className="text-sm text-red-600 mb-4 font-mono bg-red-100 p-2 rounded">{error}</p>
        )}
        {reset && (
          <Button variant="danger" onClick={reset}>
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}

export default ErrorState
```

---

### 2. Implement Keyboard Navigation

#### Header Component Updates
**File:** `/src/components/Header.tsx`

**Add:**
```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

// Close on Escape key
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false)
    }
  }

  document.addEventListener('keydown', handleEscape)
  return () => document.removeEventListener('keydown', handleEscape)
}, [])

// Close on route change
useEffect(() => {
  setMobileMenuOpen(false)
}, [pathname])

// Focus trap
const menuRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (mobileMenuOpen) {
    const focusableElements = menuRef.current?.querySelectorAll(
      'a, button, input, [tabindex]:not([tabindex="-1"])'
    )
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus()
    }
  }
}, [mobileMenuOpen])
```

---

### 3. Add Active Navigation States

```typescript
'use client'

import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  return (
    <Link
      href="/about"
      className={`${
        isActive('/about')
          ? 'text-ocean-teal font-semibold border-b-2 border-ocean-teal'
          : 'text-gray-700 hover:text-ocean-deep'
      } transition`}
    >
      About
    </Link>
  )
}
```

---

### 4. Implement Consistent Error Handling Pattern

**Create:** `/src/lib/api.ts`

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'APIError'
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new APIError(
        response.status,
        `API Error: ${response.status} ${response.statusText}`
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Usage:
try {
  const data = await fetchAPI<{ data: Person[] }>('/api/faculties?pagination[limit]=200')
  setFaculty(data.data || [])
} catch (error) {
  if (error instanceof APIError) {
    setError(`Failed to load faculty (${error.status})`)
  } else {
    setError('Network connection failed. Please check your internet connection.')
  }
}
```

---

## Month 1: Medium Priority

### 1. Icon System Setup

**Install Heroicons if not already:**
```bash
npm install @heroicons/react
```

**Create:** `/src/components/icons/index.tsx`

```typescript
// Re-export commonly used icons with consistent naming
export {
  EnvelopeIcon as MailIcon,
  PhoneIcon,
  MapPinIcon as LocationIcon,
  CalendarIcon,
  AcademicCapIcon,
  BeakerIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  LinkIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  XMarkIcon as CloseIcon,
  Bars3Icon as MenuIcon,
  MagnifyingGlassIcon as SearchIcon,
} from '@heroicons/react/24/outline'

// Solid variants
export {
  EnvelopeIcon as MailIconSolid,
  PhoneIcon as PhoneIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
} from '@heroicons/react/24/solid'
```

---

### 2. Accessibility Testing Checklist

**Tools to use:**
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

**Tests to run on each page:**
- [ ] Keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- [ ] Screen reader testing (NVDA/JAWS/VoiceOver)
- [ ] Color contrast (WCAG AA minimum)
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Semantic HTML used
- [ ] Alt text on images
- [ ] Form labels associated
- [ ] Error messages announced

---

### 3. Performance Optimizations

#### Image Optimization
Replace all `<img>` tags with Next.js `Image`:

```typescript
import Image from 'next/image'

// Before:
<img
  src={person.photo_url}
  alt={person.name}
  loading="lazy"
/>

// After:
<Image
  src={person.photo_url}
  alt={person.name}
  width={128}
  height={128}
  className="rounded-full object-cover"
/>
```

---

## Page-by-Page Improvements

### Faculty Page → Merge with People Page

**Recommendation:** The `/faculty` page is redundant with `/people?category=faculty`

**Migration Plan:**
1. Ensure `/people` page has all features from `/faculty`
2. Add redirect:

```typescript
// /app/faculty/page.tsx
import { redirect } from 'next/navigation'

export default function FacultyPage() {
  redirect('/people?category=faculty')
}
```

---

### Contact Page Improvements

**Priority Changes:**
1. Replace emojis with icons
2. Implement real form submission
3. Add form validation
4. Add CAPTCHA
5. Add success/error announcements

**Example:**
```typescript
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setStatus('loading')

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      setStatus('success')
      // Announce to screen readers
      const announcement = document.createElement('div')
      announcement.setAttribute('role', 'status')
      announcement.setAttribute('aria-live', 'polite')
      announcement.textContent = 'Your message has been sent successfully!'
      document.body.appendChild(announcement)
      setTimeout(() => announcement.remove(), 3000)
    } else {
      throw new Error()
    }
  } catch (error) {
    setStatus('error')
  }
}
```

---

### Alumni Page Improvements

**Changes Needed:**
1. Replace LinkedIn emoji with icon
2. Add pagination or infinite scroll
3. Connect to real API
4. Add search/filter functionality similar to People page

---

### Events Page Improvements

**Changes Needed:**
1. Replace calendar emoji with CalendarIcon
2. Make subscribe button functional
3. Add iCal/Google Calendar export
4. Add recurring events support

---

## Testing Implementation

### Create Test File Structure

```
/frontend/tests/
  ├── accessibility/
  │   ├── header.spec.ts
  │   ├── footer.spec.ts
  │   ├── people.spec.ts
  │   └── all-pages.spec.ts
  ├── integration/
  │   ├── navigation.spec.ts
  │   ├── forms.spec.ts
  │   └── search.spec.ts
  └── e2e/
      ├── user-journeys.spec.ts
      └── critical-paths.spec.ts
```

### Sample Accessibility Test

**File:** `/tests/accessibility/people.spec.ts`

```typescript
import { test, expect } from '@playwright/test'

test.describe('People Page - Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/people')

    const searchInput = page.locator('input[type="search"]')
    await expect(searchInput).toHaveAttribute('aria-label')

    const tabs = page.locator('[role="tab"]')
    for (let i = 0; i < await tabs.count(); i++) {
      await expect(tabs.nth(i)).toHaveAttribute('aria-selected')
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/people')

    // Tab through all interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Verify focus is visible
    const focused = page.locator(':focus')
    await expect(focused).toBeVisible()
  })

  test('should meet color contrast requirements', async ({ page }) => {
    await page.goto('/people')

    // Run axe accessibility tests
    // Requires @axe-core/playwright
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toHaveLength(0)
  })
})
```

---

## Implementation Checklist

### Week 1
- [ ] Create `.env.local` with API_URL
- [ ] Update all API calls to use environment variable
- [ ] Add skip navigation link
- [ ] Replace emojis in contact page
- [ ] Replace emojis in faculty page
- [ ] Replace emojis in events page
- [ ] Fix footer navigation links
- [ ] Add ARIA labels to faculty page
- [ ] Add ARIA labels to alumni page

### Week 2-3
- [x] Create Button component
- [ ] Create Card component
- [ ] Create Loading component
- [ ] Create ErrorState component
- [ ] Create icon system
- [ ] Update Header with active states
- [ ] Add keyboard navigation to Header
- [ ] Implement focus trap in mobile menu
- [ ] Create API utility with error handling
- [ ] Update all pages to use new components

### Month 1
- [ ] Replace all img tags with Next.js Image
- [ ] Implement form validation on contact page
- [ ] Add real form submission
- [ ] Run accessibility audit with axe
- [ ] Fix all color contrast issues
- [ ] Add aria-live regions for dynamic content
- [ ] Create design system documentation
- [ ] Write Playwright tests for all pages

### Month 2
- [ ] Implement data caching with SWR
- [ ] Migrate to Server Components where possible
- [ ] Add analytics
- [ ] Performance optimization pass
- [ ] Add animations with accessibility
- [ ] Comprehensive testing suite
- [ ] Launch preparation

---

## Success Metrics

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Lighthouse accessibility score > 95
- [ ] axe DevTools 0 violations
- [ ] Keyboard navigation 100% functional

### Performance
- [ ] Lighthouse performance score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Cumulative Layout Shift < 0.1

### UX
- [ ] All interactive elements have hover/focus states
- [ ] Loading states for all async operations
- [ ] Error handling for all API calls
- [ ] Mobile responsive on all pages
- [ ] Consistent design language

---

## Reference: Best Practices

### Do's ✅
- Use semantic HTML (article, section, nav, main, header, footer)
- Add ARIA labels to all interactive elements
- Use SVG icons with aria-hidden="true"
- Implement keyboard navigation
- Add loading and error states
- Use Next.js Image for all images
- Add alt text to all images
- Use environment variables for config
- Implement proper focus management
- Add skip navigation links

### Don'ts ❌
- Don't use emojis as UI elements
- Don't hardcode API URLs
- Don't ignore error states
- Don't use generic error messages
- Don't skip loading states
- Don't forget mobile testing
- Don't use div when button is appropriate
- Don't ignore color contrast
- Don't assume all users use mouse
- Don't skip accessibility testing

---

## Conclusion

This improvement plan will transform the EEMB website into a world-class, accessible, and performant application. Follow the checklist systematically, starting with Week 1 priorities.

**Current Status:**
- People page is the gold standard ⭐
- Contact, Faculty, Alumni pages need most work
- All pages need emoji replacement
- Environment variables needed site-wide

**Next Steps:**
1. Start with Week 1 checklist
2. Test each change thoroughly
3. Document as you go
4. Run accessibility tests frequently
5. Get user feedback early and often

---

*Last Updated: [Current Date]*
*Maintained by: EEMB Web Team*
