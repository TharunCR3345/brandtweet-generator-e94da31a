import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import type { GenerateResult } from "@/lib/api";

const styleBadge: Record<string, string> = {
  conversational: "Conversational",
  promotional: "Promotional",
  witty: "Witty",
  informative: "Informative",
};

function TweetCard({ text, style, index }: { text: string; style: string; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 border border-border rounded-lg bg-card group fade-in" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}>
      <div className="flex items-center justify-between mb-2">
        <Badge variant="secondary" className="text-xs font-normal">{styleBadge[style] || style}</Badge>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{text.length}/280</span>
          <button onClick={handleCopy} className="opacity-0 group-hover:opacity-100 transition-opacity" title="Copy">
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{text}</p>
    </div>
  );
}

export function ResultsDisplay({ result, brandName }: { result: GenerateResult; brandName: string }) {
  const { voiceSummary, tweets } = result;

  return (
    <div className="space-y-6 fade-in">
      {/* Voice Summary */}
      <div className="border border-border rounded-lg bg-card p-5">
        <h3 className="font-semibold text-foreground mb-4">Brand Voice — {brandName}</h3>
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div><span className="text-muted-foreground">Tone:</span> <span className="text-foreground">{voiceSummary.tone}</span></div>
          <div><span className="text-muted-foreground">Style:</span> <span className="text-foreground">{voiceSummary.communicationStyle}</span></div>
          <div><span className="text-muted-foreground">Audience:</span> <span className="text-foreground">{voiceSummary.targetAudience}</span></div>
          <div><span className="text-muted-foreground">Emoji:</span> <span className="text-foreground">{voiceSummary.emojiStyle}</span></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {voiceSummary.contentThemes.map((t) => <Badge key={t} variant="secondary" className="text-xs font-normal">{t}</Badge>)}
          {voiceSummary.keywords.map((k) => <Badge key={k} variant="outline" className="text-xs font-normal text-primary">{k}</Badge>)}
        </div>
      </div>

      {/* Tweets */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">Generated Tweets ({tweets.length})</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {tweets.map((tweet, i) => (
            <TweetCard key={i} text={tweet.text} style={tweet.style} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
