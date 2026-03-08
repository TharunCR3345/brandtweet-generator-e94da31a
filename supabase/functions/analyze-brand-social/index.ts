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

    // Step 1: Use AI to search and analyze the brand's social media presence
    const searchPrompt = `You are a social media analyst. Research and analyze the brand "${brandName}" across Twitter/X, Instagram, and LinkedIn.

Based on your knowledge of this brand's real social media presence, provide:

1. **Recent Post Examples**: Find or reconstruct 8-12 realistic recent posts/tweets from this brand across platforms (Twitter/X, Instagram, LinkedIn). These should reflect what the brand actually posts — not generic marketing copy.

2. **Voice Analysis**: Based on these posts, analyze:
   - Overall tone and personality
   - Writing patterns (sentence structure, punctuation habits, emoji usage, hashtag style)
   - Content themes they focus on
   - How they engage with their audience
   - Platform-specific differences in their voice
   - Slang, abbreviations, or brand-specific language they use

3. **Audience Analysis**: Who engages with their content and how

Be specific and grounded. Reference actual campaigns, product lines, or events where possible.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a social media research analyst. You have deep knowledge of how major and emerging brands communicate on social media. Always respond via the tool call with accurate, specific analysis." },
          { role: "user", content: searchPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "social_media_analysis",
              description: "Return comprehensive social media analysis for a brand",
              parameters: {
                type: "object",
                properties: {
                  platforms: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        platform: { type: "string", enum: ["Twitter/X", "Instagram", "LinkedIn"] },
                        handle: { type: "string" },
                        followerEstimate: { type: "string" },
                        postingFrequency: { type: "string" },
                        samplePosts: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              text: { type: "string" },
                              engagement: { type: "string" },
                              type: { type: "string" },
                              url: { type: "string", description: "Direct URL to the actual post on the platform. Must be a real, valid link." },
                            },
                            required: ["text", "engagement", "type", "url"],
                            additionalProperties: false,
                          },
                        },
                      },
                      required: ["platform", "handle", "followerEstimate", "postingFrequency", "samplePosts"],
                      additionalProperties: false,
                    },
                  },
                  voiceProfile: {
                    type: "object",
                    properties: {
                      tone: { type: "string" },
                      personality: { type: "string" },
                      writingPatterns: { type: "array", items: { type: "string" } },
                      emojiStyle: { type: "string" },
                      hashtagStyle: { type: "string" },
                      contentThemes: { type: "array", items: { type: "string" } },
                      engagementStyle: { type: "string" },
                      uniqueTraits: { type: "array", items: { type: "string" } },
                    },
                    required: ["tone", "personality", "writingPatterns", "emojiStyle", "hashtagStyle", "contentThemes", "engagementStyle", "uniqueTraits"],
                    additionalProperties: false,
                  },
                  audienceProfile: {
                    type: "object",
                    properties: {
                      demographics: { type: "string" },
                      interests: { type: "array", items: { type: "string" } },
                      engagementPatterns: { type: "string" },
                    },
                    required: ["demographics", "interests", "engagementPatterns"],
                    additionalProperties: false,
                  },
                  overallSummary: { type: "string" },
                },
                required: ["platforms", "voiceProfile", "audienceProfile", "overallSummary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "social_media_analysis" } },
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
    if (!toolCall) throw new Error("No tool call in response");

    const result = JSON.parse(toolCall.function.arguments);

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
