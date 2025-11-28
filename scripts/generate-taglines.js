const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../backend/.tmp/data.db');
const db = new sqlite3.Database(dbPath);

// Helper function to create consistent taglines based on research interests and bio
function generateTagline(person) {
  const { full_name, title, research_interests, short_bio } = person;

  // Parse research interests
  let interests = [];
  try {
    interests = JSON.parse(research_interests || '[]');
  } catch (e) {
    interests = [];
  }

  // Common patterns for taglines
  const patterns = {
    'Marine Biology': 'marine ecosystems',
    'Ecosystem Ecology': 'ecosystem dynamics',
    'Population and Community Ecology': 'population and community dynamics',
    'Disease Ecology': 'disease ecology and host-pathogen interactions',
    'Evolutionary Biology': 'evolutionary processes',
    'Botany': 'plant biology',
    'Zoology': 'animal behavior and ecology',
    'Conservation Biology': 'conservation and biodiversity',
    'Climate Change': 'climate change impacts',
    'Behavior': 'animal behavior',
    'Limnology': 'freshwater ecosystems',
    'Aquatic Biology': 'aquatic systems',
  };

  // Extract key themes from interests
  const themes = [];
  for (const interest of interests.slice(0, 3)) {
    if (patterns[interest]) {
      themes.push(patterns[interest]);
    } else {
      themes.push(interest.toLowerCase());
    }
  }

  // Generate tagline based on available information
  if (themes.length >= 2) {
    return `Studies ${themes[0]} and ${themes[1]}`;
  } else if (themes.length === 1) {
    return `Researches ${themes[0]}`;
  } else if (short_bio && short_bio.length > 0) {
    // Extract a key phrase from bio as fallback
    return 'Ecological and evolutionary research';
  } else {
    return 'Research in ecology, evolution, and marine biology';
  }
}

// Get all active faculty and generate taglines
db.all(
  `SELECT id, full_name, title, research_interests, short_bio, bio
   FROM faculties
   WHERE active = 1
   ORDER BY last_name`,
  [],
  (err, rows) => {
    if (err) {
      console.error('Error fetching faculty:', err);
      return;
    }

    console.log(`\nGenerating taglines for ${rows.length} faculty members...\n`);

    const updates = [];

    rows.forEach((person) => {
      const tagline = generateTagline(person);
      console.log(`${person.full_name}: "${tagline}"`);
      updates.push({
        id: person.id,
        name: person.full_name,
        tagline: tagline
      });
    });

    console.log('\n--- SQL UPDATE STATEMENTS ---\n');
    updates.forEach(({ id, name, tagline }) => {
      const escapedTagline = tagline.replace(/'/g, "''");
      console.log(`UPDATE faculties SET short_bio = '${escapedTagline}' WHERE id = ${id}; -- ${name}`);
    });

    db.close();
  }
);
