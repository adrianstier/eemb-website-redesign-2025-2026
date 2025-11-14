# Testing Checklist & Requirements
## Comprehensive Testing Standards for EEMB Website

**Purpose:** Ensure every feature has comprehensive test coverage including edge cases

---

## 🎯 Testing Philosophy

### Test-Driven Development (TDD)
```
1. RED:    Write failing test
2. GREEN:  Write minimal code to pass
3. REFACTOR: Improve code while keeping tests green
4. REPEAT: Next feature
```

**Why TDD:**
- Catches bugs early
- Forces good design
- Documents behavior
- Enables confident refactoring
- Prevents regressions

---

## 📊 Coverage Requirements

### Minimum Coverage Targets
- **Unit tests:** >80% line coverage
- **Integration tests:** All data flows covered
- **E2E tests:** All critical user journeys
- **Accessibility:** 100% WCAG 2.1 AA compliance

### Before Committing
```bash
npm run test              # All tests must pass
npm run test:coverage     # Check coverage >80%
npm run lint              # No linting errors
npm run type-check        # No TypeScript errors
```

---

## 🧪 Test Categories

### 1. Unit Tests (Fast, Isolated)

**Purpose:** Test individual functions/components in isolation

**Location:** `/tests/unit/[module].test.ts`

**Template:**
```typescript
import { functionUnderTest } from '@/lib/utils';

describe('functionUnderTest', () => {
  describe('Happy path', () => {
    it('should return correct output for valid input', () => {
      const result = functionUnderTest('valid');
      expect(result).toBe('expected');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string', () => {
      expect(functionUnderTest('')).toBe('default');
    });

    it('should handle null', () => {
      expect(() => functionUnderTest(null)).toThrow();
    });

    it('should handle very long input', () => {
      const long = 'a'.repeat(10000);
      expect(functionUnderTest(long)).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should throw for invalid input', () => {
      expect(() => functionUnderTest(123)).toThrow('Invalid type');
    });
  });
});
```

**Run:**
```bash
npm run test:unit
npm run test:unit -- --watch  # Watch mode
npm run test:unit -- --coverage  # With coverage
```

### 2. Integration Tests (Component + Data)

**Purpose:** Test multiple components working together

**Location:** `/tests/integration/[feature].test.ts`

**Example:** Faculty Directory
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FacultyDirectory from '@/app/people/faculty/page';
import { getFaculty } from '@/lib/api';

// Mock API
jest.mock('@/lib/api');

