import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft, Twitter, MessageCircle, Megaphone, Lightbulb, Smile } from "lucide-react";
import { useState } from "react";
import type { GenerateResult } from "@/lib/api";

const styleConfig: Record<string, { label: string; icon: typeof MessageCircle; color: string }> = {
  conversational: { label: "Conversational", icon: MessageCircle, color: "text-blue-600" },
  promotional: { label: "Promotional", icon: Megaphone, color: "text-amber-600" },
  witty: { label: "Witty", icon: Smile, color: "text-pink-600" },
  informative: { label: "Informative", icon: Lightbulb, color: "text-emerald-600" },
};

function TweetCard({ text, style, index }: { text: string; style: string; index: number }) {
  const [copied, setCopied] = useState(false);
  const config = styleConfig[style] || styleConfig.conversational;
  const Icon = config.icon;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="p-5 border border-border rounded-lg bg-card group hover:border-primary/20 hover:shadow-sm transition-all fade-in"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Icon className={`h-3.5 w-3.5 ${config.color}`} />
          <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground tabular-nums">{text.length}/280</span>
          <button onClick={handleCopy} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted" title="Copy">
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        </div>
      </div>
      <p className="text-[15px] text-foreground leading-relaxed">{text}</p>
    </div>
  );
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { result: GenerateResult; brandName: string } | null;

  if (!state) {
    navigate("/");
    return null;
  }

  const { result, brandName } = state;
  const { voiceSummary, tweets } = result;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="w-full max-w-[1440px] mx-auto px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                <Twitter className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Results for <span className="text-primary">{brandName}</span></span>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate("/")}>Generate New</Button>
        </div>
      </header>

      {/* Content — fixed two-column desktop layout */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto px-12 py-10">
        <div className="grid grid-cols-12 gap-10">

          {/* Left — Brand Voice (4 cols) */}
          <aside className="col-span-4">
            <div className="sticky top-10 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">Brand Voice</h2>

              <div className="bg-card border border-border rounded-xl p-6 space-y-5">
                <InfoRow label="Tone" value={voiceSummary.tone} />
                <InfoRow label="Style" value={voiceSummary.communicationStyle} />
                <InfoRow label="Target Audience" value={voiceSummary.targetAudience} />
                <InfoRow label="Emoji Usage" value={voiceSummary.emojiStyle} />

                <div className="pt-4 border-t border-border">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Themes</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {voiceSummary.contentThemes.map((theme) => (
                      <Badge key={theme} variant="secondary" className="text-xs font-normal">{theme}</Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Keywords</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {voiceSummary.keywords.map((kw) => (
                      <Badge key={kw} variant="outline" className="text-xs font-normal text-primary border-primary/30">{kw}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right — Tweets (8 cols) */}
          <section className="col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Generated Tweets</h2>
              <span className="text-sm text-muted-foreground">{tweets.length} tweets</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {tweets.map((tweet, i) => (
                <TweetCard key={i} text={tweet.text} style={tweet.style} index={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <p className="text-sm text-foreground mt-1 leading-relaxed">{value}</p>
    </div>
  );
}

export default Results;
