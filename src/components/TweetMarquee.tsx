const SAMPLE_TWEETS = [
  // Row 1
  [
    { name: "Sarah Chen", handle: "@sarahchen", text: "Just launched our new product line and the response has been incredible 🚀" },
    { name: "Mike Rodriguez", handle: "@mikerod", text: "Brand consistency is the secret weapon most startups ignore. Build trust first." },
    { name: "Emma Wilson", handle: "@emmawilson", text: "Our Q4 campaign reached 2M impressions organically. Here's what we learned →" },
    { name: "Alex Turner", handle: "@alexturner", text: "Hot take: your brand voice matters more than your logo. Fight me." },
    { name: "Priya Patel", handle: "@priyap", text: "The best marketing doesn't feel like marketing. It feels like a conversation." },
    { name: "Jordan Lee", handle: "@jordanlee", text: "We A/B tested 47 tweet formats. The winner? Authenticity. Every single time." },
  ],
  // Row 2
  [
    { name: "Chris Evans", handle: "@chrisevans", text: "Threads are the new blog posts. Change my mind." },
    { name: "Nina Kovac", handle: "@ninakovac", text: "Your audience doesn't want perfection. They want personality." },
    { name: "David Kim", handle: "@davidkim", text: "Just hit 100K followers by posting what we actually believe in. No hacks needed." },
    { name: "Olivia Grant", handle: "@oliviagrant", text: "Social media tip: stop selling, start storytelling 📖" },
    { name: "Tom Baker", handle: "@tombaker", text: "The algorithm rewards consistency and genuine engagement. That's the whole playbook." },
    { name: "Aisha Moyo", handle: "@aishamoyo", text: "Our brand voice guide is 2 pages long. Short enough to memorize, clear enough to follow." },
  ],
  // Row 3
  [
    { name: "Ryan Foster", handle: "@ryanfoster", text: "Generated 50 tweets in 10 minutes with AI. Edited 5 of them. Published all 5. Results? 📈" },
    { name: "Lena Schmidt", handle: "@lenaschmidt", text: "Brands that reply to comments build communities. Brands that don't build walls." },
    { name: "Marcus Chen", handle: "@marcuschen", text: "Our social engagement went up 340% after we started showing behind-the-scenes content." },
    { name: "Sofia Reyes", handle: "@sofiareyes", text: "The best time to tweet is when your audience is listening. Test, measure, repeat." },
    { name: "James Park", handle: "@jamespark", text: "Took us 6 months to find our brand voice. Now every tweet writes itself." },
    { name: "Zara Ahmed", handle: "@zaraahmed", text: "AI + human creativity = content that scales without losing soul ✨" },
  ],
];

function TweetCard({ name, handle, text }: { name: string; handle: string; text: string }) {
  const initials = name.split(" ").map(n => n[0]).join("");

  return (
    <div className="flex-shrink-0 w-[340px] bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-primary">{initials}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground truncate">{name}</span>
            <span className="text-xs text-muted-foreground">{handle}</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed mt-1.5">{text}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ tweets, direction, speed }: { tweets: typeof SAMPLE_TWEETS[0]; direction: "left" | "right"; speed: number }) {
  // Duplicate tweets for seamless loop
  const doubled = [...tweets, ...tweets];

  return (
    <div className="relative overflow-hidden py-2">
      <div
        className="flex gap-5"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          width: "max-content",
        }}
      >
        {doubled.map((tweet, i) => (
          <TweetCard key={`${tweet.handle}-${i}`} {...tweet} />
        ))}
      </div>
    </div>
  );
}

export function TweetMarquee() {
  return (
    <section className="relative w-full overflow-hidden py-12">
      {/* Gradient overlays for fade effect */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent" />
      </div>

      {/* Soft glow behind */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative space-y-4">
        <MarqueeRow tweets={SAMPLE_TWEETS[0]} direction="left" speed={45} />
        <MarqueeRow tweets={SAMPLE_TWEETS[1]} direction="right" speed={50} />
        <MarqueeRow tweets={SAMPLE_TWEETS[2]} direction="left" speed={42} />
      </div>
    </section>
  );
}
