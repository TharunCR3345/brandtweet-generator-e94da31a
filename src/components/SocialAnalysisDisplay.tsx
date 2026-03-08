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
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-accent/5 transition-colors text-left"
      >
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {platformIcon[platform.platform] || <MessageSquare className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{platform.platform}</span>
            <span className="text-xs text-muted-foreground">{platform.handle}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {platform.followerEstimate} followers · {platform.postingFrequency}
          </div>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-4 space-y-2.5">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sample Posts</span>
          {platform.samplePosts.map((post, i) => (
            <div key={i} className="bg-muted/40 rounded-md px-4 py-3">
              <p className="text-sm text-foreground leading-relaxed">{post.text}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-[11px] font-normal">{post.type}</Badge>
                <span className="text-[11px] text-muted-foreground">{post.engagement}</span>
                {post.url && (
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    View Post <ExternalLink className="h-3 w-3" />
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
    <div className="border border-border rounded-lg bg-card p-5 space-y-4">
      <span className="text-sm font-semibold text-foreground">Voice Profile</span>

      <ul className="space-y-2 text-sm text-foreground list-disc list-inside marker:text-muted-foreground">
        <li><span className="text-muted-foreground">Tone:</span> {voice.tone}</li>
        <li><span className="text-muted-foreground">Personality:</span> {voice.personality}</li>
        <li><span className="text-muted-foreground">Emoji:</span> {voice.emojiStyle}</li>
        <li><span className="text-muted-foreground">Hashtags:</span> {voice.hashtagStyle}</li>
        <li><span className="text-muted-foreground">Engagement:</span> {voice.engagementStyle}</li>
      </ul>

      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Writing Patterns</span>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {voice.writingPatterns.map((p) => <Badge key={p} variant="secondary" className="text-xs font-normal">{p}</Badge>)}
        </div>
      </div>

      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Unique Traits</span>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {voice.uniqueTraits.map((t) => <Badge key={t} variant="outline" className="text-xs font-normal text-primary border-primary/30">{t}</Badge>)}
        </div>
      </div>

      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Content Themes</span>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {voice.contentThemes.map((t) => <Badge key={t} variant="secondary" className="text-xs font-normal">{t}</Badge>)}
        </div>
      </div>
    </div>
  );
}

function AudienceCard({ audience }: { audience: AudienceProfile }) {
  return (
    <div className="border border-border rounded-lg bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Audience</span>
      </div>
      <ul className="space-y-2 text-sm text-foreground list-disc list-inside marker:text-muted-foreground">
        <li><span className="text-muted-foreground">Demographics:</span> {audience.demographics}</li>
        <li><span className="text-muted-foreground">Engagement:</span> {audience.engagementPatterns}</li>
      </ul>
      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Interests</span>
        <div className="flex flex-wrap gap-1.5 mt-2">
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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-6 pb-6 scrollbar-hide fade-in">
        {/* Summary */}
        <div className="border border-border rounded-lg bg-card p-5">
          <h3 className="text-base font-semibold text-foreground mb-2">Social Media Analysis — {brandName}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{analysis.overallSummary}</p>
        </div>

        {/* Two-column: Platforms + Voice/Audience */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Platforms Analyzed</h4>
            {analysis.platforms.map((p) => (
              <PlatformCard key={p.platform} platform={p} />
            ))}
          </div>
          <div className="space-y-4">
            <VoiceProfileCard voice={analysis.voiceProfile} />
            <AudienceCard audience={analysis.audienceProfile} />
          </div>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div className="flex-shrink-0 border-t border-border bg-background pt-3 pb-1">
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
