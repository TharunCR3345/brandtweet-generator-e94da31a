import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import { autofillBrand, type BrandInput } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface BrandFormProps {
  onSubmit: (input: BrandInput) => void;
  isLoading: boolean;
}

export function BrandForm({ onSubmit, isLoading }: BrandFormProps) {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [objective, setObjective] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [isAutofilling, setIsAutofilling] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ brandName, industry, objective, productDescription });
  };

  const handleAutofill = async () => {
    if (!brandName.trim()) {
      toast({ title: "Enter a brand name first", variant: "destructive" });
      return;
    }
    setIsAutofilling(true);
    try {
      const result = await autofillBrand(brandName.trim());
      setIndustry(result.industry);
      setObjective(result.objective);
      setProductDescription(result.productDescription);
      toast({ title: "Autofilled!", description: `Details fetched for ${brandName}` });
    } catch (err) {
      toast({ title: "Autofill failed", description: err instanceof Error ? err.message : "Try again", variant: "destructive" });
    } finally {
      setIsAutofilling(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Brand Name + Autofill */}
      <div className="space-y-2">
        <Label htmlFor="brandName" className="text-sm text-white/80">
          Brand Name <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          <Input
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g. Nike"
            required
            className="flex-1 bg-white/10 border-white/15 text-white placeholder:text-white/40 focus-visible:ring-primary/50"
          />
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleAutofill}
            disabled={isAutofilling || !brandName.trim()}
            className="shrink-0 text-sm gap-1.5 bg-white/10 border-white/15 text-white/80 hover:bg-white/20 hover:text-white"
          >
            {isAutofilling ? (
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isAutofilling ? "Fetching..." : "Autofill"}
          </Button>
        </div>
      </div>

      {/* Industry + Objective */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm text-white/80">
            Industry <span className="text-white/40 text-xs">(optional)</span>
          </Label>
          <Input
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g. Sports"
            className="bg-white/10 border-white/15 text-white placeholder:text-white/40 focus-visible:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="objective" className="text-sm text-white/80">
            Objective <span className="text-white/40 text-xs">(optional)</span>
          </Label>
          <Select value={objective} onValueChange={setObjective}>
            <SelectTrigger
              id="objective"
              className="bg-white/10 border-white/15 text-white [&>span]:text-white/40 [&[data-state=open]>span]:text-white focus:ring-primary/50"
            >
              <SelectValue placeholder="Select objective" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="awareness">Brand Awareness</SelectItem>
              <SelectItem value="promotion">Product Promotion</SelectItem>
              <SelectItem value="engagement">Audience Engagement</SelectItem>
              <SelectItem value="product-launch">Product Launch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Description */}
      <div className="space-y-2">
        <Label htmlFor="product" className="text-sm text-white/80">
          Product Description <span className="text-white/40 text-xs">(optional)</span>
        </Label>
        <Textarea
          id="product"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Describe the brand's products..."
          rows={3}
          className="resize-none bg-white/10 border-white/15 text-white placeholder:text-white/40 focus-visible:ring-primary/50"
        />
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isLoading || !brandName} className="w-full h-11 text-sm font-medium">
        {isLoading ? "Generating..." : "Generate 10 Tweets"}
      </Button>
    </form>
  );
}
