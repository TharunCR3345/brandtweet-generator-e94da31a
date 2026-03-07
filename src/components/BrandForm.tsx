import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import type { BrandInput } from "@/lib/api";

interface BrandFormProps {
  onSubmit: (input: BrandInput) => void;
  isLoading: boolean;
}

const EXAMPLE_BRANDS = [
  { brandName: "Nike", industry: "Sports & Athletics", objective: "product-launch", productDescription: "New running shoes with advanced cushioning technology" },
  { brandName: "Swiggy", industry: "Food Delivery", objective: "engagement", productDescription: "Online food ordering and delivery platform" },
  { brandName: "Apple", industry: "Technology", objective: "awareness", productDescription: "Premium consumer electronics and software" },
  { brandName: "Netflix", industry: "Entertainment", objective: "engagement", productDescription: "Streaming platform for movies and series" },
];

export function BrandForm({ onSubmit, isLoading }: BrandFormProps) {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [objective, setObjective] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ brandName, industry, objective, productDescription });
  };

  const fillExample = (idx: number) => {
    const ex = EXAMPLE_BRANDS[idx];
    setBrandName(ex.brandName);
    setIndustry(ex.industry);
    setObjective(ex.objective);
    setProductDescription(ex.productDescription);
  };

  const isValid = brandName && industry && objective && productDescription;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Quick fill */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs mono text-tertiary uppercase tracking-wider">Quick fill</span>
        <div className="h-px flex-1 bg-border" />
        {EXAMPLE_BRANDS.map((b, i) => (
          <button
            key={b.brandName}
            type="button"
            onClick={() => fillExample(i)}
            className="px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all duration-150"
          >
            {b.brandName}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="brandName" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Brand Name</Label>
          <Input id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Nike" required className="bg-card border-border h-10 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry</Label>
          <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Sports & Athletics" required className="bg-card border-border h-10 text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="objective" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Campaign Objective</Label>
        <Select value={objective} onValueChange={setObjective} required>
          <SelectTrigger id="objective" className="bg-card border-border h-10 text-sm">
            <SelectValue placeholder="Select objective" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="awareness">Brand Awareness</SelectItem>
            <SelectItem value="promotion">Product Promotion</SelectItem>
            <SelectItem value="engagement">Audience Engagement</SelectItem>
            <SelectItem value="product-launch">Product Launch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Product Description</Label>
        <Textarea id="product" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Briefly describe the brand's products or services..." rows={3} required className="bg-card border-border text-sm placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20 resize-none" />
      </div>

      <Button type="submit" disabled={isLoading || !isValid} className="w-full h-11 text-sm font-semibold brand-gradient-bg text-primary-foreground border-0 hover:opacity-90 transition-opacity glow-primary">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Generate Tweets
            <ArrowRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </form>
  );
}
