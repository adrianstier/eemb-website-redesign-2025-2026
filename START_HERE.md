# 🚀 START HERE - EEMB Website Build Guide
## Your Complete Roadmap to Building This Project

**Welcome!** This document is your starting point. Read it first, then follow the links.

---

## 📖 What You Have

You now have a **complete, production-ready development plan** for building the EEMB website. Here's what's included:

### 🎯 Planning Documents (400+ pages)
1. **Technical Architecture** - How everything works
2. **Development Roadmap** - Week-by-week tasks
3. **Repository Guide** - How to organize code
4. **Session Management** - How to work with Claude Code

### 📋 Tracking & Reference Files
1. **PROJECT_CONTEXT.md** - Master reference (read at start of EVERY session)
2. **PROGRESS_TRACKER.md** - Daily task tracking
3. **TESTING_CHECKLIST.md** - Comprehensive testing requirements
4. **CLAUDE_SESSION_GUIDE.md** - How to manage context resets

### 📚 Supporting Documents
1. **EXECUTIVE_SUMMARY.md** - High-level overview for stakeholders
2. **README.md** - Project overview
3. **This file (START_HERE.md)** - You're reading it!

---

## 🎓 How to Use These Documents

### **Phase 1: Understanding (1-2 hours)**

**Read these in order:**

1. **[README.md](README.md)** (10 minutes)
   - Project overview
   - Tech stack
   - Quick links

2. **[EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md)** (30 minutes)
   - What changed from original plan & why
   - Alumni platform (new feature)
   - Cost analysis
   - Timeline
   - Success metrics

3. **[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)** (30 minutes)
   - **MOST IMPORTANT FILE**
   - Tech stack details
   - Content types (database schema)
   - Frontend routes
   - Design system
   - Current status

4. **[CLAUDE_SESSION_GUIDE.md](CLAUDE_SESSION_GUIDE.md)** (20 minutes)
   - How to work across multiple sessions
   - What to tell Claude when context resets
   - Testing enforcement
   - Templates you can copy-paste

**Result:** You understand the project and how to build it.

---

### **Phase 2: Deep Dive (4-6 hours)**

**Read these as needed:**

#### For Technical Details:
**[planning documents/REVISED_comprehensive_technical_architecture.md](planning documents/REVISED_comprehensive_technical_architecture.md)** (120+ pages)
- Complete database schema (SQL)
- Backend architecture (Strapi + PostgreSQL)
- Alumni platform specifications
- Admin dashboard design
- Legal compliance requirements
- Cost estimates

**When to read:** Before starting backend development (Week 1)

#### For Development Plan:
**[planning documents/REVISED_claude_code_execution_roadmap.md](planning documents/REVISED_claude_code_execution_roadmap.md)** (150+ pages)
- Week-by-week breakdown
- Detailed tasks for each day
- Claude Code prompts (ready to use)
- Testing requirements
- Admin training plan

**When to read:** At the start of each week

#### For Organization:
**[planning documents/REVISED_repository_organization_guide.md](planning documents/REVISED_repository_organization_guide.md)** (100+ pages)
- Repository structure (every file explained)
- Git workflow
- Documentation standards
- Emergency procedures

**When to read:** When setting up the repository

---

### **Phase 3: Daily Work (2-3 hours per day)**

**Your Daily Routine:**

#### **Morning (Before Coding):**

1. **Open [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)**
   - Read "Current Status" section
   - See what was completed last session
   - See what you're doing today

2. **Open [PROGRESS_TRACKER.md](PROGRESS_TRACKER.md)**
   - Find today's tasks
   - Review test requirements
   - Note estimated time

3. **Create SESSION_PLAN.md** (if needed)
   - Copy template from CLAUDE_SESSION_GUIDE
   - List specific tasks for today
   - List tests you'll write

#### **During Coding:**

4. **Start Claude Code Session**
   - Paste quick context from CLAUDE_SESSION_GUIDE
   - Reference PROJECT_CONTEXT.md
   - Follow SESSION_PLAN.md

5. **Write Tests FIRST** (TDD)
   - Reference [TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)
   - Write minimum 3 edge cases per function
   - All tests must pass before moving on

6. **Mid-Session Check** (every 45 minutes)
   - Review progress
   - Check tests passing
   - Update SESSION_PLAN.md

#### **Evening (After Coding):**

7. **Run Full Test Suite**
   ```bash
   npm run test
   npm run test:coverage
   npm run lint
   npm run type-check
   ```

8. **Update Tracking Files**
   - Update PROJECT_CONTEXT.md (current status)
   - Update PROGRESS_TRACKER.md (mark tasks complete)
   - Create NEXT_SESSION.md (what to do tomorrow)

9. **Commit to Git**
   ```bash
   git add .
   git commit -m "[scope] Description"
   git push
   ```

---

## 🎯 Quick Start: Your First Week

### **Week 0: Environment Setup (This Week)**

**Goal:** Get all tools and accounts ready

