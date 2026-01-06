const fs = require('fs');
const path = require('path');
const https = require('https');

// Read the existing news data
const newsDataPath = path.join(__dirname, '../src/data/news.json');
const newsData = JSON.parse(fs.readFileSync(newsDataPath, 'utf8'));

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function extractContent(html) {
  // Find the region-content area and extract paragraphs
  const regionMatch = html.match(/<div class="region region-content">([\s\S]*?)<footer/i);

  if (regionMatch) {
    let content = regionMatch[1];

    // Extract just the paragraphs
    const paragraphs = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;

    while ((match = pRegex.exec(content)) !== null) {
      let text = match[1];
      // Remove HTML tags
      text = text.replace(/<[^>]+>/g, '');
      // Decode HTML entities
      text = text.replace(/&nbsp;/g, ' ');
      text = text.replace(/&amp;/g, '&');
      text = text.replace(/&lt;/g, '<');
      text = text.replace(/&gt;/g, '>');
      text = text.replace(/&quot;/g, '"');
      text = text.replace(/&#39;/g, "'");
      text = text.replace(/&rsquo;/g, "'");
      text = text.replace(/&lsquo;/g, "'");
      text = text.replace(/&rdquo;/g, '"');
      text = text.replace(/&ldquo;/g, '"');
      text = text.replace(/&mdash;/g, '—');
      text = text.replace(/&ndash;/g, '–');
      text = text.replace(/&#\d+;/g, ''); // Remove numeric entities
      text = text.trim();

      // Only include substantial paragraphs
      if (text.length > 30) {
        paragraphs.push(text);
      }
    }

    if (paragraphs.length > 0) {
      return paragraphs.join('\n\n');
    }
  }

  return null;
}

async function scrapeFullArticles() {
  console.log(`Scraping full content for ${newsData.length} articles...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < newsData.length; i++) {
    const article = newsData[i];

    // Construct the URL based on the date and slug
    const dateObj = new Date(article.date);
    const year = dateObj.getFullYear();
    const url = `https://www.eemb.ucsb.edu/news/all/${year}/${article.slug}`;

    process.stdout.write(`[${i + 1}/${newsData.length}] ${article.title.substring(0, 50)}... `);

    try {
      const html = await fetchPage(url);
      const content = extractContent(html);

      if (content && content.length > article.excerpt.length) {
        article.content = content;
        article.originalUrl = url;
        successCount++;
        console.log(`✓ ${content.length} chars`);
      } else {
        // Keep the excerpt as content if we couldn't get more
        article.content = article.excerpt;
        article.originalUrl = url;
        console.log(`! excerpt only`);
      }

    } catch (error) {
      console.log(`✗ ${error.message}`);
      article.content = article.excerpt;
      article.originalUrl = url;
      errorCount++;
    }

    // Small delay to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Save the updated news data
  fs.writeFileSync(newsDataPath, JSON.stringify(newsData, null, 2));

  console.log(`\n========================================`);
  console.log(`✓ Complete! Saved updated news data`);
  console.log(`  Full content: ${successCount}/${newsData.length}`);
  console.log(`  Excerpt only: ${newsData.length - successCount - errorCount}`);
  console.log(`  Errors: ${errorCount}`);
}

scrapeFullArticles().catch(console.error);
