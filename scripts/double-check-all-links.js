#!/usr/bin/env node

/**
 * Double-check all faculty links
 * - Verify each link is accessible
 * - Check if screenshots exist
 * - Validate link correctness
 * - Generate comprehensive report
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

async function checkURL(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;

    const request = client.request(url, { method: 'HEAD', timeout: 10000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        checkURL(res.headers.location).then(resolve);
      } else {
        resolve({
          url,
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 400
        });
      }
    });

    request.on('error', (error) => {
      resolve({
        url,
        status: null,
        ok: false,
        error: error.message
      });
    });

    request.on('timeout', () => {
      request.destroy();
      resolve({
        url,
        status: null,
        ok: false,
        error: 'Timeout'
      });
    });

    request.end();
  });
}

async function doubleCheckAllLinks() {
  const STRAPI_URL = 'http://localhost:1337';
  const API_URL = `${STRAPI_URL}/api`;
  const screenshotDir = path.join(__dirname, '..', 'link-validation-screenshots');

  console.log('\\n🔍 DOUBLE-CHECKING ALL FACULTY LINKS\\n');
  console.log('═══════════════════════════════════════════════════════════\\n');

  // Fetch all faculty
  const response = await fetch(`${API_URL}/faculties?pagination[limit]=200`);
  const data = await response.json();
  const faculty = data.data;

  console.log(`Found ${faculty.length} faculty in database\\n`);

  const issues = [];
  const warnings = [];
  const verified = [];

  let totalLinks = 0;
  let brokenLinks = 0;
  let missingScreenshots = 0;
  let suspiciousLinks = 0;
  let goodLinks = 0;

  for (const person of faculty) {
    const attrs = person.attributes;
    const name = attrs.fullName;
    const safeName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    if (!attrs.labWebsite && !attrs.googleScholar && !attrs.orcid) {
      continue;
    }

    console.log(`\\n👤 ${name}`);
    console.log('─'.repeat(60));

    // Check lab website
    if (attrs.labWebsite) {
      totalLinks++;
      console.log(`  🌐 Lab: ${attrs.labWebsite}`);

      // Check if suspicious
      if (attrs.labWebsite.includes('policy.ucsb.edu') ||
          attrs.labWebsite.includes('example.com') ||
          attrs.labWebsite.includes('terms-of-use')) {
        suspiciousLinks++;
        console.log('    ⚠️  SUSPICIOUS - Not a real lab website');
        warnings.push({
          faculty: name,
          type: 'labWebsite',
          url: attrs.labWebsite,
          issue: 'Suspicious URL (policy page or placeholder)'
        });
      } else {
        // Check if accessible
        const result = await checkURL(attrs.labWebsite);

        if (result.ok) {
          goodLinks++;
          console.log(`    ✅ Accessible (${result.status})`);

          // Check for screenshot
          const screenshotPath = path.join(screenshotDir, `${safeName}_lab.png`);
          if (fs.existsSync(screenshotPath)) {
            const stats = fs.statSync(screenshotPath);
            console.log(`    📸 Screenshot exists (${Math.round(stats.size/1024)}KB)`);
            verified.push({
              faculty: name,
              type: 'labWebsite',
              url: attrs.labWebsite,
              status: 'verified'
            });
          } else {
            missingScreenshots++;
            console.log('    ⚠️  Screenshot missing');
            warnings.push({
              faculty: name,
              type: 'labWebsite',
              url: attrs.labWebsite,
              issue: 'Screenshot missing'
            });
          }
        } else {
          brokenLinks++;
          console.log(`    ❌ BROKEN (${result.error || result.status})`);
          issues.push({
            faculty: name,
            type: 'labWebsite',
            url: attrs.labWebsite,
            issue: result.error || `HTTP ${result.status}`
          });
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Check Google Scholar
    if (attrs.googleScholar) {
      totalLinks++;
      console.log(`  🎓 Scholar: ${attrs.googleScholar}`);

      const result = await checkURL(attrs.googleScholar);

      if (result.ok) {
        goodLinks++;
        console.log(`    ✅ Accessible (${result.status})`);

        const screenshotPath = path.join(screenshotDir, `${safeName}_scholar.png`);
        if (fs.existsSync(screenshotPath)) {
          const stats = fs.statSync(screenshotPath);
          console.log(`    📸 Screenshot exists (${Math.round(stats.size/1024)}KB)`);
          verified.push({
            faculty: name,
            type: 'googleScholar',
            url: attrs.googleScholar,
            status: 'verified'
          });
        } else {
          missingScreenshots++;
          console.log('    ⚠️  Screenshot missing');
        }
      } else {
        brokenLinks++;
        console.log(`    ❌ BROKEN (${result.error || result.status})`);
        issues.push({
          faculty: name,
          type: 'googleScholar',
          url: attrs.googleScholar,
          issue: result.error || `HTTP ${result.status}`
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Check ORCID
    if (attrs.orcid) {
      totalLinks++;
      const orcidUrl = `https://orcid.org/${attrs.orcid}`;
      console.log(`  🆔 ORCID: ${orcidUrl}`);

      const result = await checkURL(orcidUrl);

      if (result.ok) {
        goodLinks++;
        console.log(`    ✅ Accessible (${result.status})`);
        verified.push({
          faculty: name,
          type: 'orcid',
          url: orcidUrl,
          status: 'verified'
        });
      } else {
        brokenLinks++;
        console.log(`    ❌ BROKEN (${result.error || result.status})`);
        issues.push({
          faculty: name,
          type: 'orcid',
          url: orcidUrl,
          issue: result.error || `HTTP ${result.status}`
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Print summary
  console.log('\\n\\n═══════════════════════════════════════════════════════════');
  console.log('📊 COMPREHENSIVE LINK CHECK SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Total links checked: ${totalLinks}`);
  console.log(`✅ Good links: ${goodLinks} (${Math.round(goodLinks/totalLinks*100)}%)`);
  console.log(`❌ Broken links: ${brokenLinks} (${Math.round(brokenLinks/totalLinks*100)}%)`);
  console.log(`⚠️  Suspicious links: ${suspiciousLinks}`);
  console.log(`📸 Missing screenshots: ${missingScreenshots}`);
  console.log(`✓ Verified with screenshots: ${verified.length}`);
  console.log('═══════════════════════════════════════════════════════════');

  // Print issues
  if (issues.length > 0) {
    console.log('\\n\\n❌ BROKEN LINKS TO FIX:\\n');
    issues.forEach(issue => {
      console.log(`${issue.faculty} - ${issue.type}`);
      console.log(`   URL: ${issue.url}`);
      console.log(`   Issue: ${issue.issue}\\n`);
    });
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log('\\n⚠️  WARNINGS:\\n');
    warnings.forEach(warning => {
      console.log(`${warning.faculty} - ${warning.type}`);
      console.log(`   URL: ${warning.url}`);
      console.log(`   Issue: ${warning.issue}\\n`);
    });
  }

  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalLinks,
      goodLinks,
      brokenLinks,
      suspiciousLinks,
      missingScreenshots,
      verifiedWithScreenshots: verified.length
    },
    issues,
    warnings,
    verified
  };

  const reportPath = path.join(__dirname, '..', 'link-check-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\\n📄 Detailed report saved: link-check-report.json`);
  console.log('\\n✨ Double-check complete!\\n');
}

doubleCheckAllLinks().catch(console.error);
