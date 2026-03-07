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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center">
          <span className="font-semibold text-foreground">BrandTweet Generator</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Generate on-brand tweets</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter brand details to generate 10 tweets that match the brand voice.</p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-lg p-5">
          <BrandForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Analyzing {currentBrand}...
          </div>
        )}

        {/* Results */}
        {result && !isLoading && <ResultsDisplay result={result} brandName={currentBrand} />}
      </main>
    </div>
  );
};

export default Index;
