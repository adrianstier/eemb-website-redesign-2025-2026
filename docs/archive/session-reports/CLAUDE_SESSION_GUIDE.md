# Claude Code Session Management Guide
## How to Work with Claude Across Multiple Sessions (Context Window Management)

**Problem:** Claude Code has a context window limit and will eventually "forget" previous work.

**Solution:** This guide ensures seamless handoffs between sessions with comprehensive testing enforcement.

---

## 🚀 Quick Start: Copy-Paste at Session Start

### **Option 1: Full Context (Use This for Complex Tasks)**

```markdown
# EEMB Website Session Start

Hi Claude! Continuing EEMB website build.

## Project
- UCSB EEMB department website
- Backend: Strapi 4.x CMS + PostgreSQL
- Frontend: Next.js 14 + TypeScript + Tailwind
- Goal: Non-technical content management + Alumni platform

## Read These Files First
1. PROJECT_CONTEXT.md (current status, what's done, what's next)
2. PROGRESS_TRACKER.md (detailed progress by week/day)
3. This session: [file path to SESSION_PLAN.md]

## Key References
- Architecture: /planning documents/REVISED_comprehensive_technical_architecture.md
- Roadmap: /planning documents/REVISED_claude_code_execution_roadmap.md
- Repository Guide: /planning documents/REVISED_repository_organization_guide.md

## Testing Requirements (ENFORCE THESE)
- Write tests FIRST (TDD approach)
- Minimum 3 edge cases per function
- Unit + Integration + E2E (where applicable)
- All tests must pass before committing
- Coverage target: >80%

## This Session Goal
[Specific task from SESSION_PLAN.md]

Ready to start?
```

### **Option 2: Minimal Context (Use This for Simple Tasks)**

```markdown
# Quick Session Start

Project: EEMB website (Strapi + Next.js)
Current: Week [X], Day [Y] - [task name]
Last done: [completed task]
This session: [specific task]

Read: PROJECT_CONTEXT.md (Current Status section)

Tests required: [list specific tests]
Edge cases: [list at least 3]

Ready?
```

---

## 📁 Essential Files You'll Reference

### **1. PROJECT_CONTEXT.md** - ALWAYS START HERE
- **Location:** `/PROJECT_CONTEXT.md`
- **Purpose:** Single source of truth, updated every session
- **What to read:** "Current Status" section (top of file)

### **2. PROGRESS_TRACKER.md** - Track Completion
- **Location:** `/PROGRESS_TRACKER.md`
- **Purpose:** Detailed progress by week/day with test results
- **What to update:** Mark tasks complete, add test counts

### **3. SESSION_PLAN.md** - Current Session Tasks
- **Location:** `/SESSION_PLAN.md` (you create before each session)
- **Purpose:** Detailed task list for THIS session only
- **What to include:** Tasks, tests, success criteria

### **4. TESTING_CHECKLIST.md** - Enforce Quality
- **Location:** `/TESTING_CHECKLIST.md`
- **Purpose:** Comprehensive testing requirements
- **What to reference:** Edge cases, test templates

---

## 📝 Before Starting ANY Session

### **Step 1: Update PROJECT_CONTEXT.md (5 minutes)**

Open `/PROJECT_CONTEXT.md` and update:

```markdown
## Current Status (Updated: [Date], [Time])

### Last Session Completed:
- Week [X], Day [Y]: [Task name]
- Files created/modified:
  * /path/to/file1
  * /path/to/file2
- Tests: [X]/[X] passing, coverage: [X]%
- Committed: [commit message]

### Next Session Goal:
- Week [X], Day [Y]: [Next task]
- Estimated time: [X] hours
- Tests needed: [X]+ (including [X] edge cases)

### Known Issues/Blockers:
- [List any issues or "None currently"]

### Files to Reference:
- [List relevant files for next session]
```

### **Step 2: Create SESSION_PLAN.md (5 minutes)**

Create `/SESSION_PLAN.md` with:

