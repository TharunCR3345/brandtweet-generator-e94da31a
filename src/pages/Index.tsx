import { useState } from "react";
import { BrandForm } from "@/components/BrandForm";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { generateTweets, type GenerateResult, type BrandInput } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Zap, Twitter } from "lucide-react";

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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl brand-gradient-bg flex items-center justify-center">
            <Twitter className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">BrandTweet Generator</h1>
            <p className="text-sm text-muted-foreground">AI-powered on-brand tweet generation</p>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Input Section */}
        <section className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Brand Details</h2>
          </div>
          <BrandForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Analyzing <strong className="text-foreground">{currentBrand}</strong>'s brand voice & generating tweets...</span>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && <ResultsDisplay result={result} />}
      </main>
    </div>
  );
};

export default Index;
