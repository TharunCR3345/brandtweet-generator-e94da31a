import { Twitter, ArrowLeft, Search, Brain, Sparkles, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Enter Brand Details",
    description: "Provide your brand name and optional details like industry, objective, and product description. Use our AI autofill to speed things up.",
    details: [
      "Brand name is the only required field",
      "AI autofill fetches industry & product info automatically",
      "Customize objective: awareness, promotion, engagement, or launch",
    ],
  },
  {
    number: "02",
    icon: Search,
    title: "Social Media Analysis",
    description: "Our AI scans your brand's presence across Twitter/X, Instagram, and LinkedIn to understand your real voice and audience.",
    details: [
      "Analyzes posting patterns and engagement metrics",
      "Identifies tone, personality, and writing style",
      "Maps audience demographics and interests",
    ],
  },
  {
    number: "03",
    icon: Brain,
    title: "Review Voice Profile",
    description: "Review the AI-generated analysis of your brand voice, audience profile, and platform insights before generating tweets.",
    details: [
      "Voice profile with tone, emoji & hashtag usage",
      "Platform-by-platform breakdown with sample posts",
      "Audience demographics and engagement patterns",
    ],
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Generate On-Brand Tweets",
    description: "Get 10 ready-to-post tweets across 4 styles — conversational, promotional, witty, and informative — all matching your brand voice.",
    details: [
      "10 unique tweets per generation",
      "4 distinct tweet styles for variety",
      "One-click copy for instant posting",
    ],
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1.5 -ml-2 px-3 mr-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Twitter className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground tracking-tight">How It Works</span>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 pt-14 pb-16">
        {/* Hero */}
        <section className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            4-Step Process
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight max-w-2xl mx-auto">
            From brand name to<br />viral tweets in minutes
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-4 max-w-lg mx-auto leading-relaxed">
            Our AI-powered workflow analyzes your real social media presence and generates tweets that sound authentically you.
          </p>
        </section>

        {/* Steps */}
        <section className="w-full max-w-5xl mx-auto px-6 sm:px-10 pb-16">
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[2.25rem] top-full w-px h-6 bg-border hidden sm:block" />
                )}

                <div className="flex gap-6 items-start p-6 sm:p-8 rounded-xl border border-border bg-card">
                  {/* Step number + icon */}
                  <div className="flex-shrink-0 hidden sm:flex flex-col items-center gap-2">
                    <div className="h-[4.5rem] w-[4.5rem] rounded-2xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Step {step.number}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 sm:hidden">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Step {step.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Arrow indicator for desktop */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex items-center self-center">
                      <ArrowRight className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="w-full max-w-7xl mx-auto px-6 sm:px-10 pb-16 text-center">
          <div className="rounded-xl border border-border bg-card p-10 sm:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Ready to generate your tweets?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Enter your brand name and let our AI do the rest. It only takes a few minutes.</p>
            <Button size="lg" onClick={() => navigate("/")} className="gap-2 h-12 px-8 text-base">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card py-2.5">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 text-center">
          <p className="text-sm text-muted-foreground">Developed by <span className="font-semibold text-foreground">Tharun C R</span></p>
        </div>
      </footer>
    </div>
  );
}
