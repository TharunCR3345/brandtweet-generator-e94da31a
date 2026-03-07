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

    const analysisPrompt = `You are a real social media manager who has worked at ${brandName} for 3 years. You write tweets the way a real human does — imperfect, relatable, sometimes casual, sometimes punchy. You never sound robotic or corporate.

Brand: ${brandName}
Industry: ${industry}
Campaign Objective: ${objective}
Product/Service: ${productDescription}

STEP 1: Analyze the brand voice based on your deep knowledge:
1. Brand Tone
2. Target Audience
3. Communication Style
4. Key Content Themes (3-5)
5. Frequently Used Keywords (5-8)
6. Emoji Usage Style

STEP 2: Write exactly 10 tweets. Follow these STRICT rules:

AUTHENTICITY RULES:
- Write like a real person, not a marketing bot. Use contractions, slang where appropriate, incomplete thoughts, rhetorical questions.
- NEVER use generic filler phrases like "Elevate your game", "Take it to the next level", "Unleash your potential", "Game-changer", "Don't miss out". These scream AI.
- Vary sentence length dramatically. Some tweets should be 5 words. Others can be longer.
- Include human quirks: starting with lowercase, using "ngl", "lowkey", "tbh", "idk" where it fits the brand.
- Some tweets should feel like shower thoughts or random observations related to the brand.
- Reference specific, concrete details — not vague platitudes. Mention real scenarios, feelings, moments.
- At least 2 tweets should have NO hashtags at all.
- At least 1 tweet should be a question that sparks replies.
- At least 1 tweet should be funny or slightly self-aware.
- No tweet should read like an ad copy or press release.
- Do NOT recycle or paraphrase any existing viral tweets. Every tweet must be completely original.

BAD EXAMPLE (too robotic): "Ready to conquer your fitness goals? 🏃‍♂️ Our new shoes are here to help you push boundaries! #JustDoIt"
GOOD EXAMPLE (human): "put on the new ones for a quick 5k and honestly forgot i was wearing shoes. that's either really good or really concerning"

Mix of styles: conversational, promotional (but subtle), witty, informative.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a real human social media manager — not an AI copywriter. You write tweets that feel authentic, raw, and personal. You hate corporate jargon. You never plagiarize. Every tweet you write is 100% original and sounds like it came from a real person scrolling Twitter at 2am. Respond only via the tool call." },
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
