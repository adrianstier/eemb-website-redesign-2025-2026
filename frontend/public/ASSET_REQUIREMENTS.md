# EEMB Website Asset Requirements

## Folder Structure

```
public/
├── images/
│   ├── about/          ✅ Has 8 images
│   ├── news/           ✅ Has 85+ images
│   ├── hero/           🔴 EMPTY - Need hero images
│   ├── research/       🔴 EMPTY - Need research area images
│   ├── campus/         🔴 EMPTY - Need campus/facility images
│   ├── students/       🔴 EMPTY - Need student life images
│   ├── events/         🔴 EMPTY - Need event photos
│   └── facilities/     🔴 EMPTY - Need lab/field images
├── uploads/
│   └── faculty/        🔴 EMPTY - Faculty photos served from Strapi
└── documents/          ✅ Exists
```

---

## CRITICAL MISSING ASSETS

### 1. Faculty Quote Section Photos (BLOCKING)
**Location needed:** `/uploads/faculty/`

These images are hardcoded in `FacultyQuote.tsx`:
- [ ] `holly-moeller-976.jpg` - Holly Moeller headshot
- [ ] `gretchen-hofmann-200.jpg` - Gretchen Hofmann headshot
- [ ] `deron-burkepile-200.jpg` - Deron Burkepile headshot

**Specs:**
- Square aspect ratio (1:1)
- Minimum 400x400px
- Professional headshot style
- Consistent background/lighting preferred

---

### 2. Hero Section Background
**Current:** Using `/images/about/kelp-banner.jpg`

**Recommended upgrades:**
- [ ] `hero-kelp-forest.jpg` - Dramatic underwater kelp forest (wide, 2400x1600px)
- [ ] `hero-coral-reef.jpg` - Vibrant coral reef scene
- [ ] `hero-field-research.jpg` - Researchers in action
- [ ] `hero-santa-barbara-coast.jpg` - UCSB coastline aerial

**Specs:**
- Landscape orientation (3:2 or 16:9)
- Minimum 2400px wide for retina
- High contrast for text overlay
- Dark enough for white text readability

---

### 3. Research Theme Cards
**Location:** `/images/research/`

Need high-quality images for each research area:

#### Marine Ecosystems
- [ ] `marine-kelp-forest.jpg` - California kelp forest
- [ ] `marine-coral-moorea.jpg` - Moorea coral reef
- [ ] `marine-diving-research.jpg` - Divers doing research

#### Terrestrial Ecology
- [ ] `terrestrial-chaparral.jpg` - California chaparral
- [ ] `terrestrial-fieldwork.jpg` - Plant ecology fieldwork
- [ ] `terrestrial-savanna.jpg` - African savanna (if available)

#### Evolution & Genetics
- [ ] `evolution-columbine.jpg` - Aquilegia flowers (Scott Hodges research)
- [ ] `evolution-lab.jpg` - Genetics lab work
- [ ] `evolution-specimens.jpg` - Natural history specimens

#### Disease Ecology
- [ ] `disease-frog.jpg` - Amphibian research
- [ ] `disease-field-sampling.jpg` - Disease sampling in field

#### Microbial Ecology
- [ ] `microbial-lab.jpg` - Microbiology lab
- [ ] `microbial-ocean.jpg` - Ocean sampling

#### Animal Behavior
- [ ] `behavior-fish.jpg` - Reef fish behavior
- [ ] `behavior-field.jpg` - Animal observation

**Specs:**
- Square or 4:3 aspect ratio
- Minimum 1200x1200px
- Vivid colors, good lighting
- Should evoke the research area

---

### 4. Campus & Facilities
**Location:** `/images/campus/`

- [ ] `campus-aerial.jpg` - UCSB aerial view (better quality than current)
- [ ] `campus-lagoon-wide.jpg` - Campus lagoon panorama
- [ ] `campus-msi.jpg` - Marine Science Institute building
- [ ] `campus-life-sciences.jpg` - Life Sciences building
- [ ] `campus-greenhouse.jpg` - Research greenhouse
- [ ] `campus-ocean-view.jpg` - Ocean from campus

**Specs:**
- Landscape orientation
- Minimum 1800px wide
- Bright, welcoming aesthetic

---

### 5. Student Life
**Location:** `/images/students/`

- [ ] `students-lab.jpg` - Graduate students in lab
- [ ] `students-field.jpg` - Students doing fieldwork
- [ ] `students-diving.jpg` - Students scuba diving
- [ ] `students-presenting.jpg` - Student giving talk
- [ ] `students-group.jpg` - Group photo of grad cohort
- [ ] `students-mentoring.jpg` - Faculty-student mentoring

**Specs:**
- Mix of candid and staged
- Diverse representation
- Show research in action

---

### 6. Events
**Location:** `/images/events/`

- [ ] `event-seminar.jpg` - Department seminar
- [ ] `event-symposium.jpg` - Research symposium
- [ ] `event-defense.jpg` - Thesis defense celebration
- [ ] `event-field-trip.jpg` - Class field trip
- [ ] `event-commencement.jpg` - Graduation ceremony

---

### 7. Who We Are Section
**Currently using:** `ucsb-aerial.jpg`, `marine-reef.jpg`

**Would benefit from:**
- [ ] `dept-group-photo.jpg` - Full department group photo
- [ ] `dept-colloquium.jpg` - Department gathering
- [ ] `dept-diversity.jpg` - DEI-focused group image

---

## CURRENT ASSETS (Available)

### /images/about/ (8 images)
- ✅ `campus-lagoon.jpg` - 92KB
- ✅ `coral-reef.jpg` - 139KB
- ✅ `crustacean.jpg` - 91KB
- ✅ `ecology-butterfly.jpg` - 55KB
- ✅ `evolution-flower.jpg` - 67KB
- ✅ `kelp-banner.jpg` - 167KB (used in hero)
- ✅ `marine-reef.jpg` - 334KB
- ✅ `ucsb-aerial.jpg` - 154KB

### /images/news/ (85+ images)
All news article images - well populated

---

## IMAGE OPTIMIZATION GUIDELINES

### File Formats
- **JPG**: Photos (80-85% quality)
- **PNG**: Graphics with transparency
- **WebP**: Consider for performance (with JPG fallback)

### Sizing
| Use Case | Dimensions | Max File Size |
|----------|------------|---------------|
| Hero backgrounds | 2400x1600 | 400KB |
| Card images | 1200x800 | 150KB |
| Thumbnails | 600x400 | 50KB |
| Faculty headshots | 400x400 | 80KB |

### Naming Convention
- Lowercase with hyphens: `research-kelp-forest.jpg`
- Descriptive but concise
- No spaces or special characters

---

## PRIORITY ORDER

1. **HIGH** - Faculty quote headshots (currently broken)
2. **HIGH** - Hero background alternatives
3. **MEDIUM** - Research theme cards
4. **MEDIUM** - Student life imagery
5. **LOW** - Events (can use news images temporarily)

---

## SOURCE SUGGESTIONS

1. **UCSB Photo Services** - Campus and official photos
2. **Faculty research images** - Ask faculty for lab/field photos
3. **MSI Media** - Marine Science Institute archive
4. **SBC LTER** - Santa Barbara Coastal LTER photos
5. **MCR LTER** - Moorea Coral Reef research photos
6. **Stock (last resort)** - Unsplash/Pexels for generic nature

---

*Last updated: December 2024*
