#!/usr/bin/env node

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Comprehensive Profile Data Scraper
 * Scrapes FULL profile information including bio, research interests, publications, etc.
 * for all faculty members with profile pages
 */

async function scrapeFullProfiles() {
  console.log('🚀 Starting comprehensive profile data scraping...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  const profiles = [];

  // Get all faculty profile URLs from the faculty page
  console.log('📋 Finding all faculty profile URLs...\n');

  await page.goto('https://www.eemb.ucsb.edu/people/faculty', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await page.waitForTimeout(2000);

  const facultyLinks = await page.evaluate(() => {
    const links = [];
    const personLinks = document.querySelectorAll('a[href*="/people/faculty/"]');

    personLinks.forEach(el => {
      const href = el.href;
      const text = el.innerText.trim();

      // Only include actual profile links
      if (href.includes('/people/faculty/') &&
          !href.endsWith('/people/faculty') &&
          text.length > 0) {
        links.push({ name: text, url: href });
      }
    });

    // Deduplicate
    const seen = new Set();
    return links.filter(link => {
      if (seen.has(link.url)) return false;
      seen.add(link.url);
      return true;
    });
  });

  console.log(`✅ Found ${facultyLinks.length} faculty profiles to scrape\n`);

  // Scrape each profile in detail
  for (let i = 0; i < facultyLinks.length; i++) {
    const person = facultyLinks[i];
    console.log(`[${i + 1}/${facultyLinks.length}] ${person.name}`);

    try {
      const response = await page.goto(person.url, {
        waitUntil: 'networkidle',
        timeout: 20000
      });

      if (!response || response.status() === 404) {
        console.log(`   ⚠️  404 Not Found\n`);
        continue;
      }

      await page.waitForTimeout(1500);

      // Extract comprehensive profile data
      const profileData = await page.evaluate(() => {
        const main = document.querySelector('main') || document.body;

        // Email
        const emailLink = main.querySelector('a[href^="mailto:"]');
        const email = emailLink ? emailLink.href.replace('mailto:', '') : null;

        // Phone
        const phoneLink = main.querySelector('a[href^="tel:"]');
        let phone = phoneLink ? phoneLink.innerText.trim() : null;
        if (!phone) {
          const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
          const phoneMatch = main.innerText.match(phoneRegex);
          if (phoneMatch) phone = phoneMatch[0];
        }

        // Title
        let title = null;
        const titleElements = main.querySelectorAll('h2, h3, .field--name-field-title, .position');
        for (const el of titleElements) {
          const text = el.innerText.trim();
          if (text &&
              (text.includes('Professor') ||
               text.includes('Researcher') ||
               text.includes('Lecturer')) &&
              !text.includes('Research Interests') &&
              text.length < 100) {
            title = text;
            break;
          }
        }

        // Office
        let office = null;
        const officeElement = main.querySelector('.field--name-field-office, .office');
        if (officeElement) {
          office = officeElement.innerText.trim().replace('Office:', '').trim();
        } else {
          const officeMatch = main.innerText.match(/Office:\s*([^\n]+)/);
          if (officeMatch) office = officeMatch[1].trim();
        }

        // Research Interests - try multiple selectors
        let researchInterests = [];

        // Try structured field
        const interestsElement = main.querySelector('.field--name-field-research-interests, .research-interests');
        if (interestsElement) {
          const interestsList = interestsElement.querySelectorAll('li, .field__item');
          if (interestsList.length > 0) {
            researchInterests = Array.from(interestsList).map(li => li.innerText.trim()).filter(Boolean);
          } else {
            // Try as comma-separated text
            const text = interestsElement.innerText.trim();
            if (text) {
              researchInterests = text.split(/[,;]/).map(s => s.trim()).filter(Boolean);
            }
          }
        }

        // If not found, look for "Areas of Research" section
        if (researchInterests.length === 0) {
          const headings = Array.from(main.querySelectorAll('h2, h3, h4'));
          const areasHeading = headings.find(h =>
            h.innerText.toLowerCase().includes('areas of research') ||
            h.innerText.toLowerCase().includes('research interests')
          );

          if (areasHeading) {
            let nextElement = areasHeading.nextElementSibling;
            while (nextElement && researchInterests.length < 15) {
              if (nextElement.tagName === 'UL' || nextElement.tagName === 'OL') {
                const items = Array.from(nextElement.querySelectorAll('li')).map(li => li.innerText.trim());
                researchInterests.push(...items);
                break;
              } else if (nextElement.tagName === 'P') {
                const text = nextElement.innerText.trim();
                if (text) {
                  researchInterests = text.split(/[,;]/).map(s => s.trim()).filter(Boolean);
                  break;
                }
              } else if (nextElement.tagName.match(/^H[1-6]$/)) {
                break; // Hit next section
              }
              nextElement = nextElement.nextElementSibling;
            }
          }
        }

        // Biography - try multiple approaches
        let bio = null;
        let shortBio = null;

        // Try structured bio field
        const bioElement = main.querySelector('.field--name-body, .field--name-field-biography, .bio, .biography');
        if (bioElement) {
          bio = bioElement.innerText.trim();
        }

        // If not found, look for Biography heading
        if (!bio) {
          const headings = Array.from(main.querySelectorAll('h2, h3, h4'));
          const bioHeading = headings.find(h =>
            h.innerText.toLowerCase().includes('biography') ||
            h.innerText.toLowerCase().includes('about')
          );

          if (bioHeading) {
            let bioText = '';
            let nextElement = bioHeading.nextElementSibling;
            while (nextElement && bioText.length < 3000) {
              if (nextElement.tagName === 'P') {
                bioText += nextElement.innerText.trim() + '\n\n';
              } else if (nextElement.tagName.match(/^H[1-6]$/)) {
                break; // Hit next section
              }
              nextElement = nextElement.nextElementSibling;
            }
            if (bioText) bio = bioText.trim();
          }
        }

        // Create short bio from first paragraph
        if (bio) {
          const firstPara = bio.split('\n')[0];
          shortBio = firstPara.length > 300 ? firstPara.substring(0, 297) + '...' : firstPara;
        }

        // Website/Lab URL
        let website = null;
        const links = main.querySelectorAll('a[href]');
        for (const link of links) {
          const href = link.href;
          const text = link.innerText.toLowerCase();
          if (href &&
              (href.includes('http') || href.includes('https')) &&
              !href.includes('ucsb.edu/people') &&
              !href.includes('mailto:') &&
              !href.includes('tel:') &&
              (text.includes('website') ||
               text.includes('lab') ||
               text.includes('personal') ||
               href.includes('edu/~') ||
               href.includes('lab') ||
               href.includes('group'))) {
            website = href;
            break;
          }
        }

        // Google Scholar
        let googleScholar = null;
        for (const link of links) {
          if (link.href.includes('scholar.google')) {
            googleScholar = link.href;
            break;
          }
        }

        // ORCID
        let orcid = null;
        for (const link of links) {
          if (link.href.includes('orcid.org')) {
            orcid = link.href;
            break;
          }
        }

        // Twitter/X
        let twitter = null;
        for (const link of links) {
          if (link.href.includes('twitter.com') || link.href.includes('x.com')) {
            twitter = link.href;
            break;
          }
        }

        return {
          email,
          phone,
          title,
          office,
          researchInterests,
          bio,
          shortBio,
          website,
          googleScholar,
          orcid,
          twitter
        };
      });

      profiles.push({
        name: person.name,
        url: person.url,
        ...profileData
      });

      console.log(`   ✅ Scraped profile`);
      if (profileData.bio) console.log(`      📝 Bio: ${profileData.bio.substring(0, 100)}...`);
      if (profileData.researchInterests && profileData.researchInterests.length > 0) {
        console.log(`      🔬 Research Interests: ${profileData.researchInterests.length} areas`);
      }
      if (profileData.website) console.log(`      🌐 Website: ${profileData.website}`);
      console.log('');

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);
    }
  }

  await browser.close();

  // Save results
  const outputPath = path.join(__dirname, 'full-profiles-data.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: profiles.length,
    profiles
  }, null, 2));

  console.log(`\n✅ Scraping complete!`);
  console.log(`📊 Total profiles scraped: ${profiles.length}`);
  console.log(`💾 Data saved to: ${outputPath}`);

  // Statistics
  const stats = {
    withBio: profiles.filter(p => p.bio).length,
    withResearchInterests: profiles.filter(p => p.researchInterests && p.researchInterests.length > 0).length,
    withWebsite: profiles.filter(p => p.website).length,
    withGoogleScholar: profiles.filter(p => p.googleScholar).length,
    withOrcid: profiles.filter(p => p.orcid).length,
    withTwitter: profiles.filter(p => p.twitter).length,
  };

  console.log(`\n📈 Statistics:`);
  console.log(`   With Bio: ${stats.withBio} (${Math.round(stats.withBio/profiles.length*100)}%)`);
  console.log(`   With Research Interests: ${stats.withResearchInterests} (${Math.round(stats.withResearchInterests/profiles.length*100)}%)`);
  console.log(`   With Website: ${stats.withWebsite} (${Math.round(stats.withWebsite/profiles.length*100)}%)`);
  console.log(`   With Google Scholar: ${stats.withGoogleScholar} (${Math.round(stats.withGoogleScholar/profiles.length*100)}%)`);
  console.log(`   With ORCID: ${stats.withOrcid} (${Math.round(stats.withOrcid/profiles.length*100)}%)`);
  console.log(`   With Twitter: ${stats.withTwitter} (${Math.round(stats.withTwitter/profiles.length*100)}%)`);

  return profiles;
}

scrapeFullProfiles().catch(console.error);
