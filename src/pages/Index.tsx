import { useState } from "react";
import { BrandForm } from "@/components/BrandForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { generateTweets, type GenerateResult, type BrandInput } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [currentBrand, setCurrentBrand] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (input: BrandInput) => {
    setIsLoading(true);
    setResult(null);
    setCurrentBrand(input.brandName);
    try {
      const data = await generateTweets(input);
      setResult(data);
    } catch (err) {
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Subtle grid pattern */}
      <div className="fixed inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'0.5\'/%3E%3C/svg%3E")' }} />

      <div className="relative">
        {/* Header */}
        <header className="border-b border-border">
          <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded brand-gradient-bg" />
              <span className="font-semibold text-sm text-foreground tracking-tight">BrandTweet</span>
              <span className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 mono">v1.0</span>
            </div>
            <span className="text-xs text-tertiary mono">AI-powered tweet generation</span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-10 space-y-10">
          {/* Hero */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Generate on-brand tweets<br />
              <span className="brand-gradient-text">in seconds.</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
              Enter your brand details below. Our AI analyzes the brand's voice, tone, and audience — then generates 10 tweets that sound authentic.
            </p>
          </div>

          {/* Form */}
          <div className="rounded-lg border border-border bg-card p-6">
            <BrandForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" style={{ animationDelay: '0.3s' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" style={{ animationDelay: '0.6s' }} />
                </div>
                Analyzing <span className="text-foreground font-medium">{currentBrand}</span> brand voice...
              </div>
            </div>
          )}

          {/* Results */}
          {result && !isLoading && <ResultsDisplay result={result} brandName={currentBrand} />}
        </main>
      </div>
    </div>
  );
};

export default Index;
