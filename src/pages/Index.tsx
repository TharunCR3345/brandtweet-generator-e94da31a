import { useState } from "react";
import { BrandForm } from "@/components/BrandForm";
import { SocialAnalysisDisplay } from "@/components/SocialAnalysisDisplay";
import { generateTweets, analyzeBrandSocial, type BrandInput, type SocialAnalysisResult } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Twitter, Zap, BarChart2, Users, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [step, setStep] = useState<"input" | "analysis">("input");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [socialAnalysis, setSocialAnalysis] = useState<SocialAnalysisResult | null>(null);
  const [brandInput, setBrandInput] = useState<BrandInput | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (input: BrandInput) => {
    setBrandInput(input);
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeBrandSocial(input.brandName);
      setSocialAnalysis(analysis);
      setStep("analysis");
    } catch (err) {
      toast({
        title: "Analysis failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!brandInput || !socialAnalysis) return;
    setIsGenerating(true);
    try {
      const data = await generateTweets({ ...brandInput, socialAnalysis });
      navigate("/results", { state: { result: data, brandName: brandInput.brandName } });
    } catch (err) {
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Twitter className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground tracking-tight">BrandTweet Generator</span>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 pt-14 pb-12">
        {step === "input" ? (
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-10rem)]">
            {/* Left — About */}
            <div className="space-y-8">
              <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
                  Generate authentic,<br />on-brand tweets<br />in seconds.
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Our AI first analyzes your brand's real social media presence across Twitter/X, Instagram & LinkedIn — then generates tweets that match your actual voice.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground">Social Media Analysis</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Scans your brand's posts across Twitter/X, Instagram & LinkedIn to learn your voice.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground">AI Voice Matching</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Generates tweets that match your real tone, slang, and writing patterns.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground">4 Tweet Styles</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Conversational, promotional, witty, and informative — all in one run.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-foreground">10 Tweets Per Run</p>
                    <p className="text-sm text-muted-foreground mt-0.5">Get a full batch of ready-to-post tweets optimized for engagement.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-card border border-border rounded-xl p-7 shadow-sm">
              <h2 className="text-base font-semibold text-foreground mb-1">Brand Details</h2>
              <p className="text-sm text-muted-foreground mb-5">Step 1: Enter your brand info. We'll analyze your social media presence first.</p>
              <BrandForm onSubmit={handleSubmit} isLoading={isAnalyzing} buttonText={isAnalyzing ? "Analyzing Social Media..." : "Analyze Brand & Continue"} />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-8">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="sm" onClick={() => setStep("input")} className="gap-1.5 -ml-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground">Step 2: Review analysis & generate tweets</span>
            </div>

            {socialAnalysis && brandInput && (
              <SocialAnalysisDisplay
                analysis={socialAnalysis}
                brandName={brandInput.brandName}
                onProceed={handleGenerate}
                isGenerating={isGenerating}
              />
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card py-2.5">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 text-center">
          <p className="text-sm text-muted-foreground">Developed by <span className="font-semibold text-foreground">Tharun C R</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
