import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft, Twitter, Heart, Repeat2, Share, BarChart2, MessageCircle } from "lucide-react";
import { useState, useMemo } from "react";
import type { GenerateResult } from "@/lib/api";

const styleLabels: Record<string, string> = {
  conversational: "💬 Conversational",
  promotional: "📢 Promotional",
  witty: "😏 Witty",
  informative: "💡 Informative",
};

function useTweetMeta() {
  return useMemo(() => {
    const hours = Math.floor(Math.random() * 12) + 1;
    const mins = Math.floor(Math.random() * 60);
    const ampm = Math.random() > 0.5 ? "AM" : "PM";
    return {
      time: `${hours}:${mins.toString().padStart(2, "0")} ${ampm}`,
      replies: Math.floor(Math.random() * 50) + 1,
      retweets: Math.floor(Math.random() * 200) + 5,
      likes: Math.floor(Math.random() * 800) + 10,
      views: `${(Math.random() * 50 + 1).toFixed(1)}K`,
    };
  }, []);
}

function TweetCard({ text, style, index, brandName }: { text: string; style: string; index: number; brandName: string }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const meta = useTweetMeta();
  const initials = brandName.slice(0, 2).toUpperCase();
  const handle = `@${brandName.toLowerCase().replace(/\s+/g, "")}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className="bg-card border border-border rounded-xl px-5 py-4 hover:bg-accent/5 transition-colors fade-in"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-xs font-bold text-primary-foreground">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[15px] font-bold text-foreground leading-5">{brandName}</span>
            <svg className="h-[18px] w-[18px] text-primary flex-shrink-0" viewBox="0 0 22 22" fill="currentColor">
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.141.27.587.7 1.086 1.24 1.44.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.222 1.26.271 1.893.14.634-.131 1.22-.437 1.69-.882.445-.47.749-1.055.878-1.691.13-.634.08-1.29-.144-1.896.587-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
            </svg>
            <span className="text-[15px] text-muted-foreground leading-5">{handle}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-[13px] text-muted-foreground">{meta.time}</span>
          </div>

          {/* Tweet body */}
          <p className="text-[15px] text-foreground leading-[1.45] mt-1.5 whitespace-pre-wrap">{text}</p>

          {/* Style tag */}
          <span className="inline-block mt-2 text-xs text-muted-foreground">{styleLabels[style] || style}</span>

          {/* Actions bar */}
          <div className="flex items-center mt-3 -ml-1.5" style={{ gap: "2px" }}>
            <ActionBtn icon={<MessageCircle className="h-[18px] w-[18px]" />} count={meta.replies} hoverColor="group-hover:text-primary group-hover:bg-primary/10" />
            <ActionBtn icon={<Repeat2 className="h-[18px] w-[18px]" />} count={meta.retweets} hoverColor="group-hover:text-emerald-500 group-hover:bg-emerald-500/10" />
            <ActionBtn
              icon={<Heart className={`h-[18px] w-[18px] ${liked ? "fill-current" : ""}`} />}
              count={liked ? meta.likes + 1 : meta.likes}
              active={liked}
              activeColor="text-pink-500"
              hoverColor="group-hover:text-pink-500 group-hover:bg-pink-500/10"
              onClick={() => setLiked(!liked)}
            />
            <ActionBtn icon={<BarChart2 className="h-[18px] w-[18px]" />} label={meta.views} hoverColor="group-hover:text-primary group-hover:bg-primary/10" />
            <button
              onClick={handleCopy}
              className="group flex items-center text-muted-foreground ml-auto"
              title="Copy tweet text"
            >
              <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                {copied ? <Check className="h-[18px] w-[18px] text-primary" /> : <Share className="h-[18px] w-[18px] group-hover:text-primary transition-colors" />}
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ActionBtn({
  icon,
  count,
  label,
  active,
  activeColor,
  hoverColor,
  onClick,
}: {
  icon: React.ReactNode;
  count?: number;
  label?: string;
  active?: boolean;
  activeColor?: string;
  hoverColor: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-0.5 transition-colors ${active ? activeColor : "text-muted-foreground"}`}
    >
      <div className={`p-2 rounded-full transition-colors ${hoverColor}`}>
        {icon}
      </div>
      <span className="text-[13px] tabular-nums min-w-[28px] text-left">{label ?? count}</span>
    </button>
  );
}

/* ────────────────────────── Results Page ────────────────────────── */

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
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="z-30 border-b border-border bg-card flex-shrink-0">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                <Twitter className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Results for <span className="text-primary">{brandName}</span>
              </span>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate("/")}>
            Generate New
          </Button>
        </div>
      </header>

      {/* Two-column layout — each column scrolls independently */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto px-6 sm:px-10 flex gap-8 overflow-hidden">
        {/* Left sidebar — Brand Voice */}
        <aside className="w-[360px] flex-shrink-0 hidden lg:flex flex-col pt-8 overflow-hidden">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-5 flex-shrink-0">Brand Voice</h2>
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-5 pb-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="bg-card border border-border rounded-xl divide-y divide-border">
              <InfoRow label="Tone" value={voiceSummary.tone} />
              <InfoRow label="Style" value={voiceSummary.communicationStyle} />
              <InfoRow label="Audience" value={voiceSummary.targetAudience} />
              <InfoRow label="Emoji" value={voiceSummary.emojiStyle} />
            </div>

            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Themes</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {voiceSummary.contentThemes.map((theme) => (
                    <Badge key={theme} variant="secondary" className="text-xs font-normal">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Keywords</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {voiceSummary.keywords.map((kw) => (
                    <Badge key={kw} variant="outline" className="text-xs font-normal text-primary border-primary/30">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right — Tweet feed */}
        <section className="flex-1 min-w-0 max-w-3xl flex flex-col pt-8 overflow-hidden">
          <div className="flex items-center justify-between mb-5 flex-shrink-0">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Generated Tweets</h2>
            <span className="text-xs text-muted-foreground tabular-nums">{tweets.length} tweets</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pb-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {tweets.map((tweet, i) => (
              <TweetCard key={i} text={tweet.text} style={tweet.style} index={i} brandName={brandName} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-4">
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
      <p className="text-sm text-foreground mt-1 leading-relaxed">{value}</p>
    </div>
  );
}

export default Results;
