import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function searchFirecrawl(query: string, apiKey: string, limit = 5): Promise<any[]> {
  try {
    const response = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        limit,
        scrapeOptions: { formats: ["markdown"] },
      }),
    });

    if (!response.ok) {
      console.error(`Firecrawl search failed for "${query}":`, response.status);
      return [];
    }

    const data = await response.json();
    return data?.data || [];
  } catch (e) {
    console.error(`Firecrawl search error for "${query}":`, e);
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { brandName } = await req.json();
    if (!brandName) throw new Error("brandName is required");

    const API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!API_KEY) throw new Error("AI API key is not configured");

    const FIRECRAWL_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    
    let realPostsContext = "";

    if (FIRECRAWL_KEY) {
      console.log("Firecrawl connected — fetching real social media posts for:", brandName);

      // Search for real posts across platforms in parallel
      const [twitterResults, instagramResults, linkedinResults, generalResults] = await Promise.all([
        searchFirecrawl(`${brandName} site:x.com OR site:twitter.com latest tweets`, FIRECRAWL_KEY, 5),
        searchFirecrawl(`${brandName} site:instagram.com recent posts`, FIRECRAWL_KEY, 5),
        searchFirecrawl(`${brandName} site:linkedin.com posts updates`, FIRECRAWL_KEY, 5),
        searchFirecrawl(`${brandName} social media posts tweets latest 2024 2025`, FIRECRAWL_KEY, 5),
      ]);

      const formatResults = (results: any[], platform: string) => {
        if (!results.length) return "";
        return results
          .map((r: any) => {
            const content = r.markdown?.substring(0, 500) || r.description || "";
            const url = r.url || "";
            return `[${platform}] URL: ${url}\nContent: ${content}`;
          })
          .join("\n---\n");
      };

      const twitterPosts = formatResults(twitterResults, "Twitter/X");
      const instagramPosts = formatResults(instagramResults, "Instagram");
      const linkedinPosts = formatResults(linkedinResults, "LinkedIn");
      const generalPosts = formatResults(generalResults, "Web");

      realPostsContext = `
REAL SCRAPED SOCIAL MEDIA DATA (these are ACTUAL posts found on the internet — use them as ground truth):

=== TWITTER/X POSTS ===
${twitterPosts || "No Twitter posts found"}

=== INSTAGRAM POSTS ===
${instagramPosts || "No Instagram posts found"}

=== LINKEDIN POSTS ===
${linkedinPosts || "No LinkedIn posts found"}

=== GENERAL WEB MENTIONS ===
${generalPosts || "No general posts found"}

IMPORTANT: Base your analysis PRIMARILY on the real scraped content above. Extract actual post text, actual engagement patterns, and actual writing style from these real posts. The sample posts in your response MUST be real posts from the scraped data — do NOT fabricate posts.`;

      console.log(`Found: ${twitterResults.length} Twitter, ${instagramResults.length} Instagram, ${linkedinResults.length} LinkedIn, ${generalResults.length} general results`);
    } else {
      console.log("No Firecrawl key — falling back to AI knowledge-based analysis");
      realPostsContext = "\nNOTE: No real-time scraping available. Use your training knowledge to infer the brand's social media presence as accurately as possible. Clearly indicate that these are inferred, not scraped.";
    }

    const prompt = `Analyze "${brandName}" social media presence across Twitter/X, Instagram, LinkedIn.
${realPostsContext}

Return JSON only, no markdown fences.

JSON format:
{
  "platforms": [{ "platform": "Twitter/X"|"Instagram"|"LinkedIn", "handle": "@handle", "followerEstimate": "~100K", "postingFrequency": "3x/week", "samplePosts": [{ "text": "ACTUAL post text from scraped data", "engagement": "2K likes", "type": "promotional|organic|engagement", "url": "https://real-url-to-post" }] }],
  "voiceProfile": { "tone": "", "personality": "", "writingPatterns": [""], "emojiStyle": "", "hashtagStyle": "", "contentThemes": [""], "engagementStyle": "", "uniqueTraits": [""] },
  "audienceProfile": { "demographics": "", "interests": [""], "engagementPatterns": "" },
  "overallSummary": "",
  "dataSource": "${FIRECRAWL_KEY ? "real-time-scrape" : "ai-knowledge"}"
}

Include 2-3 sample posts per platform. If real scraped data is available, use ACTUAL post text from the scraped content — do NOT make up fake posts. Include real URLs from the scraped data. Be concise and specific.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a social media analyst. When provided with real scraped social media data, use it as your primary source of truth. Extract actual posts, actual writing patterns, and actual engagement metrics from the scraped content. Do NOT fabricate posts when real data is available. Respond with valid JSON only, no markdown fences." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content in response");

    // Parse JSON from response (strip markdown fences if present)
    const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(jsonStr);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-brand-social error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
