import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { brandName, industry, objective, productDescription } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Step 1: Analyze brand voice
    const analysisPrompt = `You are a brand strategist and social media expert. Analyze the following brand and provide a detailed brand voice summary.

Brand: ${brandName}
Industry: ${industry}
Campaign Objective: ${objective}
Product/Service: ${productDescription}

Based on your knowledge of this brand (or similar brands in this industry), provide:
1. Brand Tone (e.g., motivational, witty, professional, casual)
2. Target Audience (demographics and psychographics)
3. Communication Style (bold, conversational, formal, etc.)
4. Key Content Themes (3-5 themes)
5. Frequently Used Keywords (5-8 keywords)
6. Emoji Usage Style (heavy, moderate, minimal, none)

Then generate exactly 10 tweets that match this brand voice. The tweets must:
- Be maximum 280 characters each
- Include a mix of styles: conversational/engaging, promotional, witty/meme-style, informative/value-driven
- Feel authentic to the brand
- Include relevant hashtags where appropriate
- Some should include emojis matching the brand style

Return your response as JSON with this exact structure:
{
  "voiceSummary": {
    "tone": "string",
    "targetAudience": "string",
    "communicationStyle": "string",
    "contentThemes": ["string"],
    "keywords": ["string"],
    "emojiStyle": "string"
  },
  "tweets": [
    { "text": "string", "style": "conversational|promotional|witty|informative" }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a world-class brand strategist and social media copywriter. Always respond with valid JSON only, no markdown formatting." },
          { role: "user", content: analysisPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "brand_tweet_output",
              description: "Return brand voice analysis and 10 generated tweets",
              parameters: {
                type: "object",
                properties: {
                  voiceSummary: {
                    type: "object",
                    properties: {
                      tone: { type: "string" },
                      targetAudience: { type: "string" },
                      communicationStyle: { type: "string" },
                      contentThemes: { type: "array", items: { type: "string" } },
                      keywords: { type: "array", items: { type: "string" } },
                      emojiStyle: { type: "string" },
                    },
                    required: ["tone", "targetAudience", "communicationStyle", "contentThemes", "keywords", "emojiStyle"],
                    additionalProperties: false,
                  },
                  tweets: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        style: { type: "string", enum: ["conversational", "promotional", "witty", "informative"] },
                      },
                      required: ["text", "style"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["voiceSummary", "tweets"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "brand_tweet_output" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-tweets error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
