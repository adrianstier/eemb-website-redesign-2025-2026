#!/usr/bin/env node

/**
 * Import all faculty social/academic links from EEMB CSV data
 */

async function importAllFacultyLinks() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  // Faculty links extracted from the EEMB CSV export
  const facultyLinks = {
    'Alice Alldredge': {
      googleScholar: 'https://scholar.google.com/citations?user=SG5c300AAAAJ&hl=en&oi=ao'
    },
    'Leander Anderegg': {
      googleScholar: 'https://scholar.google.com/citations?hl=en&user=juJKdAgAAAAJ',
      labWebsite: 'Anderegg Landscape Physiology Lab'
    },
    'Cherie Briggs': {
      googleScholar: 'https://scholar.google.com/citations?user=q0xdxtsAAAAJ&hl=en',
      labWebsite: 'Briggs Lab'
    },
    'Mark Brzezinski': {
      googleScholar: 'https://scholar.google.com/citations?user=NgJPuK8AAAAJ&hl=en'
    },
    'Deron Burkepile': {
      googleScholar: 'https://scholar.google.com/citations?user=lOhiBXAAAAAJ&hl=en',
      labWebsite: 'Burkepile Community Ecology Laboratory'
    },
    'Craig Carlson': {
      googleScholar: 'https://scholar.google.com/citations?user=4Td-fJUAAAAJ&hl=en',
      labWebsite: 'Carlson Microbial Oceanography Lab'
    },
    'Jenn Caselle': {
      googleScholar: 'https://scholar.google.com/citations?user=jl4z9RcAAAAJ&hl=en',
      labWebsite: 'Jenn Caselle Lab'
    },
    'James Childress': {
      googleScholar: 'https://scholar.google.com/citations?hl=en&view_op=list_works&gmla=AGd7smHsKxaF'
    },
    'Peter Collins': {
      labWebsite: 'Collins Lab'
    },
    'Carla D\'Antonio': {
      googleScholar: 'https://scholar.google.com/citations?user=I7C2Hz0AAAAJ&hl=en&oi=ao',
      labWebsite: 'D\'Antonio Lab'
    },
    'Halley Froehlich': {
      googleScholar: 'https://scholar.google.com/citations?user=072ktIQAAAAJ&hl=en',
      labWebsite: 'Froehlich Lab'
    },
    'Steve Gaines': {
      googleScholar: 'https://scholar.google.com/citations?user=L_VT3-cAAAAJ&hl=en',
      labWebsite: 'Gaines Lab'
    },
    'Scott Hodges': {
      googleScholar: 'https://scholar.google.com/citations?user=1Fr1vakAAAAJ&hl=en'
    },
    'Gretchen Hofmann': {
      googleScholar: 'https://scholar.google.com/citations?user=-PWYRzIAAAAJ&hl=en',
      labWebsite: 'Hofmann Lab'
    },
    'Sally Holbrook': {
      googleScholar: 'https://scholar.google.com/citations?user=LtUBsnwAAAAJ&hl=en'
    },
    'Débora Iglesias-Rodriguez': {
      labWebsite: 'Iglesias-Rodriguez Lab'
    },
    'Armand  Kuris': {
      googleScholar: 'https://scholar.google.com/citations?user=Fx4qe20AAAAJ&hl=en',
      labWebsite: 'Parasite Ecology Group'
    },
    'Kevin Lafferty': {
      googleScholar: 'https://scholar.google.com/citations?user=6pj0cygAAAAJ&hl=en&oi=sra'
    },
    'Sally MacIntyre': {
      googleScholar: 'https://scholar.google.com/citations?user=GPlRHI8AAAAJ&hl=en'
    },
    'Susan J. Mazer': {
      googleScholar: 'https://scholar.google.com/citations?user=qbamjFYAAAAJ&hl=en',
      labWebsite: 'Susan Mazer Lab'
    },
    'Douglas McCauley': {
      googleScholar: 'https://scholar.google.com/citations?user=HYXM3_sAAAAJ&hl=en',
      labWebsite: 'McCauley Lab'
    },
    'John M. Melack': {
      googleScholar: 'https://scholar.google.com/citations?user=Vvo98qYAAAAJ&hl=en'
    },
    'Holly Moeller': {
      googleScholar: 'https://scholar.google.com/citations?user=hcuuM8gAAAAJ&hl=en&oi=ao',
      labWebsite: 'Moeller Lab'
    },
    'Roger Nisbet': {
      googleScholar: 'https://scholar.google.com/citations?user=l_9TshUAAAAJ&hl=en'
    },
    'Todd Oakley': {
      googleScholar: 'https://scholar.google.com/citations?user=kztqPjYAAAAJ&hl=en&oi=sra',
      labWebsite: 'Oakley Lab'
    },
    'Ryoko Oono': {
      googleScholar: 'https://scholar.google.com/citations?user=GaabAg8AAAAJ&hl=en',
      labWebsite: 'Ryoko Oono Lab'
    },
    'Stephen Proulx': {
      googleScholar: 'https://scholar.google.com/citations?user=5y_dK0oAAAAJ&hl=en',
      labWebsite: 'Proulx Lab'
    },
    'William Rice': {
      googleScholar: 'https://scholar.google.com/citations?user=OtbhlmIAAAAJ&hl=en'
    },
    'Joel Rothman': {
      googleScholar: 'https://scholar.google.com/citations?user=8enm19QAAAAJ&hl=en',
      labWebsite: 'Rothman Lab'
    },
    'Alyson Santoro': {
      googleScholar: 'https://scholar.google.com/citations?user=TsZjKA4AAAAJ&hl=en',
      labWebsite: 'Santoro Research Group'
    },
    'Joshua Schimel': {
      googleScholar: 'https://scholar.google.com/citations?user=uzDaznAAAAAJ&hl=en',
      labWebsite: 'Schimel Lab'
    },
    'Russell Schmitt': {
      googleScholar: 'https://scholar.google.com/citations?user=sFIZSUYAAAAJ&hl=en&oi=ao'
    },
    'Joel Sharbrough': {
      googleScholar: 'https://scholar.google.com/citations?user=vmA6JvMAAAAJ&hl=en',
      labWebsite: 'Sharbrough Lab'
    },
    'Jackie Shay': {
      googleScholar: 'https://scholar.google.com/citations?user=CxJk0XIAAAAJ&hl=en&oi=ao'
    },
    'Adrian Stier': {
      googleScholar: 'https://scholar.google.com/citations?user=bxbOvMgAAAAJ&hl=en',
      labWebsite: 'Stier Lab'
    },
    'Samuel Sweet': {
      googleScholar: 'https://scholar.google.com/citations?user=t07iyOAAAAAJ&hl=en'
    },
    'Andrew Thurber': {
      googleScholar: 'https://scholar.google.com/citations?user=DbOlPUAAAAAJ&hl=en',
      labWebsite: 'Lab website'
    },
    'Thomas Turner': {
      googleScholar: 'https://scholar.google.com/citations?user=-JrND60AAAAJ&hl=en',
      labWebsite: 'Turner Lab'
    },
    'Robert Warner': {
      googleScholar: 'https://scholar.google.com/citations?user=EnWAN9gAAAAJ&hl=en'
    },
    'Lizzy Wilbanks': {
      googleScholar: 'https://scholar.google.com/citations?user=9Jcd7mcAAAAJ&hl=en',
      labWebsite: 'Wilbanks Lab'
    },
    'Soojin Yi': {
      labWebsite: 'Comparative Genomics & Epigenomics Lab'
    },
    'Hillary Young': {
      googleScholar: 'https://scholar.google.com/citations?user=X-2BjW4AAAAJ&hl=en',
      labWebsite: 'Young Lab'
    },
    'Yong Zhou': {
      googleScholar: 'https://scholar.google.com/citations?user=4FV9K4wAAAAJ&hl=en',
      labWebsite: 'Ecosystem Ecology and Biogeochemistry Lab'
    }
  };

  console.log('🔍 Fetching faculty from database...\n');

  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const dbFaculty = data.data;

  console.log(`Found ${dbFaculty.length} faculty in database\n`);
  console.log(`Found ${Object.keys(facultyLinks).length} faculty with links to import\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const [name, links] of Object.entries(facultyLinks)) {
    console.log(`\n📝 ${name}`);

    // Find matching person in database
    const dbPerson = dbFaculty.find(p => {
      const fullName = p.attributes.fullName.toLowerCase();
      const searchName = name.toLowerCase();
      return fullName === searchName || fullName.includes(searchName.split(' ').pop());
    });

    if (!dbPerson) {
      console.log(`   ⏭️  Not found in database`);
      skipped++;
      continue;
    }

    console.log(`   ✓ Matched: ${dbPerson.attributes.fullName}`);

    const updateData = {};
    // Only include labWebsite if it's a valid URL (not just a lab name)
    if (links.labWebsite && links.labWebsite.match(/^https?:\/\//)) {
      updateData.labWebsite = links.labWebsite;
    }
    if (links.googleScholar) updateData.googleScholar = links.googleScholar;
    if (links.orcid) updateData.orcid = links.orcid;

    console.log(`   Updating:`);
    if (updateData.labWebsite) console.log(`     Lab: ${updateData.labWebsite}`);
    if (updateData.googleScholar) console.log(`     Scholar: ${updateData.googleScholar}`);
    if (updateData.orcid) console.log(`     ORCID: ${updateData.orcid}`);

    const updateResponse = await fetch(`${API_URL}/faculties/${dbPerson.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: updateData })
    });

    if (updateResponse.ok) {
      console.log(`   ✅ Updated`);
      updated++;
    } else {
      const errorText = await updateResponse.text();
      console.log(`   ❌ Failed: ${updateResponse.status}`);
      errors++;
    }
  }

  console.log('\n\n═══════════════════════════════════════');
  console.log('📊 Summary:');
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📝 Total: ${Object.keys(facultyLinks).length}`);
  console.log('═══════════════════════════════════════\n');
  console.log('✨ Done! Refresh your browser to see all the social/academic links.\n');
}

importAllFacultyLinks().catch(console.error);
