import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, MessageCircle, Megaphone, Lightbulb, Smile } from "lucide-react";
import { useState } from "react";
import type { GenerateResult } from "@/lib/api";

const styleConfig = {
  conversational: { label: "Conversational", icon: MessageCircle, className: "bg-accent text-accent-foreground" },
  promotional: { label: "Promotional", icon: Megaphone, className: "bg-primary/15 text-primary" },
  witty: { label: "Witty", icon: Smile, className: "bg-amber-100 text-amber-800" },
  informative: { label: "Informative", icon: Lightbulb, className: "bg-emerald-100 text-emerald-800" },
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
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant="outline" className={config.className}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{text.length}/280</span>
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <p className="text-foreground leading-relaxed">{text}</p>
      </CardContent>
    </Card>
  );
}

export function ResultsDisplay({ result }: { result: GenerateResult }) {
  const { voiceSummary, tweets } = result;

  return (
    <div className="space-y-8">
      {/* Voice Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">🎯 Brand Voice Summary</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Tone</span>
              <p className="text-foreground font-medium">{voiceSummary.tone}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Communication Style</span>
              <p className="text-foreground font-medium">{voiceSummary.communicationStyle}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Target Audience</span>
              <p className="text-foreground font-medium">{voiceSummary.targetAudience}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Emoji Style</span>
              <p className="text-foreground font-medium">{voiceSummary.emojiStyle}</p>
            </div>
          </div>

          <div className="mt-4">
            <span className="text-sm font-medium text-muted-foreground">Content Themes</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {voiceSummary.contentThemes.map((theme) => (
                <Badge key={theme} variant="secondary">{theme}</Badge>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <span className="text-sm font-medium text-muted-foreground">Keywords</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {voiceSummary.keywords.map((kw) => (
                <Badge key={kw} variant="outline" className="text-primary border-primary/30">{kw}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tweets */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">📝 Generated Tweets</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {tweets.map((tweet, i) => (
            <TweetCard key={i} text={tweet.text} style={tweet.style} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