```markdown
# Session Plan: [Task Name]
Date: [Date]
Duration: [X] hours (estimated)

## Goal
[One sentence: what we're building]

## Tasks (in order)
1. [ ] Review relevant docs
2. [ ] Write test file FIRST (TDD)
3. [ ] Implement feature
4. [ ] Verify all tests pass
5. [ ] Test integration/E2E
6. [ ] Document in relevant files
7. [ ] Update PROJECT_CONTEXT.md
8. [ ] Commit with clear message

## Tests Required (Write BEFORE Code)
- [ ] [Test 1 description]
- [ ] [Test 2 description]
- [ ] [Test 3 description]

### Edge Cases (MANDATORY - at least 3):
- [ ] Empty/null data
- [ ] Invalid input
- [ ] Boundary conditions
- [ ] Error states
- [ ] Performance (large datasets)

### Integration Tests:
- [ ] API endpoint works
- [ ] Data flows correctly
- [ ] Error handling works

### E2E Tests (if applicable):
- [ ] User flow works end-to-end

## Success Criteria
This session is complete when:
1. All [X] tests passing
2. Coverage >[X]%
3. Feature works in dev environment
4. Documentation updated
5. Committed to Git

## Reference Documents
- Architecture: [Page X-Y in architecture doc]
- Similar component: [Path to example]
- API docs: [Relevant endpoint]

## Time Checkpoints
- 30 min: Tests written
- 1 hour: Basic implementation done
- 1.5 hours: All tests passing
- 2 hours: Documentation + commit
```

---

## 🧪 Testing Enforcement System

### **TESTING_RULES.md (Reference This Every Session)**

Tell Claude to follow these rules:

```markdown
## Non-Negotiable Testing Rules

### 1. TDD Approach (Test-Driven Development)
```
┌─────────────────────────────────────┐
│  RED → GREEN → REFACTOR             │
│                                     │
│  1. Write failing test (RED)       │
│  2. Write minimal code to pass     │
│  3. Test passes (GREEN)            │
│  4. Refactor while keeping green   │
└─────────────────────────────────────┘
```

**Enforcement:**
- NO production code without tests first
- Tests must fail initially (prove they work)
- Only write code to make tests pass

### 2. Edge Case Requirements

**For EVERY feature, test these categories:**

1. **Data States:**
   - Empty ([], "", null, undefined)
   - Single item
   - Many items (100+)
   - Maximum limits

2. **Input Validation:**
   - Valid input (happy path)
   - Invalid type (string instead of number)
   - Invalid format (email, URL, date)
   - Out of range (negative, too large)
   - Special characters (unicode, emojis)
   - SQL injection attempts
   - XSS attempts

3. **Error Conditions:**
   - Network failure (fetch fails)
   - Timeout (>5 seconds)
   - 404 Not Found
   - 500 Server Error
   - 401 Unauthorized
   - 403 Forbidden

4. **Boundary Conditions:**
   - Min value (0, 1)
   - Max value (limits)
   - Just below min
   - Just above max

5. **Concurrency:**
   - Multiple simultaneous requests
   - Rapid repeated clicks
   - Race conditions

6. **State Changes:**
   - Before data loads (loading state)
   - After data loads (success state)
   - After error (error state)
   - After retry (recovery)

### 3. Test Coverage Requirements

**Minimum coverage targets:**
- Unit tests: >80%
- Integration tests: All data flows
- E2E tests: All critical user journeys
- Accessibility tests: WCAG 2.1 AA

**Before committing:**
```bash
npm run test              # All tests pass
npm run test:coverage     # Check coverage
npm run lint              # No lint errors
npm run type-check        # No TypeScript errors
```

### 4. Test File Structure

**Every test file must have:**

```typescript
describe('[ComponentName] or [FunctionName]', () => {
  // Setup/teardown
  beforeEach(() => {
    // Setup test environment
  });

  afterEach(() => {
    // Cleanup
  });

  // Happy path tests
  describe('Happy path', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      const input = validInput;

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe(expectedOutput);
    });
  });

  // Edge case tests (MANDATORY)
  describe('Edge cases', () => {
    it('should handle empty data', () => { /* test */ });
    it('should handle null/undefined', () => { /* test */ });
    it('should validate input format', () => { /* test */ });
    it('should handle boundary conditions', () => { /* test */ });
    it('should handle very large datasets', () => { /* test */ });
  });

  // Error handling tests
  describe('Error handling', () => {
    it('should throw error for invalid input', () => { /* test */ });
    it('should return proper error message', () => { /* test */ });
    it('should not crash on network failure', () => { /* test */ });
    it('should retry on timeout', () => { /* test */ });
  });

  // Performance tests (if applicable)
  describe('Performance', () => {
    it('should complete in <200ms for 100 items', () => { /* test */ });
  });
});
```

### 5. Test Documentation

**Every test must be documented:**

```typescript
/**
 * Tests the Faculty content type validation
 *
 * Coverage:
 * - Required fields: firstName, lastName, email, title
 * - Optional fields: phone, office, pronouns
 * - Email format validation
 * - Unique email constraint
 * - Relations: researchAreas (many-to-many)
 *
 * Edge cases:
 * - Very long names (>255 chars) - should truncate
 * - Invalid email formats - should reject
 * - Duplicate emails - should reject
 * - SQL injection in bio - should sanitize
 * - Unicode characters in names - should accept
 *
 * @see /docs/architecture/database-schema.md
 */
