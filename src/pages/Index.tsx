import { useState } from "react";
import { BrandForm } from "@/components/BrandForm";
import { TweetMarquee } from "@/components/TweetMarquee";
import { generateTweets, type BrandInput } from "@/lib/api";
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
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Header — dark glass, fixed to top */}
      <header className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-2xl">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Twitter className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-white tracking-tight">BrandTweet Generator</span>
        </div>
      </header>

      {/* Hero — marquee background + centered form */}
      <div className="relative flex-1 flex flex-col">
        {/* Animated marquee background */}
        <div className="absolute inset-0 opacity-35 pointer-events-none select-none overflow-hidden">
          <TweetMarquee />
        </div>

        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-primary/6 blur-[100px]" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
              Generate on-brand tweets
            </h1>
            <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              AI-powered tweet generation that matches your brand voice perfectly.
            </p>
          </div>

          {/* Form card — dark glass */}
          <div className="w-full max-w-[480px] bg-black/35 backdrop-blur-2xl border border-white/12 rounded-2xl p-7 shadow-2xl">
            <h2 className="text-base font-semibold text-white mb-5">Brand Details</h2>
            <BrandForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
