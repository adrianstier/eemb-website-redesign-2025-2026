#!/usr/bin/env node

/**
 * Systematically validate all faculty links:
 * 1. Check if URLs are accessible (200 status)
 * 2. Scrape content to verify relevance
 * 3. Take screenshots with Playwright to visually verify
 * 4. Generate validation report
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function fetchWithStatus(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;

    const options = {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };

    const request = client.request(url, options, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchWithStatus(res.headers.location).then(resolve);
      } else {
        resolve({
          url,
          status: res.statusCode,
          accessible: res.statusCode >= 200 && res.statusCode < 400,
          redirected: false
        });
      }
    });

    request.on('error', (error) => {
      resolve({
        url,
        status: null,
        accessible: false,
        error: error.message
      });
    });

    request.setTimeout(10000, () => {
      request.destroy();
      resolve({
        url,
        status: null,
        accessible: false,
        error: 'Timeout'
      });
    });

    request.end();
  });
}

async function fetchContent(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
        // Limit content to first 50KB to avoid memory issues
        if (data.length > 50000) {
          res.destroy();
        }
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', () => {
      resolve('');
    }).setTimeout(10000, function() {
      this.destroy();
      resolve('');
    });
  });
}

function analyzeContent(html, facultyName) {
  const analysis = {
    title: null,
    hasRelevantKeywords: false,
    keywords: [],
    likelyCorrect: false
  };

  // Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    analysis.title = titleMatch[1].trim();
  }

  // Check for relevant keywords
  const lowerHtml = html.toLowerCase();
  const lowerName = facultyName.toLowerCase();
  const nameParts = lowerName.split(' ');
  const lastName = nameParts[nameParts.length - 1];

  const keywords = [
    lowerName,
    lastName,
    'lab',
    'research',
    'ucsb',
    'eemb',
    'ecology',
    'evolution',
    'marine biology',
    'publications'
  ];

  const foundKeywords = keywords.filter(keyword => lowerHtml.includes(keyword));
  analysis.keywords = foundKeywords;
  analysis.hasRelevantKeywords = foundKeywords.length >= 2;

  // Check if likely correct (has name or lab + UCSB)
  const hasName = lowerHtml.includes(lastName);
  const hasLab = lowerHtml.includes('lab') || lowerHtml.includes('laboratory');
  const hasUCSB = lowerHtml.includes('ucsb') || lowerHtml.includes('santa barbara');

  analysis.likelyCorrect = hasName || (hasLab && hasUCSB);

  return analysis;
}

async function validateAllLinks() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;

  console.log('🔍 Fetching faculty from database...\n');

  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  console.log(`📋 Found ${faculty.length} faculty in database\n`);

  const validationResults = [];
  let totalLinks = 0;
  let accessibleLinks = 0;
  let brokenLinks = 0;
  let suspiciousLinks = 0;

  // Create output directory for screenshots
  const screenshotDir = path.join(__dirname, '..', 'link-validation-screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('🔗 Validating links...\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  for (const person of faculty) {
    const attrs = person.attributes;
    const name = attrs.fullName;

    if (!attrs.labWebsite && !attrs.googleScholar && !attrs.orcid) {
      continue;
    }

    console.log(`\n👤 ${name}`);
    console.log('─'.repeat(60));

    const personResults = {
      name,
      id: person.id,
      links: {}
    };

    // Validate lab website
    if (attrs.labWebsite) {
      totalLinks++;
      console.log(`\n🌐 Lab Website: ${attrs.labWebsite}`);

      const status = await fetchWithStatus(attrs.labWebsite);
      console.log(`   Status: ${status.accessible ? '✅' : '❌'} ${status.status || status.error}`);

      if (status.accessible) {
        accessibleLinks++;
        const content = await fetchContent(attrs.labWebsite);
        const analysis = analyzeContent(content, name);

        console.log(`   Title: ${analysis.title || 'Not found'}`);
        console.log(`   Keywords found: ${analysis.keywords.join(', ') || 'none'}`);
        console.log(`   Likely correct: ${analysis.likelyCorrect ? '✅ Yes' : '⚠️  Uncertain'}`);

        if (!analysis.likelyCorrect) {
          suspiciousLinks++;
          console.log(`   ⚠️  WARNING: This link may not be correct!`);
        }

        personResults.links.labWebsite = {
          url: attrs.labWebsite,
          accessible: true,
          status: status.status,
          analysis
        };
      } else {
        brokenLinks++;
        console.log(`   ❌ BROKEN LINK`);
        personResults.links.labWebsite = {
          url: attrs.labWebsite,
          accessible: false,
          status: status.status,
          error: status.error
        };
      }

      // Add delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Validate Google Scholar
    if (attrs.googleScholar) {
      totalLinks++;
      console.log(`\n🎓 Google Scholar: ${attrs.googleScholar}`);

      const status = await fetchWithStatus(attrs.googleScholar);
      console.log(`   Status: ${status.accessible ? '✅' : '❌'} ${status.status || status.error}`);

      if (status.accessible) {
        accessibleLinks++;
        personResults.links.googleScholar = {
          url: attrs.googleScholar,
          accessible: true,
          status: status.status
        };
      } else {
        brokenLinks++;
        personResults.links.googleScholar = {
          url: attrs.googleScholar,
          accessible: false,
          error: status.error
        };
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Validate ORCID
    if (attrs.orcid) {
      totalLinks++;
      const orcidUrl = `https://orcid.org/${attrs.orcid}`;
      console.log(`\n🆔 ORCID: ${orcidUrl}`);

      const status = await fetchWithStatus(orcidUrl);
      console.log(`   Status: ${status.accessible ? '✅' : '❌'} ${status.status || status.error}`);

      if (status.accessible) {
        accessibleLinks++;
        personResults.links.orcid = {
          url: orcidUrl,
          accessible: true,
          status: status.status
        };
      } else {
        brokenLinks++;
        personResults.links.orcid = {
          url: orcidUrl,
          accessible: false,
          error: status.error
        };
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    validationResults.push(personResults);
  }

  // Generate summary report
  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('📊 VALIDATION SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   Total links checked: ${totalLinks}`);
  console.log(`   ✅ Accessible: ${accessibleLinks} (${Math.round(accessibleLinks/totalLinks*100)}%)`);
  console.log(`   ❌ Broken: ${brokenLinks} (${Math.round(brokenLinks/totalLinks*100)}%)`);
  console.log(`   ⚠️  Suspicious: ${suspiciousLinks} (${Math.round(suspiciousLinks/totalLinks*100)}%)`);
  console.log('═══════════════════════════════════════════════════════════\n');

  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'link-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalLinks,
      accessibleLinks,
      brokenLinks,
      suspiciousLinks
    },
    results: validationResults
  }, null, 2));

  console.log(`📄 Detailed report saved to: ${reportPath}\n`);

  // List broken links
  if (brokenLinks > 0) {
    console.log('\n❌ BROKEN LINKS:\n');
    for (const result of validationResults) {
      for (const [type, link] of Object.entries(result.links)) {
        if (!link.accessible) {
          console.log(`   ${result.name} - ${type}: ${link.url}`);
          console.log(`      Error: ${link.error || 'HTTP ' + link.status}`);
        }
      }
    }
  }

  // List suspicious links
  if (suspiciousLinks > 0) {
    console.log('\n\n⚠️  SUSPICIOUS LINKS (may not be correct):\n');
    for (const result of validationResults) {
      if (result.links.labWebsite &&
          result.links.labWebsite.accessible &&
          result.links.labWebsite.analysis &&
          !result.links.labWebsite.analysis.likelyCorrect) {
        console.log(`   ${result.name}: ${result.links.labWebsite.url}`);
        console.log(`      Title: ${result.links.labWebsite.analysis.title || 'N/A'}`);
      }
    }
  }

  console.log('\n✨ Validation complete!\n');
  console.log('🎬 To take screenshots with Playwright, run:');
  console.log('   node scripts/screenshot-faculty-links.js\n');
}

validateAllLinks().catch(console.error);