describe('Faculty Directory Integration', () => {
  beforeEach(() => {
    (getFaculty as jest.Mock).mockResolvedValue([
      { id: '1', name: 'Jane Smith', researchAreas: ['ecology'] },
      { id: '2', name: 'John Doe', researchAreas: ['evolution'] }
    ]);
  });

  it('loads and displays faculty', async () => {
    render(<FacultyDirectory />);

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('filters by research area', async () => {
    const user = userEvent.setup();
    render(<FacultyDirectory />);

    await waitFor(() => screen.getByText('Jane Smith'));

    // Click ecology filter
    const filter = screen.getByLabelText(/ecology/i);
    await user.click(filter);

    // Only ecology faculty shown
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('handles empty results', async () => {
    (getFaculty as jest.Mock).mockResolvedValue([]);
    render(<FacultyDirectory />);

    await waitFor(() => {
      expect(screen.getByText(/no faculty found/i)).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    (getFaculty as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(<FacultyDirectory />);

    await waitFor(() => {
      expect(screen.getByText(/error loading faculty/i)).toBeInTheDocument();
    });
  });
});
```

**Run:**
```bash
npm run test:integration
```

### 3. End-to-End (E2E) Tests (Full User Flows)

**Purpose:** Test complete user journeys

**Location:** `/tests/e2e/[flow].spec.ts`

**Tool:** Playwright

**Example:** Browse and view faculty
```typescript
import { test, expect } from '@playwright/test';

test.describe('Faculty Directory User Flow', () => {
  test('user can browse and view faculty profile', async ({ page }) => {
    // Navigate to faculty directory
    await page.goto('/people/faculty');

    // Wait for page load
    await expect(page.locator('h1')).toContainText('Faculty');

    // Faculty cards should be visible
    const facultyCards = page.locator('[data-testid="faculty-card"]');
    await expect(facultyCards).toHaveCount(await facultyCards.count());

    // Click first faculty
    await facultyCards.first().click();

    // Should navigate to profile
    await expect(page).toHaveURL(/\/people\/faculty\/[a-z-]+/);

    // Profile content should load
    await expect(page.locator('[data-testid="faculty-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="faculty-bio"]')).toBeVisible();
    await expect(page.locator('[data-testid="faculty-photo"]')).toBeVisible();
  });

  test('user can filter faculty by research area', async ({ page }) => {
    await page.goto('/people/faculty');

    // Count initial faculty
    const initialCount = await page.locator('[data-testid="faculty-card"]').count();

    // Apply ecology filter
    await page.click('text=Ecology');

    // Wait for results to update
    await page.waitForTimeout(500);

    // Count should change
    const filteredCount = await page.locator('[data-testid="faculty-card"]').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('page is accessible', async ({ page }) => {
    await page.goto('/people/faculty');

    // Run axe accessibility scan
    const accessibilityResults = await page.evaluate(async () => {
      // @ts-ignore
      return await axe.run();
    });

    expect(accessibilityResults.violations).toEqual([]);
  });
});
```

**Run:**
```bash
npx playwright test
npx playwright test --ui  # With UI
npx playwright test --headed  # See browser
npx playwright test --debug  # Debug mode
```

---

## 🎯 Edge Cases: The Comprehensive List

**MUST test these categories for EVERY feature:**

### 1. Data States

#### Empty/Null States
- [ ] Empty array (`[]`)
- [ ] Empty string (`""`)
- [ ] Null (`null`)
- [ ] Undefined (`undefined`)
- [ ] Empty object (`{}`)

**Example:**
```typescript
it('should handle empty faculty list', () => {
  const result = renderFacultyList([]);
  expect(result).toContain('No faculty found');
});

it('should handle null name', () => {
  expect(() => createFaculty({ name: null })).toThrow();
});
```

#### Single Item
- [ ] Exactly 1 item (layout doesn't break)

**Example:**
```typescript
it('should display single faculty correctly', () => {
  const result = renderFacultyList([oneFaculty]);
  expect(result).toHaveLength(1);
  expect(layoutIsBroken(result)).toBe(false);
});
```

#### Many Items
- [ ] 100+ items (pagination, performance)
- [ ] 1000+ items (stress test)

**Example:**
```typescript
it('should handle 100 faculty efficiently', async () => {
  const manyFaculty = generateFaculty(100);
  const startTime = Date.now();

  const result = await getFaculty();
  const endTime = Date.now();

  expect(endTime - startTime).toBeLessThan(200); // <200ms
  expect(result).toHaveLength(100);
});
```

### 2. Input Validation

#### Invalid Types
- [ ] String instead of number
- [ ] Number instead of string
- [ ] Object instead of primitive
- [ ] Array instead of object

**Example:**
```typescript
it('should reject string for numeric field', () => {
  expect(() => createFaculty({ graduationYear: 'twenty' })).toThrow('Invalid type');
});
```

#### Invalid Formats
- [ ] Invalid email (`test@`, `@example.com`, `test`)
- [ ] Invalid URL (`not-a-url`, `http:/`, `ftp://invalid`)
- [ ] Invalid date (`2025-13-45`, `not-a-date`)
- [ ] Invalid phone (`abc-def-ghij`)

**Example:**
```typescript
describe('Email validation', () => {
  const invalidEmails = [
    'test@',
    '@example.com',
    'test',
    'test@@example.com',
    'test @example.com',
    'test@.com'
  ];

  invalidEmails.forEach(email => {
    it(`should reject invalid email: ${email}`, () => {
      expect(() => createFaculty({ email })).toThrow('Invalid email');
    });
  });
});
```

#### Out of Range
- [ ] Negative numbers (when must be positive)
- [ ] Zero (when must be >0)
- [ ] Too large (exceeds max)
- [ ] Too small (below min)

**Example:**
```typescript
it('should reject graduation year before 1900', () => {
  expect(() => createAlumni({ graduationYear: 1899 })).toThrow();
});

it('should reject graduation year after 2050', () => {
  expect(() => createAlumni({ graduationYear: 2051 })).toThrow();
});
```

#### Special Characters
- [ ] Unicode characters (`üñíçödé`)
- [ ] Emojis (`👋🎉💻`)
- [ ] SQL injection (`'; DROP TABLE faculty;--`)
- [ ] XSS attempts (`<script>alert('xss')</script>`)
- [ ] Path traversal (`../../../etc/passwd`)

**Example:**
```typescript
it('should accept unicode in names', () => {
  const faculty = createFaculty({ name: 'José María Pérez' });
  expect(faculty.name).toBe('José María Pérez');
});

it('should sanitize SQL injection attempts', () => {
  const malicious = "'; DROP TABLE faculty;--";
  const faculty = createFaculty({ bio: malicious });
  expect(faculty.bio).not.toContain('DROP TABLE');
});

it('should sanitize XSS attempts', () => {
  const malicious = '<script>alert("xss")</script>';
  const faculty = createFaculty({ bio: malicious });
  expect(faculty.bio).not.toContain('<script>');
});
```

### 3. Boundary Conditions

#### String Length
- [ ] Empty string (length = 0)
- [ ] Single character (length = 1)
- [ ] Max length (e.g., 255 chars)
- [ ] Just over max (256 chars)
- [ ] Very long (10,000+ chars)

**Example:**
```typescript
describe('Name length validation', () => {
  it('should accept name up to 255 chars', () => {
    const name = 'a'.repeat(255);
    expect(() => createFaculty({ name })).not.toThrow();
  });

  it('should truncate name over 255 chars', () => {
    const name = 'a'.repeat(300);
    const faculty = createFaculty({ name });
    expect(faculty.name).toHaveLength(255);
  });
});
```

#### Numeric Ranges
- [ ] Minimum value (e.g., 0, 1, 1900)
- [ ] Just below minimum
- [ ] Maximum value (e.g., 2050, 100, 999999)
- [ ] Just above maximum
- [ ] Negative (when should be positive)
- [ ] Decimal (when should be integer)

**Example:**
```typescript
describe('Graduation year boundaries', () => {
  it('should accept 1900', () => {
    expect(() => createAlumni({ graduationYear: 1900 })).not.toThrow();
  });

  it('should reject 1899', () => {
    expect(() => createAlumni({ graduationYear: 1899 })).toThrow();
  });

  it('should accept 2050', () => {
    expect(() => createAlumni({ graduationYear: 2050 })).not.toThrow();
  });

  it('should reject 2051', () => {
    expect(() => createAlumni({ graduationYear: 2051 })).toThrow();
  });
});
```

#### Date/Time
- [ ] Past dates (1900, 1970, yesterday)
- [ ] Today
- [ ] Future dates (tomorrow, 2050, 2100)
- [ ] Leap year (Feb 29, 2024)
- [ ] Invalid dates (Feb 30, month 13)
- [ ] Timezone edge cases (UTC vs local)

### 4. Error Conditions

#### Network Errors
- [ ] Fetch fails (network offline)
- [ ] Timeout (>5 seconds)
- [ ] Slow response (2-5 seconds)

**Example:**
```typescript
it('should show error message on network failure', async () => {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

  const { getByText } = render(<FacultyDirectory />);

  await waitFor(() => {
    expect(getByText(/error loading faculty/i)).toBeInTheDocument();
  });
});

it('should show timeout message after 5 seconds', async () => {
  jest.spyOn(global, 'fetch').mockImplementation(() =>
    new Promise(resolve => setTimeout(resolve, 6000))
  );

  const { getByText } = render(<FacultyDirectory />);

  await waitFor(() => {
    expect(getByText(/taking too long/i)).toBeInTheDocument();
  }, { timeout: 6000 });
});
```

#### HTTP Status Codes
- [ ] 200 OK (success)
- [ ] 201 Created
- [ ] 400 Bad Request
- [ ] 401 Unauthorized
- [ ] 403 Forbidden
- [ ] 404 Not Found
- [ ] 500 Internal Server Error
- [ ] 503 Service Unavailable

**Example:**
```typescript
describe('HTTP error handling', () => {
  it('should handle 404', async () => {
    mockFetch.mockResolvedValue({ status: 404 });
    expect(await getFaculty()).toThrow('Not found');
  });

  it('should handle 500', async () => {
    mockFetch.mockResolvedValue({ status: 500 });
    expect(await getFaculty()).toThrow('Server error');
  });
});
```

#### Invalid API Responses
- [ ] Missing required fields
- [ ] Wrong data types
- [ ] Malformed JSON
- [ ] Empty response

**Example:**
```typescript
it('should handle missing required field', async () => {
  mockFetch.mockResolvedValue({
    json: async () => ({ name: 'Jane' }) // missing email
  });

  expect(() => parseFaculty(response)).toThrow('Missing email');
});

it('should handle malformed JSON', async () => {
  mockFetch.mockResolvedValue({
    text: async () => '{invalid json'
  });

  expect(() => getFaculty()).toThrow('Invalid JSON');
});
```

### 5. Concurrency & Race Conditions

#### Multiple Requests
- [ ] Two requests at once
- [ ] Request while previous is pending
- [ ] Cancel previous request when new one starts

**Example:**
```typescript
it('should cancel previous request when new one starts', async () => {
  const controller1 = new AbortController();
  const controller2 = new AbortController();

  const request1 = getFaculty({ signal: controller1.signal });
  const request2 = getFaculty({ signal: controller2.signal });

  controller1.abort();

  expect(controller1.signal.aborted).toBe(true);
  await expect(request1).rejects.toThrow('Aborted');
  await expect(request2).resolves.toBeDefined();
});
```

#### State Changes
- [ ] Update while loading
- [ ] Delete while updating
- [ ] Multiple updates in rapid succession

### 6. User Interactions

#### Click Events
- [ ] Single click
- [ ] Double click
- [ ] Click while disabled
- [ ] Click outside target (miss)

**Example:**
```typescript
it('should not trigger onClick when disabled', async () => {
  const onClick = jest.fn();
  const { getByRole } = render(<Button onClick={onClick} disabled />);

  const button = getByRole('button');
  await userEvent.click(button);

  expect(onClick).not.toHaveBeenCalled();
});
```

#### Form Submissions
- [ ] Submit with valid data
- [ ] Submit with invalid data
- [ ] Submit while previous submission pending
- [ ] Submit empty form

**Example:**
```typescript
it('should prevent double submission', async () => {
  const onSubmit = jest.fn(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  const { getByRole } = render(<Form onSubmit={onSubmit} />);
  const submit = getByRole('button', { name: /submit/i });

  // Click twice rapidly
  await userEvent.click(submit);
  await userEvent.click(submit);

  // Should only submit once
  expect(onSubmit).toHaveBeenCalledTimes(1);
});
```

#### Keyboard Navigation
- [ ] Tab through elements
- [ ] Enter to submit
- [ ] Escape to cancel/close
- [ ] Arrow keys for navigation

**Example:**
```typescript
it('should navigate with Tab key', async () => {
  const { getByRole } = render(<Form />);

  const input1 = getByRole('textbox', { name: /name/i });
  const input2 = getByRole('textbox', { name: /email/i });

  input1.focus();
  expect(document.activeElement).toBe(input1);

  await userEvent.tab();
  expect(document.activeElement).toBe(input2);
});

it('should submit on Enter', async () => {
  const onSubmit = jest.fn();
  const { getByRole } = render(<Form onSubmit={onSubmit} />);

  const input = getByRole('textbox');
  await userEvent.type(input, '{Enter}');

  expect(onSubmit).toHaveBeenCalled();
});
```

### 7. Responsive Design

#### Viewport Sizes
- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px - 1439px)
- [ ] Wide (1440px+)

**Example:**
```typescript
describe('Responsive layout', () => {
  it('should show mobile layout at 320px', () => {
    window.innerWidth = 320;
    const { container } = render(<FacultyDirectory />);
    expect(container.querySelector('.mobile-layout')).toBeInTheDocument();
  });

  it('should show desktop layout at 1024px', () => {
    window.innerWidth = 1024;
    const { container } = render(<FacultyDirectory />);
    expect(container.querySelector('.desktop-layout')).toBeInTheDocument();
  });
});
```

#### Touch vs Mouse
- [ ] Touch events (mobile)
- [ ] Mouse events (desktop)
- [ ] Hover states (desktop only)

### 8. Performance

#### Load Time
- [ ] Initial page load <3 seconds
- [ ] API response <200ms
- [ ] Image loading (lazy load)
- [ ] Code splitting (async imports)

**Example:**
```typescript
it('should load page in under 3 seconds', async () => {
  const startTime = performance.now();
  render(<FacultyDirectory />);
  await waitFor(() => screen.getByText(/jane smith/i));
  const endTime = performance.now();

  expect(endTime - startTime).toBeLessThan(3000);
});
```

#### Memory Leaks
- [ ] Event listeners cleaned up
- [ ] Timers cleared
- [ ] Subscriptions unsubscribed

**Example:**
```typescript
it('should cleanup event listeners on unmount', () => {
  const { unmount } = render(<Component />);
  const initialListeners = getEventListeners(window).length;

  unmount();

  const finalListeners = getEventListeners(window).length;
  expect(finalListeners).toBe(initialListeners);
});
```

---

## 🎨 Component-Specific Tests

### React Components

#### Rendering
```typescript
describe('FacultyCard', () => {
  it('should render without crashing', () => {
    expect(() => render(<FacultyCard faculty={mockFaculty} />)).not.toThrow();
  });

  it('should display faculty name', () => {
    const { getByText } = render(<FacultyCard faculty={mockFaculty} />);
    expect(getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should show photo with alt text', () => {
    const { getByAltText } = render(<FacultyCard faculty={mockFaculty} />);
    expect(getByAltText(/jane smith/i)).toBeInTheDocument();
  });
});
```

#### Props Validation
```typescript
describe('Props validation', () => {
  it('should require faculty prop', () => {
    // @ts-expect-error Missing required prop
    expect(() => render(<FacultyCard />)).toThrow();
  });

  it('should accept optional variant prop', () => {
    expect(() => render(<FacultyCard faculty={mockFaculty} variant="compact" />)).not.toThrow();
  });
});
```

#### State Management
```typescript
describe('State management', () => {
  it('should toggle expanded state on click', async () => {
    const { getByRole, queryByText } = render(<FacultyCard faculty={mockFaculty} />);

    // Initially collapsed
    expect(queryByText(/full bio/i)).not.toBeInTheDocument();

    // Click to expand
    await userEvent.click(getByRole('button', { name: /read more/i }));

    // Now expanded
    expect(queryByText(/full bio/i)).toBeInTheDocument();
  });
});
```

### API Clients

#### Success Cases
```typescript
describe('getFaculty', () => {
  it('should fetch faculty from API', async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({ data: [mockFaculty] })
    });

    const result = await getFaculty();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Jane Smith');
  });
});
```

#### Error Handling
```typescript
describe('Error handling', () => {
  it('should retry on network error', async () => {
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ json: async () => ({ data: [] }) });

    const result = await getFaculty({ retries: 1 });

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(result).toBeDefined();
  });

  it('should throw after max retries', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(getFaculty({ retries: 3 })).rejects.toThrow('Network error');
    expect(mockFetch).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
  });
});
```

---

## ♿ Accessibility Testing

### Automated Tests
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<FacultyDirectory />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### Keyboard Navigation
```typescript
describe('Keyboard accessibility', () => {
  it('should be keyboard navigable', async () => {
    const { getAllByRole } = render(<Navigation />);
    const links = getAllByRole('link');

    // Tab through all links
    links[0].focus();
    expect(document.activeElement).toBe(links[0]);

    await userEvent.tab();
    expect(document.activeElement).toBe(links[1]);
  });

  it('should have visible focus indicators', () => {
    const { getByRole } = render(<Button>Click me</Button>);
    const button = getByRole('button');

    button.focus();

    const styles = window.getComputedStyle(button);
    expect(styles.outline).not.toBe('none');
  });
});
```

### Screen Reader
```typescript
describe('Screen reader accessibility', () => {
  it('should have proper ARIA labels', () => {
    const { getByRole } = render(<SearchBar />);
    const input = getByRole('searchbox');
    expect(input).toHaveAttribute('aria-label', 'Search faculty');
  });

  it('should announce loading state', () => {
    const { getByRole } = render(<FacultyDirectory />);
    expect(getByRole('status')).toHaveTextContent('Loading faculty');
  });
});
```

### Color Contrast
```typescript
it('should meet color contrast requirements', () => {
  const { getByText } = render(<Button>Click me</Button>);
  const button = getByText('Click me');

  const styles = window.getComputedStyle(button);
  const contrastRatio = calculateContrastRatio(
    styles.color,
    styles.backgroundColor
  );

  expect(contrastRatio).toBeGreaterThanOrEqual(4.5); // WCAG AA
});
```

---

## 📝 Test Documentation Template

**Every test file should start with:**

```typescript
/**
 * Tests for [Component/Function Name]
 *
 * @module tests/[category]/[name]
 *
 * Purpose:
 * [Brief description of what's being tested]
 *
 * Coverage:
 * - [List what's covered]
 * - [Be specific]
 *
 * Edge Cases:
 * - [List edge cases tested]
 * - [Include rationale]
 *
 * Known Issues:
 * - [Any known limitations or TODOs]
 *
 * Related:
 * - Source: /path/to/source/file
 * - Docs: /docs/path
 *
 * @see /docs/testing/testing-strategy.md
 */

import { ... } from '...';

describe('[ComponentName]', () => {
  // Tests here
});
```

---

## ✅ Pre-Commit Checklist

**Before committing ANY code:**

```markdown
## Test Checklist

- [ ] All tests written BEFORE production code (TDD)
- [ ] All tests passing: npm run test
- [ ] Coverage >80%: npm run test:coverage
- [ ] No linting errors: npm run lint
- [ ] No TypeScript errors: npm run type-check
- [ ] Edge cases covered (minimum 3 per function)
- [ ] Integration tests for data flows
- [ ] E2E tests for user journeys (if applicable)
- [ ] Accessibility tests passing
- [ ] Performance acceptable
- [ ] No console.log() in production code
- [ ] No commented-out code
- [ ] Test file documented
```

---

## 🚀 Running Tests

### All Tests
```bash
npm run test                    # All tests
npm run test -- --watch         # Watch mode
npm run test:coverage           # With coverage report
npm run test -- --verbose       # Verbose output
```

### Specific Tests
```bash
npm run test:unit               # Unit tests only
npm run test:integration        # Integration tests only
npm run test:e2e                # E2E tests only
npm run test -- faculty         # Tests matching "faculty"
npm run test -- --testPathPattern=faculty  # File path matching
```

### Coverage
```bash
npm run test:coverage           # Generate coverage
open coverage/lcov-report/index.html  # View report
```

### E2E Tests
```bash
npx playwright test             # Run all E2E
npx playwright test --headed    # See browser
npx playwright test --ui        # Interactive UI
npx playwright test --debug     # Debug mode
npx playwright codegen          # Generate tests
```

### Accessibility
```bash
npm run test:a11y               # Run axe tests
npm run lighthouse              # Lighthouse audit
```

---

## 🎯 Success Criteria

**A feature is COMPLETE when:**

1. ✅ All tests written (TDD approach)
2. ✅ All tests passing (100%)
3. ✅ Coverage >80%
4. ✅ Edge cases covered (minimum 3)
5. ✅ Integration tests work
6. ✅ E2E tests work (if applicable)
7. ✅ Accessibility tests pass
8. ✅ Performance acceptable
9. ✅ Documentation complete
10. ✅ Code reviewed and approved

**NO EXCEPTIONS.**

---

## 📚 Reference

- Jest Documentation: https://jestjs.io/
- React Testing Library: https://testing-library.com/react
- Playwright: https://playwright.dev/
- axe-core: https://github.com/dequelabs/axe-core

---

**This checklist is your contract. Follow it religiously. Your future self will thank you.**