**Tasks:**
1. [ ] Create accounts (Railway, Supabase, Cloudinary, Vercel)
2. [ ] Install tools (Node, Python, PostgreSQL, Git)
3. [ ] Set up repository structure
4. [ ] Review all planning documents

**Time:** 5-10 hours
**Reference:** [PROGRESS_TRACKER.md](PROGRESS_TRACKER.md) - Week 0 section

---

### **Week 1: Backend Start (Next Week)**

**Goal:** Strapi running with Faculty content type

**Tasks:**
1. [ ] Install Strapi
2. [ ] Create Faculty content type (with tests!)
3. [ ] Create Alumni content type (with tests!)
4. [ ] Import current site data

**Time:** 20-24 hours
**Reference:**
- [Roadmap Week 1](planning documents/REVISED_claude_code_execution_roadmap.md#phase-1-backend-foundation-weeks-1-3)
- [PROGRESS_TRACKER Week 1](PROGRESS_TRACKER.md#week-1-backend-foundation---strapi--core-content-types-nov-19-25)

---

## 💡 Pro Tips

### **1. Context Window Management**

Claude will eventually "forget" previous work. Here's how to handle it:

**Every time Claude resets, paste this:**
```markdown
Hi Claude! Context reset.

Read:
1. PROJECT_CONTEXT.md (Current Status section)
2. This session task: [specific task]
3. Tests required: [from TESTING_CHECKLIST]

We were working on: [task]
Progress: [X]%
Next: [specific step]

Ready?
```

**Template is in [CLAUDE_SESSION_GUIDE.md](CLAUDE_SESSION_GUIDE.md)**

### **2. Enforce Testing**

Tell Claude explicitly:
```markdown
Testing rules (non-negotiable):
1. Write tests FIRST (TDD)
2. Minimum 3 edge cases per function
3. All tests must pass before committing
4. No production code without tests

Reference: TESTING_CHECKLIST.md
```

### **3. Keep Files Updated**

After EVERY session:
- [ ] Update PROJECT_CONTEXT.md (current status)
- [ ] Update PROGRESS_TRACKER.md (mark tasks done)
- [ ] Create NEXT_SESSION.md (for tomorrow)

### **4. Use Templates**

Don't write from scratch! Copy templates from:
- Session start: CLAUDE_SESSION_GUIDE.md
- Test structure: TESTING_CHECKLIST.md
- Session plan: CLAUDE_SESSION_GUIDE.md
- Commit messages: CLAUDE_SESSION_GUIDE.md

---

## 🚨 Common Mistakes to Avoid

### **❌ DON'T:**

1. **Skip reading PROJECT_CONTEXT.md**
   - Result: You'll be confused about what's done
   - Fix: Read it at the start of EVERY session

2. **Write code before tests**
   - Result: Low coverage, bugs slip through
   - Fix: TDD approach (tests first, always)

3. **Forget to update tracking files**
   - Result: Lost progress, unclear handoffs
   - Fix: Update at end of every session

4. **Commit without running tests**
   - Result: Broken code in repo
   - Fix: `npm run test` before every commit

5. **Skip edge cases**
   - Result: Production bugs
   - Fix: Minimum 3 edge cases per function

### **✅ DO:**

1. **Follow the roadmap**
   - It's week-by-week for a reason

2. **Update documentation as you go**
   - Don't leave it for "later"

3. **Test on mobile**
   - 50%+ of traffic will be mobile

4. **Ask for clarification**
   - If something's unclear, stop and ask

5. **Take breaks**
   - Quality code requires focus

---

## 📞 When You Get Stuck

### **Problem: Don't understand something**
**Solution:**
1. Check relevant planning document
2. Search for keyword in PROJECT_CONTEXT.md
3. Ask specific question in Claude session

### **Problem: Tests are failing**
**Solution:**
1. Read error message carefully
2. Check TESTING_CHECKLIST.md for examples
3. Show Claude the full error output
4. Ask for help debugging

### **Problem: Context reset mid-task**
**Solution:**
1. Read CLAUDE_SESSION_GUIDE.md
2. Use the "Context Reset Mid-Task" template
3. Tell Claude exactly where you were

### **Problem: Task taking longer than estimated**
**Solution:**
1. That's normal! Estimates are estimates
2. Break task into smaller pieces
3. Complete what you can today
4. Note remaining work in NEXT_SESSION.md

### **Problem: Unclear requirements**
**Solution:**
1. Check architecture document for details
2. Look for similar feature in codebase
3. Make a reasonable decision and document it
4. Flag for review with stakeholders

---

## 🎉 Success Criteria

**You're on track when:**

✅ You can find any information quickly (use search)
✅ You understand what to do each day (from PROGRESS_TRACKER)
✅ Tests are all passing (green)
✅ Documentation is up-to-date (updated daily)
✅ You're not blocked (or you know how to unblock)

**You're DONE when:**

✅ All 12 weeks complete
✅ All tests passing (150+ tests)
✅ Coverage >80%
✅ Andi can add faculty in 5 minutes
✅ Alumni directory has 100+ profiles
✅ Website live at eemb.ucsb.edu
✅ Training complete
✅ Documentation complete

---

## 📅 Timeline Checkpoints

| Week | Date | Milestone | Status |
|------|------|-----------|--------|
| 0 | Nov 12-18 | Environment setup | ⏳ |
| 3 | Dec 2-9 | Backend complete | ⏳ |
| 7 | Jan 6 | Frontend complete | ⏳ |
| 10 | Jan 27 | Testing & training done | ⏳ |
| 12 | Jan 31 | **Launch!** | ⏳ |

---

## 🗺️ Document Map

**Quick reference - where to find things:**

### For Planning:
- **What we're building:** EXECUTIVE_SUMMARY.md
- **How it works:** Technical architecture doc
- **When to do what:** Development roadmap doc
- **How to organize:** Repository guide doc

### For Development:
- **Current state:** PROJECT_CONTEXT.md ← **Read this daily**
- **Today's tasks:** PROGRESS_TRACKER.md
- **This session:** SESSION_PLAN.md (you create)
- **Testing:** TESTING_CHECKLIST.md

### For Claude Sessions:
- **Session templates:** CLAUDE_SESSION_GUIDE.md
- **Context reset help:** CLAUDE_SESSION_GUIDE.md
- **Testing enforcement:** CLAUDE_SESSION_GUIDE.md

### For Stakeholders:
- **High-level overview:** EXECUTIVE_SUMMARY.md
- **Project status:** README.md
- **Weekly reports:** PROGRESS_TRACKER.md

---

## 🚀 Ready to Begin?

### **Your Next Steps:**

1. ✅ **You're reading this** - Great start!

2. **Read the essentials** (2 hours)
   - [ ] README.md
   - [ ] EXECUTIVE_SUMMARY.md
   - [ ] PROJECT_CONTEXT.md
   - [ ] CLAUDE_SESSION_GUIDE.md

3. **IMPORTANT: Scrape current website FIRST** (2-4 hours automated + 2-3 days manual)
   - [ ] Read [SCRAPING_COMPLETE.md](SCRAPING_COMPLETE.md)
   - [ ] Install Python dependencies: `cd scraping && pip3 install -r requirements.txt`
   - [ ] Test setup: `cd scripts && python3 test_setup.py`
   - [ ] Run scraper: `python3 run_all.py` (2-4 hours automated)
   - [ ] Review scraped data in `scraping/data/`
   - [ ] Manual content audit (categorize keep/update/rewrite)
   - [ ] Clean data for import to new site

   **Why this matters:** Preserves ALL existing content before building. No faculty bios lost!

4. **Review Week 0 tasks** (30 minutes)
   - [ ] Open PROGRESS_TRACKER.md
   - [ ] Read Week 0 section
   - [ ] Make checklist of accounts to create

5. **Create accounts** (1 hour)
   - [ ] Railway (backend hosting)
   - [ ] Supabase (database)
   - [ ] Cloudinary (images)
   - [ ] Vercel (frontend)

6. **Install tools** (1 hour)
   - [ ] Node.js 18+
   - [ ] Python 3.11+ (✅ already installed for scraping)
   - [ ] PostgreSQL 14+
   - [ ] Git

7. **Set up repository** (1 hour)
   - [ ] Create directory structure
   - [ ] Initialize Git
   - [ ] First commit

8. **Start Week 1!** (Next week)
   - [ ] Follow roadmap
   - [ ] Use Claude Code
   - [ ] Write tests
   - [ ] Build amazing things!

---

## 📚 Learning Resources

**If you want to learn more about the tech stack:**

- **Strapi:** https://strapi.io/documentation
- **Next.js:** https://nextjs.org/docs
- **PostgreSQL:** https://www.postgresql.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Testing Library:** https://testing-library.com/
- **Playwright:** https://playwright.dev/

---

## 🎯 Remember

**You have everything you need:**
- ✅ Comprehensive plans (400+ pages)
- ✅ Week-by-week roadmap
- ✅ Testing requirements
- ✅ Session management system
- ✅ Templates for everything

**You're not alone:**
- Claude Code is your pair programmer
- Documentation answers 95% of questions
- Templates save you time
- Testing catches bugs early

**You're building something important:**
- A website that will serve EEMB for 10+ years
- A system that non-technical staff can manage
- A platform that will increase alumni giving
- Infrastructure that showcases world-class research

---

## 🎉 Let's Build This!

**You're ready. The planning is done. The roadmap is clear. The tools are waiting.**

**Start with Week 0. Follow the plan. Write tests. Update docs. Commit often.**

**In 12 weeks, you'll launch a website that EEMB will be proud of.**

**Let's go! 🚀**

---

**Questions?** Everything is documented. Use Cmd+F to search.

**Confused?** Read PROJECT_CONTEXT.md. It's the master reference.

**Stuck?** Check CLAUDE_SESSION_GUIDE.md for templates.

**Ready?** Open PROGRESS_TRACKER.md and start Week 0, Day 1.

---

**Last Updated:** November 12, 2025
**Status:** Planning Complete → Development Ready
**Next Step:** Week 0, Day 1 - Create Accounts

**Happy building! 🎊**
