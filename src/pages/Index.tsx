import { useState } from "react";
import { BrandForm } from "@/components/BrandForm";
import { generateTweets, type GenerateResult, type BrandInput } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (input: BrandInput) => {
    setIsLoading(true);
    try {
      const data = await generateTweets(input);
      navigate("/results", { state: { result: data, brandName: input.brandName } });
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <span className="font-semibold text-foreground">BrandTweet Generator</span>
        </div>
      </header>

      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Generate on-brand tweets</h1>
            <p className="text-sm text-muted-foreground">Enter a brand name to generate 10 authentic, human-sounding tweets.</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <BrandForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
