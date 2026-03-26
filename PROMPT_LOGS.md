1. System Prompt
The system prompt defines the AI's persona and enforces a strict JSON output format to ensure the frontend can parse the data reliably.

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

2. User Prompt Construction
The user prompt is dynamically constructed by injecting the JSON stringified metrics object and the target URL.

const userPrompt = `
Metrics: ${JSON.stringify(metrics)}
URL: ${url}
`;

Example of actual input sent to Model:

Metrics: {"wordCount":842,"headings":{"h1":1,"h2":3,"h3":8},"ctas":4,"links":{"internal":12,"external":2},"images":{"total":6,"missingAltPercent":33},"meta":{"title":"Home - Eight25Media","description":"Strategic web design."}} 
URL: https://eight25media.com
