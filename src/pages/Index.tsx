import { useState } from "react";
import { BrandForm } from "@/components/BrandForm";
import { generateTweets, type BrandInput } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Twitter, Zap, BarChart2, Users } from "lucide-react";

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
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 h-14 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Twitter className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground tracking-tight">BrandTweet Generator</span>
        </div>
      </header>

      {/* Main — two columns */}
      <div className="flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — About */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
                Generate authentic,<br />on-brand tweets<br />in seconds.
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-md">
                Our AI analyzes your brand's voice, tone, and audience — then generates 10 tweets that sound like they were written by your social media team.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Voice Analysis</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Understands your brand tone, style, and audience automatically.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BarChart2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">4 Tweet Styles</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Conversational, promotional, witty, and informative — all in one run.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">10 Tweets Per Run</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Get a full batch of ready-to-post tweets optimized for engagement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-card border border-border rounded-xl p-7 shadow-sm">
            <h2 className="text-base font-semibold text-foreground mb-5">Brand Details</h2>
            <BrandForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-4">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 text-center">
          <p className="text-sm text-muted-foreground">Developed by <span className="font-semibold text-foreground">Tharun C R</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
