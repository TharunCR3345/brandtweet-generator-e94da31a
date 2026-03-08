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

// Social media analysis types
export interface SocialPlatformPost {
  text: string;
  engagement: string;
  type: string;
  url?: string;
}

export interface SocialPlatform {
  platform: string;
  handle: string;
  followerEstimate: string;
  postingFrequency: string;
  samplePosts: SocialPlatformPost[];
}

export interface VoiceProfile {
  tone: string;
  personality: string;
  writingPatterns: string[];
  emojiStyle: string;
  hashtagStyle: string;
  contentThemes: string[];
  engagementStyle: string;
  uniqueTraits: string[];
}

export interface AudienceProfile {
  demographics: string;
  interests: string[];
  engagementPatterns: string;
}

export interface SocialAnalysisResult {
  platforms: SocialPlatform[];
  voiceProfile: VoiceProfile;
  audienceProfile: AudienceProfile;
  overallSummary: string;
}

export async function analyzeBrandSocial(brandName: string): Promise<SocialAnalysisResult> {
  const { data, error } = await supabase.functions.invoke("analyze-brand-social", {
    body: { brandName },
  });

  if (error) throw new Error(error.message || "Failed to analyze brand");
  if (data?.error) throw new Error(data.error);
  return data as SocialAnalysisResult;
}

export async function generateTweets(input: BrandInput & { socialAnalysis?: SocialAnalysisResult }): Promise<GenerateResult> {
  const { data, error } = await supabase.functions.invoke("generate-tweets", {
    body: input,
  });

  if (error) throw new Error(error.message || "Failed to generate tweets");
  if (data?.error) throw new Error(data.error);
  return data as GenerateResult;
}

export interface AutofillResult {
  industry: string;
  productDescription: string;
  objective: string;
}

export async function autofillBrand(brandName: string): Promise<AutofillResult> {
  const { data, error } = await supabase.functions.invoke("brand-autofill", {
    body: { brandName },
  });

  if (error) throw new Error(error.message || "Failed to autofill");
  if (data?.error) throw new Error(data.error);
  return data as AutofillResult;
}
