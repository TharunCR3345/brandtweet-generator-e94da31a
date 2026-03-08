import { Twitter, ArrowLeft, Search, Brain, Sparkles, FileText, ArrowRight, CheckCircle2, Code2, Database, Cloud, Cpu, Layers, Globe } from "lucide-react";
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

const techStack = [
  {
    icon: Code2,
    name: "React 18 + TypeScript",
    category: "Frontend Framework",
    description: "React is a declarative, component-based JavaScript library developed by Meta for building user interfaces. It uses a virtual DOM to efficiently update only the parts of the page that change, resulting in high performance. Combined with TypeScript — a statically typed superset of JavaScript — the codebase gains compile-time error detection, better IDE autocompletion, and self-documenting interfaces.",
    theory: "React's component model allows the app to be broken into reusable, isolated pieces (BrandForm, SocialAnalysisDisplay, ResultsDisplay). State management is handled via React hooks (useState, useEffect), and React Router enables client-side navigation between pages without full page reloads. TypeScript enforces strict typing on API responses, props, and state — preventing runtime errors before they happen.",
  },
  {
    icon: Layers,
    name: "Tailwind CSS",
    category: "Styling Framework",
    description: "Tailwind CSS is a utility-first CSS framework that provides low-level utility classes (like flex, pt-4, text-center) directly in your HTML/JSX. Unlike traditional CSS frameworks that give you pre-designed components, Tailwind gives you building blocks to create any design without writing custom CSS.",
    theory: "This project uses Tailwind with a semantic design token system defined in index.css — variables like --primary, --background, --muted-foreground ensure consistent theming. The tailwind.config.ts maps these tokens to Tailwind classes. This approach enables rapid prototyping while maintaining design consistency, responsive layouts via breakpoints (sm:, lg:, xl:), and dark mode support through CSS custom properties.",
  },
  {
    icon: Cloud,
    name: "Supabase Edge Functions",
    category: "Serverless Backend",
    description: "Edge Functions are server-side TypeScript functions powered by Deno that run on globally distributed edge nodes. They execute close to the user's location, minimizing latency. In this app, they serve as the secure backend layer between the frontend and the AI API.",
    theory: "Each AI operation (brand autofill, social analysis, tweet generation) is an isolated Edge Function. This serverless architecture means no server management, automatic scaling, and pay-per-execution pricing. The functions securely store API keys (LOVABLE_API_KEY) as environment variables — never exposed to the client. They also handle error cases like rate limiting (429) and payment issues (402), returning structured JSON responses.",
  },
  {
    icon: Cpu,
    name: "Google Gemini AI",
    category: "AI / LLM Engine",
    description: "Google Gemini is a family of multimodal large language models (LLMs) developed by Google DeepMind. This app uses Gemini 2.5 Flash Lite — the fastest and most cost-efficient variant — optimized for classification, summarization, and structured output generation.",
    theory: "The AI is accessed via the Lovable AI Gateway (OpenAI-compatible API). Prompts are carefully engineered to return JSON-only responses with no markdown formatting, reducing parsing complexity. Temperature is set to 0.3 for consistent, deterministic outputs. The social analysis prompt instructs the model to scan real brand data across platforms and return structured voice profiles, while the tweet generation prompt uses the analysis as context to produce authentic, on-brand content across 4 distinct styles.",
  },
  {
    icon: Database,
    name: "Supabase Platform",
    category: "Backend-as-a-Service",
    description: "Supabase is an open-source Firebase alternative that provides a full backend stack: PostgreSQL database, authentication, real-time subscriptions, file storage, and edge functions. It offers the power of a relational database with the convenience of a managed service.",
    theory: "In this project, Supabase provides the infrastructure layer — hosting edge functions, managing secrets, and providing the client SDK (@supabase/supabase-js) for seamless frontend-backend communication. The supabase.functions.invoke() method handles authenticated requests to edge functions with automatic error handling. The platform auto-scales based on traffic and provides built-in Row Level Security (RLS) for data protection.",
  },
  {
    icon: Globe,
    name: "Vite",
    category: "Build Toolchain",
    description: "Vite (French for 'fast') is a next-generation frontend build tool created by Evan You (creator of Vue.js). It leverages native ES modules in the browser during development for instant server start, and uses Rollup for optimized production bundles.",
    theory: "Vite's Hot Module Replacement (HMR) updates the browser in milliseconds when code changes — dramatically faster than traditional bundlers like Webpack. It supports TypeScript, JSX, and CSS out of the box. Environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY) are injected at build time via import.meta.env, ensuring secure configuration. The production build performs tree-shaking, code-splitting, and minification for optimal load performance.",
  },
];

const flowSteps = [
  { label: "User Input", sub: "Brand name + details" },
  { label: "AI Autofill", sub: "Gemini Flash Lite" },
  { label: "Social Scan", sub: "Twitter, IG, LinkedIn" },
  { label: "Voice Profile", sub: "Tone & style analysis" },
  { label: "Tweet Gen", sub: "10 tweets, 4 styles" },
  { label: "Results", sub: "Copy & post" },
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

        {/* Workflow Diagram */}
        <section className="w-full max-w-5xl mx-auto px-6 sm:px-10 pb-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Workflow Diagram</h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">Visual overview of the complete data flow</p>

          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[700px] gap-2">
              {flowSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className="flex flex-col items-center text-center min-w-[100px]">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-sm font-bold mb-2 ${i === 0 || i === flowSteps.length - 1 ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                      {i + 1}
                    </div>
                    <span className="text-sm font-semibold text-foreground">{step.label}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{step.sub}</span>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div className="flex items-center px-1">
                      <div className="w-8 h-px bg-border" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50 -ml-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Architecture layers */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg bg-primary/5 border border-primary/10 py-3 px-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Frontend</p>
                  <p className="text-xs text-muted-foreground">React + Tailwind CSS</p>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/10 py-3 px-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Backend</p>
                  <p className="text-xs text-muted-foreground">Supabase Edge Functions</p>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/10 py-3 px-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">AI Engine</p>
                  <p className="text-xs text-muted-foreground">Google Gemini Flash</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="w-full max-w-5xl mx-auto px-6 sm:px-10 pb-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Step-by-Step Process</h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">Detailed breakdown of each stage</p>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={step.number} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-[2.25rem] top-full w-px h-6 bg-border hidden sm:block" />
                )}

                <div className="flex gap-6 items-start p-6 sm:p-8 rounded-xl border border-border bg-card">
                  <div className="flex-shrink-0 hidden sm:flex flex-col items-center gap-2">
                    <div className="h-[4.5rem] w-[4.5rem] rounded-2xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Step {step.number}</span>
                  </div>

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

        {/* Tech Stack */}
        <section className="w-full max-w-5xl mx-auto px-6 sm:px-10 pb-16">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Technology Stack</h2>
          <p className="text-muted-foreground text-center mb-8 text-sm">The tools and frameworks powering this application</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {techStack.map((tech) => (
              <div key={tech.name} className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <tech.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{tech.name}</h3>
                    <span className="text-xs text-primary font-medium uppercase tracking-wider">{tech.category}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tech.description}</p>
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
