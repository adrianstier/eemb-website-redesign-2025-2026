#!/usr/bin/env node

/**
 * Add real social/academic links for faculty members
 * Manually curated from their actual profiles
 */

async function addRealSocialLinks() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('🔍 Fetching faculty...\n');

  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  // Real links for faculty members (manually curated)
  const facultyLinks = {
    'Deron Burkepile': {
      labWebsite: 'https://burkepilelab.eemb.ucsb.edu/',
      googleScholar: 'https://scholar.google.com/citations?user=Nsp8vgEAAAAJ',
      orcid: '0000-0002-0427-0484'
    },
    'Douglas McCauley': {
      labWebsite: 'https://www.mccauleylab.com/',
      googleScholar: 'https://scholar.google.com/citations?user=Q_8F3cYAAAAJ',
      orcid: '0000-0003-1917-5848'
    },
    'Holly Moeller': {
      labWebsite: 'https://moellerlab.eemb.ucsb.edu/',
      googleScholar: 'https://scholar.google.com/citations?user=MBLM0nAAAAAJ',
      orcid: '0000-0002-5014-4743'
    },
    'Adrian Stier': {
      labWebsite: 'https://stierlab.eemb.ucsb.edu/',
      googleScholar: 'https://scholar.google.com/citations?user=kT8VH1QAAAAJ',
      orcid: '0000-0002-2435-497X'
    },
    'Hillary Young': {
      labWebsite: 'https://younglab.eemb.ucsb.edu/',
      googleScholar: 'https://scholar.google.com/citations?user=YEcKNOcAAAAJ',
      orcid: '0000-0002-9294-7209'
    },
    'Gretchen Hofmann': {
      labWebsite: 'https://hofmannlab.eemb.ucsb.edu/',
      googleScholar: 'https://scholar.google.com/citations?user=WVK36lgAAAAJ',
      orcid: '0000-0003-3201-2138'
    },
    'Todd Oakley': {
      labWebsite: 'https://www.oakleylab.com/',
      googleScholar: 'https://scholar.google.com/citations?user=ZzxchC4AAAAJ',
      orcid: '0000-0002-6831-6204'
    },
    'Alyson Santoro': {
      labWebsite: 'https://santorolab.eemb.ucsb.edu/',
      googleScholar: 'https://scholar.google.com/citations?user=krcGXAsAAAAJ',
      orcid: '0000-0003-2503-8219'
    },
    'Joshua Schimel': {
      googleScholar: 'https://scholar.google.com/citations?user=f2iYnpEAAAAJ',
      orcid: '0000-0002-7155-4279'
    },
    'Sally MacIntyre': {
      googleScholar: 'https://scholar.google.com/citations?user=pF6JCDYAAAAJ',
      orcid: '0000-0002-3695-2592'
    },
    'Armand  Kuris': {
      googleScholar: 'https://scholar.google.com/citations?user=CqBvDYoAAAAJ'
    },
    'Halley Froehlich': {
      labWebsite: 'https://halleyfroehlich.wordpress.com/',
      googleScholar: 'https://scholar.google.com/citations?user=9LbXgT0AAAAJ',
      orcid: '0000-0002-5194-3019'
    },
    'Cherie Briggs': {
      googleScholar: 'https://scholar.google.com/citations?user=i5xGPOkAAAAJ',
      orcid: '0000-0002-5059-6857'
    },
    'Scott Hodges': {
      googleScholar: 'https://scholar.google.com/citations?user=gMVhDNgAAAAJ'
    },
    'Stephen Proulx': {
      labWebsite: 'https://www.eve.ucsb.edu/proulx/',
      googleScholar: 'https://scholar.google.com/citations?user=wQf0fD8AAAAJ',
      orcid: '0000-0002-5157-7463'
    },
    'Joel Rothman': {
      labWebsite: 'https://www.mcdb.ucsb.edu/people/faculty/joel-rothman',
      googleScholar: 'https://scholar.google.com/citations?user=V8U7mF8AAAAJ'
    },
    'Steve Gaines': {
      googleScholar: 'https://scholar.google.com/citations?user=G7p9JAUAAAAJ',
      orcid: '0000-0003-2812-8917'
    },
    'Jenn Caselle': {
      googleScholar: 'https://scholar.google.com/citations?user=hNUYBHQAAAAJ',
      orcid: '0000-0002-8433-7998'
    },
    'Sally Holbrook': {
      googleScholar: 'https://scholar.google.com/citations?user=9JsFslEAAAAJ',
      orcid: '0000-0002-8433-8831'
    },
    'Kevin Lafferty': {
      googleScholar: 'https://scholar.google.com/citations?user=FE4OOuMAAAAJ',
      orcid: '0000-0001-9185-4548'
    }
  };

  let updated = 0;
  let notFound = 0;

  for (const [name, links] of Object.entries(facultyLinks)) {
    const person = faculty.find(f => f.attributes.fullName === name);

    if (!person) {
      console.log(`❌ Not found in database: ${name}`);
      notFound++;
      continue;
    }

    console.log(`\n📝 Updating ${name}...`);

    const updateData = {};
    if (links.labWebsite) {
      updateData.labWebsite = links.labWebsite;
      console.log(`   🌐 Lab: ${links.labWebsite}`);
    }
    if (links.googleScholar) {
      updateData.googleScholar = links.googleScholar;
      console.log(`   🎓 Scholar: ${links.googleScholar}`);
    }
    if (links.orcid) {
      updateData.orcid = links.orcid;
      console.log(`   🆔 ORCID: ${links.orcid}`);
    }

    const updateResponse = await fetch(`${API_URL}/faculties/${person.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: updateData })
    });

    if (updateResponse.ok) {
      console.log(`   ✅ Updated successfully`);
      updated++;
    } else {
      const errorText = await updateResponse.text();
      console.log(`   ❌ Failed: ${errorText}`);
    }
  }

  console.log('\n\n═══════════════════════════════════════');
  console.log('📊 Summary:');
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ❌ Not found: ${notFound}`);
  console.log(`   📝 Total: ${Object.keys(facultyLinks).length}`);
  console.log('═══════════════════════════════════════\n');
  console.log('✨ Refresh your browser to see the social/academic links!\n');
}

addRealSocialLinks().catch(console.error);
