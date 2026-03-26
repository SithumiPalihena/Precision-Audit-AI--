const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeMetrics(url) {
  const { data: html } = await axios.get(url);
  const $ = cheerio.load(html);

  // Word count
  const text = $('body').text();
  const wordCount = text.trim().split(/\s+/).length;

  // Headings
  const headings = {
    h1: $('h1').length,
    h2: $('h2').length,
    h3: $('h3').length,
  };

  // CTAs: buttons + primary links
  const ctas = $('button, a').filter((i, el) => {
    const classes = ($(el).attr('class') || '').toLowerCase();
    return classes.includes('cta') || $(el).text().toLowerCase().includes('buy') || $(el).text().toLowerCase().includes('get');
  }).length;

  // Links
  const links = $('a');
  let internalLinks = 0, externalLinks = 0;
  links.each((i, el) => {
    const href = $(el).attr('href') || '';
    if (href.startsWith('http') && !href.includes(new URL(url).hostname)) externalLinks++;
    else internalLinks++;
  });

  // Images
  const images = $('img');
  const imageCount = images.length;
  const imagesMissingAlt = images.filter((i, el) => !$(el).attr('alt')).length;
  const missingAltPercent = imageCount ? Math.round((imagesMissingAlt / imageCount) * 100) : 0;

  // Meta
  const metaTitle = $('title').text() || '';
  const metaDescription = $('meta[name="description"]').attr('content') || '';

  return {
    wordCount,
    headings,
    ctas,
    links: { internal: internalLinks, external: externalLinks },
    images: { total: imageCount, missingAltPercent }, // Fixed: was missingAlt, now matches frontend
    meta: { title: metaTitle, description: metaDescription },
  };
}

module.exports = { scrapeMetrics };
