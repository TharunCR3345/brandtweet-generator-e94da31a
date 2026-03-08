import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { brandName } = await req.json();
    if (!brandName) throw new Error("brandName is required");

    const API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!API_KEY) throw new Error("AI API key is not configured");

    const prompt = `Analyze "${brandName}" social media presence across Twitter/X, Instagram, LinkedIn. Return JSON only, no markdown.

JSON format:
{
  "platforms": [{ "platform": "Twitter/X"|"Instagram"|"LinkedIn", "handle": "@handle", "followerEstimate": "~100K", "postingFrequency": "3x/week", "samplePosts": [{ "text": "post text", "engagement": "2K likes", "type": "promotional|organic|engagement", "url": "https://real-url-to-post" }] }],
  "voiceProfile": { "tone": "", "personality": "", "writingPatterns": [""], "emojiStyle": "", "hashtagStyle": "", "contentThemes": [""], "engagementStyle": "", "uniqueTraits": [""] },
  "audienceProfile": { "demographics": "", "interests": [""], "engagementPatterns": "" },
  "overallSummary": ""
}

Include 2-3 sample posts per platform with real URLs. Be concise and specific.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You are a social media analyst. Respond with valid JSON only, no markdown fences." },
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
