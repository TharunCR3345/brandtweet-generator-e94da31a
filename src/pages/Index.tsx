import { useState } from "react";
import { BrandForm } from "@/components/BrandForm";
import { TweetMarquee } from "@/components/TweetMarquee";
import { generateTweets, type GenerateResult, type BrandInput } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Twitter } from "lucide-react";

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
        <div className="w-full max-w-[1440px] mx-auto px-12 h-12 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Twitter className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground tracking-tight">BrandTweet Generator</span>
        </div>
      </header>

      {/* Hero section with animated tweet background */}
      <div className="relative flex-1 flex flex-col">
        {/* Animated tweet marquee background */}
        <div className="absolute inset-0 opacity-40 pointer-events-none select-none">
          <TweetMarquee />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="w-full max-w-[1440px] mx-auto px-12 py-16 flex items-center justify-center">
            {/* Form */}
            <div className="w-full max-w-lg bg-card/95 backdrop-blur-sm border border-border rounded-xl p-8 shadow-lg">
              <h2 className="text-lg font-semibold text-foreground mb-6">Enter brand details</h2>
              <BrandForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
