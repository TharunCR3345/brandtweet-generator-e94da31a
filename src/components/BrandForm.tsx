import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground self-center">Try:</span>
        {EXAMPLE_BRANDS.map((b, i) => (
          <button
            key={b.brandName}
            type="button"
            onClick={() => fillExample(i)}
            className="px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {b.brandName}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="brandName">Brand Name</Label>
          <Input id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Nike" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry / Category</Label>
          <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Sports & Athletics" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="objective">Campaign Objective</Label>
        <Select value={objective} onValueChange={setObjective} required>
          <SelectTrigger id="objective">
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

      <div className="space-y-2">
        <Label htmlFor="product">Product / Service Description</Label>
        <Textarea id="product" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Briefly describe the brand's main products or services..." rows={3} required />
      </div>

      <Button type="submit" disabled={isLoading || !brandName || !industry || !objective || !productDescription} className="w-full h-12 text-base font-semibold brand-gradient-bg">
        <Sparkles className="mr-2 h-5 w-5" />
        {isLoading ? "Analyzing & Generating..." : "Generate 10 On-Brand Tweets"}
      </Button>
    </form>
  );
}