describe('Faculty Content Type', () => {
  // tests...
});
```
```

---

## 📊 Mid-Session Check-In Template

**Every 30-45 minutes, update this:**

```markdown
## Mid-Session Status

**Time elapsed:** [X] minutes
**Estimated time remaining:** [X] minutes

### Completed:
- [x] Task 1
- [x] Task 2

### In progress:
- [ ] Task 3 (60% done)

### Test status:
- [X]/[Y] tests passing
- [List any failing tests]
- Coverage: [X]%

### Questions/Blockers:
- [Any unclear requirements?]
- [Any technical issues?]

### Next steps:
1. [Immediate next task]
2. [Then what]
```

---

## 🎯 End-of-Session Checklist

### **MANDATORY Before Ending Session:**

```markdown
## Session End Checklist

### Code Quality
- [ ] Run: npm run test
  - Output: [Paste full output showing X/X passing]
- [ ] Run: npm run test:coverage
  - Coverage: [X]% (target: >80%)
- [ ] Run: npm run lint
  - Output: No errors
- [ ] Run: npm run type-check
  - Output: No TypeScript errors
- [ ] Verify: No console.log() in production code
- [ ] Verify: No commented-out code

### Testing
- [ ] All tests passing (show output)
- [ ] Edge cases covered (list them):
  1. [Edge case 1]
  2. [Edge case 2]
  3. [Edge case 3]
  [etc.]
- [ ] Integration test works (show API response if applicable)
- [ ] E2E test works (show browser test if applicable)
- [ ] Performance acceptable (list metrics)

### Documentation
- [ ] Code comments for complex logic
- [ ] API endpoint documented (if new endpoint)
- [ ] README updated (if structure changed)
- [ ] Update PROJECT_CONTEXT.md with:
  ```markdown
  ## Last Session Completed:
  - Week [X], Day [Y]: [Task name]
  - Files: [list]
  - Tests: [X]/[X] passing, coverage: [X]%
  - Committed: [message]

  ## Next Session Goal:
  - Week [X], Day [Y]: [Next task]
  - Estimated: [X] hours
  - Tests needed: [X]+
  ```
- [ ] Update PROGRESS_TRACKER.md:
  ```markdown
  ### Day [Y]: [Task] ✅
  - [x] Subtask 1
  - [x] Subtask 2
  - Tests: [X]/[X] passing, coverage [X]%
  - Time: [X] hours
  - Files: [list]
  ```

### Git
- [ ] Stage files: git add .
- [ ] Commit message: [scope] Clear description
  ```
  [backend] Add Faculty content type with full validation

  - Required fields: firstName, lastName, email, title
  - Optional fields: phone, office, pronouns, bio
  - Relations: researchAreas (many-to-many)
  - Validation: email format, unique constraint
  - Tests: 15/15 passing, coverage 89%

  Edge cases covered:
  - Long names (>255 chars) truncate
  - Invalid emails rejected
  - SQL injection sanitized
  - Unicode characters supported
  ```
- [ ] Push to branch: git push origin [branch-name]

### Handoff Documentation
**Create NEXT_SESSION.md:**

```markdown
# Next Session Plan

## What was completed this session:
- [Task name]
- Files: [list with paths]
- Tests: [X]/[X] passing, [X]% coverage
- Duration: [X] hours

## What to do next session:

### Goal:
[One sentence]

### Tasks (priority order):
1. [ ] [Task 1]
2. [ ] [Task 2]
3. [ ] [Task 3]

