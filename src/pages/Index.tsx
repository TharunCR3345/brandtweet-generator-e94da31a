import { useState } from "react";
import { BrandForm } from "@/components/BrandForm";
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
        <div className="w-full max-w-[1440px] mx-auto px-12 h-16 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Twitter className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground tracking-tight">BrandTweet Generator</span>
        </div>
      </header>

      {/* Main — two column: left info, right form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[1200px] mx-auto px-8 py-16 grid grid-cols-2 gap-20 items-center">
          
          {/* Left — description */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground leading-tight tracking-tight">
              Generate authentic,<br />on-brand tweets<br />in seconds.
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Our AI analyzes your brand's voice, tone, and audience — then generates 10 tweets that sound like they were written by your social media team.
            </p>
            <div className="flex gap-8 pt-2">
              <div>
                <p className="text-2xl font-bold text-foreground">10</p>
                <p className="text-sm text-muted-foreground">Tweets per run</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4</p>
                <p className="text-sm text-muted-foreground">Tweet styles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">AI</p>
                <p className="text-sm text-muted-foreground">Voice analysis</p>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-6">Enter brand details</h2>
            <BrandForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
