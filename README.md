# Precision-Audit-AI
An AI-native website auditing tool designed for Eight25Media. This tool performs real-time scraping of a single webpage, extracts key marketing and SEO metrics, and uses LLM intelligence to provide structured insights and actionable recommendations.

Live Demo: https://precision-audit-ai-t8w9.vercel.app/

🚀 Overview
This tool was built to help marketing agencies quickly evaluate a webpage's performance through two distinct layers:

Factual Data Extraction: Precise scraping of word counts, heading structures, CTA density, and image metadata.

AI Analysis: A grounded reasoning layer that interprets the raw data to provide context-specific advice on SEO, UX, and Messaging.

🛠️ Architecture
The project follows a clean separation of concerns:

Frontend: A modern, responsive UI built with vanilla JS and CSS. It communicates with the backend via a RESTful API and visualizes metrics using a dynamic "Editorial Score" algorithm.

Backend: A Node.js/Express server that orchestrates the audit workflow.

Scraper Service: Uses Cheerio for fast, server-side DOM parsing to extract factual metrics without the overhead of a headless browser.

AI Engine: Integrated with OpenRouter (GPT-3.5-Turbo). It uses a strictly defined system prompt to ensure outputs are returned in valid JSON for seamless frontend integration.

🧠 AI Design Decisions
Grounded Reasoning: The AI is strictly instructed to reference the extracted metrics (e.g., "25% missing alt text") rather than giving generic advice. This prevents "hallucinations" and ensures the audit is based on reality.

Deterministic Output: I used a temperature setting of 0.3 to ensure consistent, professional analysis while maintaining a high degree of JSON reliability.

Structured Prompting: The analysis is divided into five key pillars (SEO, Messaging, CTA, Content Depth, and UX) to mirror the actual workflow of a marketing agency.

⚖️ Trade-offs & Limitations
Single-Page Scraper: To maintain the "lightweight" requirement and high performance, the tool analyzes one URL at a time rather than crawling an entire domain.

Static Scraping vs. SPA: Cheerio was chosen over Puppeteer for speed and lower resource consumption. While this works for 90% of sites, it may not execute heavy JavaScript-based content (Client-side rendering).

Model Choice: GPT-3.5-Turbo was selected for its balance of speed and cost-effectiveness for text-based analysis, though GPT-4o could be swapped in for deeper UX reasoning.

🛠️ Local Setup
Clone the repository

Setup Backend:

Bash
cd Backend
npm install

Configure Environment:
Create a .env file in the /Backend folder:

Code snippet
OPENROUTER_API_KEY=your_api_key_here
PORT=5000
Run the Server:

Bash
npm start

Open Frontend:
Open Frontend/code.html in your browser. (Ensure the BACKEND_URL in the script tag matches your server).
