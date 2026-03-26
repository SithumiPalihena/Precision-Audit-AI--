const { scrapeMetrics } = require('../Backend/Services/scraper');
const { analyzeWithAI } = require('../Backend/Services/aiAnalysis');

function readBody(req) {
  if (!req.body) {
    return {};
  }

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return req.body;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = readBody(req);

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'URL must be a valid absolute URL' });
  }

  try {
    const metrics = await scrapeMetrics(url);
    const aiResults = await analyzeWithAI(metrics, url);
    const warning = aiResults.insights?.seo?.startsWith('AI analysis unavailable')
      ? aiResults.insights.seo
      : null;

    return res.status(200).json({
      metrics,
      insights: aiResults.insights,
      recommendations: aiResults.recommendations,
      warning,
    });
  } catch (error) {
    const message = error?.message || 'Something went wrong';
    console.error('Audit request failed', message);
    return res.status(500).json({ error: `Audit failed: ${message}` });
  }
};