### Tests needed:
- [ ] [Test 1]
- [ ] [Test 2]
- [ ] Edge cases: [list at least 3]

### Reference files:
- Similar component: [path]
- Architecture doc: [page X-Y]
- API docs: [relevant section]

### Estimated time:
[X] hours

### Known issues to address:
- [Issue 1 or "None"]

### Questions for user (if any):
- [Question 1 or "None"]
```

**Show me all 3 updated files before we end:**
1. PROJECT_CONTEXT.md (Current Status section)
2. PROGRESS_TRACKER.md (today's entry)
3. NEXT_SESSION.md (new file)
```

---

## 🔄 Common Session Scenarios

### **Scenario 1: Starting After Context Reset**

**You say:**
```markdown
Hi Claude! Context reset, starting new session.

**Read these files:**
1. PROJECT_CONTEXT.md (Current Status section)
2. NEXT_SESSION.md (what to do this session)
3. TESTING_CHECKLIST.md (testing requirements)

**Summary from files:**
- Last completed: [from PROJECT_CONTEXT]
- This session: [from NEXT_SESSION]
- Tests needed: [from NEXT_SESSION]

**Ready to continue with TDD approach (tests first)?**
```

### **Scenario 2: Mid-Task Context Reset**

**You say:**
```markdown
Hi Claude! Context reset mid-task.

**Where we were:**
- Task: [task name]
- Progress: [X]% done
- Tests: [X]/[Y] passing
- Current file: [path]
- Next step: [specific next action]

**Read:** PROJECT_CONTEXT.md + SESSION_PLAN.md

**Resume from:** [specific step]
```

### **Scenario 3: Debugging Failed Tests**

**You say:**
```markdown
Hi Claude! Need to debug failed tests.

**Context:**
- Component: [name]
- Test file: [path]
- Failing: [X] tests
- Error messages: [paste errors]

**Read:** Test file + component file

**Goal:** Fix failing tests, ensure edge cases covered.
```

### **Scenario 4: Code Review Before Committing**

**You say:**
```markdown
Hi Claude! Code review before commit.

**Files changed:**
[paste git status output]

**Checklist:**
- [ ] All tests passing?
- [ ] Coverage >80%?
- [ ] Edge cases covered?
- [ ] Documentation updated?
- [ ] No console.logs?

**Review and tell me if ready to commit.**
```

---

## 📋 Weekly Review Template

**End of each week, create WEEK_X_SUMMARY.md:**

```markdown
# Week [X] Summary

## Date Range: [Start] to [End]

## Goals for This Week
- [Goal 1]
- [Goal 2]
- [Goal 3]

## Completed
✅ [Task 1] - [X] hours
- Files: [list]
- Tests: [X]/[X] passing
- Coverage: [X]%

✅ [Task 2] - [X] hours
- Files: [list]
- Tests: [X]/[X] passing
- Coverage: [X]%

[etc.]

## Test Summary
- Total tests written: [X]
- All passing: [Yes/No]
- Coverage: [X]% (avg across all files)
- Edge cases covered: [X]

## Incomplete/Blocked
- [ ] [Task] - [reason]

## Next Week Preview
### Week [X+1] Goals:
1. [Goal 1]
2. [Goal 2]
3. [Goal 3]

### Estimated time: [X] hours

### Prerequisites:
- [Any setup needed]

## Lessons Learned
- [What went well]
- [What to improve]
- [Technical insights]

## Questions for Stakeholders
- [Question 1 or "None"]
```

---

## 🎓 Best Practices

### **1. Keep Sessions Focused (2-3 hours max)**
- One content type per session (backend)
- One page per session (frontend)
- One feature per session (integration)

### **2. Always Start with Reading**
Tell Claude:
```markdown
Before we code, read these files:
1. PROJECT_CONTEXT.md (Current Status)
2. SESSION_PLAN.md (this session's tasks)
3. TESTING_CHECKLIST.md (requirements)

Summarize what you understand, then we'll proceed.
```

### **3. Enforce TDD Every Time**
Tell Claude:
```markdown
We're using TDD. That means:
1. Write test first (it will fail - that's good)
2. Write minimal code to pass test
3. Refactor while keeping test green
4. Repeat

DO NOT write production code before tests.
```

