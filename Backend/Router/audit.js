const express = require('express');
const router = express.Router();
const { scrapeMetrics } = require('../Services/scraper');
const { analyzeWithAI } = require('../Services/aiAnalysis');

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    // Step 1: Scrape metrics
    const metrics = await scrapeMetrics(url);

    // Step 2: Call AI for insights & recommendations
    const aiResults = await analyzeWithAI(metrics, url);

    // Fixed: flatten response so frontend can access data.insights and data.recommendations directly
    res.json({
      metrics,
      insights: aiResults.insights,
      recommendations: aiResults.recommendations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
