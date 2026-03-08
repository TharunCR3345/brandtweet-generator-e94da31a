import { useState } from "react";
import type { SocialAnalysisResult, SocialPlatform, VoiceProfile, AudienceProfile } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Twitter, Instagram, Linkedin, ChevronRight, MessageSquare, Users, Sparkles, Eye } from "lucide-react";

const platformIcon: Record<string, React.ReactNode> = {
  "Twitter/X": <Twitter className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  LinkedIn: <Linkedin className="h-4 w-4" />,
};

function PlatformCard({ platform }: { platform: SocialPlatform }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/5 transition-colors text-left"
      >
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          {platformIcon[platform.platform] || <MessageSquare className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{platform.platform}</span>
            <span className="text-xs text-muted-foreground">{platform.handle}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span>{platform.followerEstimate} followers</span>
            <span>·</span>
            <span>{platform.postingFrequency}</span>
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-border px-4 py-3 space-y-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sample Posts</span>
          {platform.samplePosts.map((post, i) => (
            <div key={i} className="bg-muted/50 rounded-md px-3 py-2">
              <p className="text-sm text-foreground leading-relaxed">{post.text}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="outline" className="text-[10px] font-normal">{post.type}</Badge>
                <span className="text-[10px] text-muted-foreground">{post.engagement}</span>
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
    <div className="border border-border rounded-lg bg-card p-4 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Voice Profile</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        <div><span className="text-muted-foreground">Tone:</span> <span className="text-foreground">{voice.tone}</span></div>
        <div><span className="text-muted-foreground">Personality:</span> <span className="text-foreground">{voice.personality}</span></div>
        <div><span className="text-muted-foreground">Emoji:</span> <span className="text-foreground">{voice.emojiStyle}</span></div>
        <div><span className="text-muted-foreground">Hashtags:</span> <span className="text-foreground">{voice.hashtagStyle}</span></div>
      </div>

      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Writing Patterns</span>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {voice.writingPatterns.map((p) => <Badge key={p} variant="secondary" className="text-xs font-normal">{p}</Badge>)}
        </div>
      </div>

      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Unique Traits</span>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {voice.uniqueTraits.map((t) => <Badge key={t} variant="outline" className="text-xs font-normal text-primary border-primary/30">{t}</Badge>)}
        </div>
      </div>

      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Content Themes</span>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {voice.contentThemes.map((t) => <Badge key={t} variant="secondary" className="text-xs font-normal">{t}</Badge>)}
        </div>
      </div>
    </div>
  );
}

function AudienceCard({ audience }: { audience: AudienceProfile }) {
  return (
    <div className="border border-border rounded-lg bg-card p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Users className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Audience Profile</span>
      </div>
      <div className="text-sm">
        <span className="text-muted-foreground">Demographics:</span>{" "}
        <span className="text-foreground">{audience.demographics}</span>
      </div>
      <div className="text-sm">
        <span className="text-muted-foreground">Engagement:</span>{" "}
        <span className="text-foreground">{audience.engagementPatterns}</span>
      </div>
      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Interests</span>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {audience.interests.map((i) => <Badge key={i} variant="secondary" className="text-xs font-normal">{i}</Badge>)}
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
    <div className="space-y-5 fade-in">
      {/* Summary */}
      <div className="border border-primary/20 rounded-lg bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Eye className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Social Media Analysis — {brandName}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{analysis.overallSummary}</p>
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Platforms Analyzed</h4>
        {analysis.platforms.map((p) => (
          <PlatformCard key={p.platform} platform={p} />
        ))}
      </div>

      {/* Voice + Audience side by side */}
      <div className="grid gap-4 lg:grid-cols-2">
        <VoiceProfileCard voice={analysis.voiceProfile} />
        <AudienceCard audience={analysis.audienceProfile} />
      </div>

      {/* Proceed button */}
      <Button onClick={onProceed} disabled={isGenerating} className="w-full h-11 text-sm font-medium gap-2">
        {isGenerating ? "Generating Tweets..." : "Generate 10 Tweets Based on This Analysis"}
        {!isGenerating && <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  );
}
