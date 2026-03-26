const { OpenAI } = require("openai");

function buildFallbackAnalysis(reason) {
  return {
    insights: {
      seo: `AI analysis unavailable${reason ? `: ${reason}` : '.'}`,
      messaging: 'AI analysis unavailable.',
      cta: 'AI analysis unavailable.',
      ux: 'AI analysis unavailable.',
    },
    recommendations: [],
  };
}

async function analyzeWithAI(metrics, url) {
  if (!process.env.OPENROUTER_API_KEY) {
    return buildFallbackAnalysis('missing OPENROUTER_API_KEY');
  }

  const systemPrompt = `
You are an AI assistant for a marketing web agency. 
Analyze a single webpage using provided metrics.
Provide:
1. SEO structure analysis
2. Messaging clarity
3. CTA usage
4. Content depth
5. UX/structural concerns
Then provide 3-5 actionable recommendations, prioritized.
Always reference the provided metrics explicitly.
Respond in JSON format only, no markdown, no extra text:
{
  "insights": {
    "seo": "...",
    "messaging": "...",
    "cta": "...",
    "ux": "..."
  },
  "recommendations": ["...", "...", "...", "...", "..."]
}
`;

  const userPrompt = `
Metrics: ${JSON.stringify(metrics)}
URL: ${url}
`;

  const openRouterClient = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1"
  });

  let response;
  try {
    response = await openRouterClient.chat.completions.create({
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
    });
  } catch (error) {
    const upstreamMessage =
      error?.status && error?.message
        ? `${error.status} ${error.message}`
        : error?.message || 'upstream AI request failed';
    console.error('AI request failed', upstreamMessage);
    return buildFallbackAnalysis(upstreamMessage);
  }

  // Fixed: v4 response structure
  let aiOutput = { insights: {}, recommendations: [] };
  try {
    const raw = response.choices[0].message.content;
    aiOutput = JSON.parse(raw);
  } catch (err) {
    console.error('AI output parse error', err);
    return buildFallbackAnalysis('invalid AI JSON response');
  }

  return aiOutput;
}

module.exports = { analyzeWithAI };
