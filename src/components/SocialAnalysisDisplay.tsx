import { useState } from "react";
import type { SocialAnalysisResult, SocialPlatform, VoiceProfile, AudienceProfile } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Linkedin, ChevronRight, ChevronDown, MessageSquare, Users, ExternalLink } from "lucide-react";

const platformIcon: Record<string, React.ReactNode> = {
  "Twitter/X": <Twitter className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  LinkedIn: <Linkedin className="h-4 w-4" />,
};

function PlatformCard({ platform }: { platform: SocialPlatform }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-6 py-5 hover:bg-accent/5 transition-colors text-left"
      >
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {platformIcon[platform.platform] || <MessageSquare className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[15px] font-semibold text-foreground">{platform.platform}</span>
            <span className="text-sm text-muted-foreground">{platform.handle}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {platform.followerEstimate} followers · {platform.postingFrequency}
          </div>
        </div>
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border px-6 py-5 space-y-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sample Posts</span>
          {platform.samplePosts.map((post, i) => (
            <div key={i} className="bg-muted/30 rounded-lg px-5 py-4">
              <p className="text-sm text-foreground leading-relaxed">{post.text}</p>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="outline" className="text-xs font-normal">{post.type}</Badge>
                <span className="text-xs text-muted-foreground">{post.engagement}</span>
                {post.url && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                  >
                    View Post <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VoiceProfileCard({ voice }: { voice: VoiceProfile }) {
  return (
    <div className="border border-border rounded-xl bg-card p-6 space-y-5">
      <h4 className="text-[15px] font-semibold text-foreground">Voice Profile</h4>

      <div className="grid grid-cols-1 gap-3">
        <InfoItem label="Tone" value={voice.tone} />
        <InfoItem label="Personality" value={voice.personality} />
        <InfoItem label="Emoji Usage" value={voice.emojiStyle} />
        <InfoItem label="Hashtag Style" value={voice.hashtagStyle} />
        <InfoItem label="Engagement" value={voice.engagementStyle} />
      </div>

      <div className="pt-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Writing Patterns</span>
        <div className="flex flex-wrap gap-2 mt-3">
          {voice.writingPatterns.map((p) => <Badge key={p} variant="secondary" className="text-xs font-normal px-3 py-1">{p}</Badge>)}
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unique Traits</span>
        <div className="flex flex-wrap gap-2 mt-3">
          {voice.uniqueTraits.map((t) => <Badge key={t} variant="outline" className="text-xs font-normal text-primary border-primary/30 px-3 py-1">{t}</Badge>)}
        </div>
      </div>

      <div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Content Themes</span>
        <div className="flex flex-wrap gap-2 mt-3">
          {voice.contentThemes.map((t) => <Badge key={t} variant="secondary" className="text-xs font-normal px-3 py-1">{t}</Badge>)}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider w-24 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-foreground leading-relaxed">{value}</span>
    </div>
  );
}

function AudienceCard({ audience }: { audience: AudienceProfile }) {
  return (
    <div className="border border-border rounded-xl bg-card p-6 space-y-5">
      <div className="flex items-center gap-2.5">
        <Users className="h-4 w-4 text-primary" />
        <h4 className="text-[15px] font-semibold text-foreground">Audience</h4>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <InfoItem label="Demographics" value={audience.demographics} />
        <InfoItem label="Engagement" value={audience.engagementPatterns} />
      </div>

      <div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interests</span>
        <div className="flex flex-wrap gap-2 mt-3">
          {audience.interests.map((i) => <Badge key={i} variant="secondary" className="text-xs font-normal px-3 py-1">{i}</Badge>)}
        </div>
      </div>
    </div>
  );
}

interface SocialAnalysisDisplayProps {
  analysis: SocialAnalysisResult;
  brandName: string;
  onProceed: () => void;
  isGenerating: boolean;
}

export function SocialAnalysisDisplay({ analysis, brandName, onProceed, isGenerating }: SocialAnalysisDisplayProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-8 pb-8 scrollbar-hide fade-in">
        {/* Summary */}
        <div className="border border-border rounded-xl bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">Social Media Analysis — {brandName}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{analysis.overallSummary}</p>
        </div>

        {/* Two-column: Platforms left, Voice/Audience right */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Platforms — 3 cols */}
          <div className="xl:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platforms Analyzed</h4>
            {analysis.platforms.map((p) => (
              <PlatformCard key={p.platform} platform={p} />
            ))}
          </div>

          {/* Voice + Audience — 2 cols */}
          <div className="xl:col-span-2 space-y-6">
            <VoiceProfileCard voice={analysis.voiceProfile} />
            <AudienceCard audience={analysis.audienceProfile} />
          </div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="flex-shrink-0 pt-5 pb-2">
        <div className="max-w-md mx-auto">
          <Button onClick={onProceed} disabled={isGenerating} className="w-full h-11 text-sm font-medium gap-2">
            {isGenerating ? "Generating Tweets..." : "Generate 10 Tweets Based on This Analysis"}
            {!isGenerating && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
