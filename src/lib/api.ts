import { supabase } from "@/integrations/supabase/client";

export type TweetStyle = "conversational" | "promotional" | "witty" | "informative";

export interface Tweet {
  text: string;
  style: TweetStyle;
}

export interface VoiceSummary {
  tone: string;
  targetAudience: string;
  communicationStyle: string;
  contentThemes: string[];
  keywords: string[];
  emojiStyle: string;
}

export interface GenerateResult {
  voiceSummary: VoiceSummary;
  tweets: Tweet[];
}

export interface BrandInput {
  brandName: string;
  industry: string;
  objective: string;
  productDescription: string;
}

export async function generateTweets(input: BrandInput): Promise<GenerateResult> {
  const { data, error } = await supabase.functions.invoke("generate-tweets", {
    body: input,
  });

  if (error) throw new Error(error.message || "Failed to generate tweets");
  if (data?.error) throw new Error(data.error);
  return data as GenerateResult;
}
