import { Badge } from "@/components/ui/badge";
import { Copy, Check, MessageCircle, Megaphone, Lightbulb, Smile } from "lucide-react";
import { useState } from "react";
import type { GenerateResult } from "@/lib/api";

const styleConfig = {
  conversational: { label: "Conversational", icon: MessageCircle, color: "text-blue-400" },
  promotional: { label: "Promotional", icon: Megaphone, color: "text-amber-400" },
  witty: { label: "Witty", icon: Smile, color: "text-pink-400" },
  informative: { label: "Informative", icon: Lightbulb, color: "text-emerald-400" },
};

function TweetCard({ text, style, index }: { text: string; style: string; index: number }) {
  const [copied, setCopied] = useState(false);
  const config = styleConfig[style as keyof typeof styleConfig] || styleConfig.conversational;
  const Icon = config.icon;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group p-4 rounded-lg border border-border bg-card card-hover fade-in"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-3.5 w-3.5 ${config.color}`} />
          <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="mono text-[10px] text-tertiary">{text.length}<span className="text-muted-foreground/30">/280</span></span>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-secondary"
            title="Copy tweet"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        </div>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed">{text}</p>
    </div>
  );
}

function VoiceCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] mono uppercase tracking-widest text-tertiary">{label}</span>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

export function ResultsDisplay({ result, brandName }: { result: GenerateResult; brandName: string }) {
  const { voiceSummary, tweets } = result;

  return (
    <div className="space-y-6 fade-in">
      {/* Voice Summary */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center gap-2">
          <div className="h-2 w-2 rounded-full brand-gradient-bg" />
          <h3 className="text-sm font-semibold text-foreground">Brand Voice — <span className="brand-gradient-text">{brandName}</span></h3>
        </div>

        <div className="p-5 grid gap-4 sm:grid-cols-2">
          <VoiceCard label="Tone" value={voiceSummary.tone} />
          <VoiceCard label="Style" value={voiceSummary.communicationStyle} />
          <VoiceCard label="Target Audience" value={voiceSummary.targetAudience} />
          <VoiceCard label="Emoji Usage" value={voiceSummary.emojiStyle} />
        </div>

        <div className="px-5 pb-5 space-y-3">
          <div>
            <span className="text-[10px] mono uppercase tracking-widest text-tertiary">Themes</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {voiceSummary.contentThemes.map((theme) => (
                <Badge key={theme} variant="secondary" className="text-xs font-normal bg-secondary text-secondary-foreground border-0">{theme}</Badge>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] mono uppercase tracking-widest text-tertiary">Keywords</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {voiceSummary.keywords.map((kw) => (
                <span key={kw} className="mono text-xs text-primary/80 bg-primary/10 px-2 py-0.5 rounded">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tweets */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-foreground">Generated Tweets</h3>
          <span className="mono text-xs text-tertiary">{tweets.length} tweets</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {tweets.map((tweet, i) => (
            <TweetCard key={i} text={tweet.text} style={tweet.style} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