### **4. Mid-Session Reality Check**
Every 45 minutes:
```markdown
Mid-session check:
- Time used: [X] min
- Remaining: [X] min
- Tests passing: [X]/[Y]
- On track to finish? [Yes/No]

If behind schedule, what can we defer to next session?
```

### **5. Never Skip Documentation**
End of session:
```markdown
Before we commit, update:
1. PROJECT_CONTEXT.md
2. PROGRESS_TRACKER.md
3. Create NEXT_SESSION.md
4. Add comments to complex code

Show me all updates.
```

---

## 🚨 Red Flags (Stop and Fix)

**If you see these, stop immediately:**

❌ **"Let's skip tests for now and add them later"**
→ **Fix:** No. Tests first. Always.

❌ **"This is simple, doesn't need edge case tests"**
→ **Fix:** Every function gets edge cases. No exceptions.

❌ **"Tests are passing on my machine"**
→ **Fix:** Run in clean environment. Show me the output.

❌ **"We can document this later"**
→ **Fix:** Document now while fresh. Future you will thank you.

❌ **"Just one console.log() for debugging"**
→ **Fix:** Use proper logging. Remove before commit.

---

## 📱 Quick Reference Card

**Tape this to your monitor:**

```
┌─────────────────────────────────────────┐
│   EEMB Website - Session Checklist      │
├─────────────────────────────────────────┤
│                                         │
│  SESSION START:                         │
│  ☐ Read PROJECT_CONTEXT.md             │
│  ☐ Read SESSION_PLAN.md                │
│  ☐ Read TESTING_CHECKLIST.md           │
│                                         │
│  DURING SESSION:                        │
│  ☐ Write tests FIRST (TDD)             │
│  ☐ Include 3+ edge cases                │
│  ☐ All tests passing                    │
│  ☐ Coverage >80%                        │
│                                         │
│  SESSION END:                           │
│  ☐ npm run test (all pass)             │
│  ☐ npm run lint (no errors)            │
│  ☐ Update PROJECT_CONTEXT.md           │
│  ☐ Update PROGRESS_TRACKER.md          │
│  ☐ Create NEXT_SESSION.md              │
│  ☐ Git commit with clear message       │
│  ☐ Git push                             │
│                                         │
│  Files to maintain:                     │
│  • PROJECT_CONTEXT.md (current status)  │
│  • PROGRESS_TRACKER.md (daily log)      │
│  • SESSION_PLAN.md (this session)       │
│  • NEXT_SESSION.md (handoff)           │
│  • TESTING_CHECKLIST.md (reference)     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Success Criteria

**You'll know this system works when:**

✅ You can stop mid-task, and Claude can pick up exactly where you left off
✅ Every session produces green tests (passing)
✅ Documentation stays current automatically
✅ No code is committed without tests
✅ Edge cases are always covered
✅ Coverage stays >80%
✅ You can hand off to another developer easily

---

## 📞 Troubleshooting

### **Problem: Claude starts coding without tests**
**Solution:**
```markdown
STOP! Tests first. We're using TDD.

1. Create test file: /tests/[name].test.ts
2. Write failing tests
3. THEN write code to pass them

Start over with the test file.
```

### **Problem: Tests are failing**
**Solution:**
```markdown
Show me:
1. Full test output (npm run test)
2. Exact error messages
3. The test file
4. The implementation file

Let's debug together.
```

### **Problem: Coverage is low**
**Solution:**
```markdown
Run: npm run test:coverage

Show me the coverage report.
Which lines are uncovered?
Let's write tests for those lines.
```

### **Problem: Context reset mid-task**
**Solution:**
```markdown
Hi Claude! Context reset.

Read:
1. PROJECT_CONTEXT.md (Current Status)
2. SESSION_PLAN.md

We were working on: [task]
Current progress: [X]%
Next step: [specific action]

Continue from: [exact step]
```

---

## 🎉 You're Ready!

**With this system:**
- ✅ Context resets handled seamlessly
- ✅ Testing is enforced automatically
- ✅ Documentation stays current
- ✅ Progress is always tracked
- ✅ Handoffs are smooth
- ✅ Code quality is high

**Start your first session by creating:**
1. SESSION_PLAN.md (what you'll do today)
2. Then tell Claude: "Read CLAUDE_SESSION_GUIDE.md and let's begin!"

**Happy coding! 🚀**
