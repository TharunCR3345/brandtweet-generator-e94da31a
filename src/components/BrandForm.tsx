import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BrandInput } from "@/lib/api";

interface BrandFormProps {
  onSubmit: (input: BrandInput) => void;
  isLoading: boolean;
}

export function BrandForm({ onSubmit, isLoading }: BrandFormProps) {
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [objective, setObjective] = useState("");
  const [productDescription, setProductDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ brandName, industry, objective, productDescription });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="brandName" className="text-sm">Brand Name</Label>
          <Input id="brandName" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Nike" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="industry" className="text-sm">Industry</Label>
          <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Sports" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="objective" className="text-sm">Campaign Objective</Label>
        <Select value={objective} onValueChange={setObjective} required>
          <SelectTrigger id="objective"><SelectValue placeholder="Select objective" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="awareness">Brand Awareness</SelectItem>
            <SelectItem value="promotion">Product Promotion</SelectItem>
            <SelectItem value="engagement">Audience Engagement</SelectItem>
            <SelectItem value="product-launch">Product Launch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product" className="text-sm">Product Description</Label>
        <Textarea id="product" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Describe the brand's products..." rows={3} required className="resize-none" />
      </div>

      <Button type="submit" disabled={isLoading || !brandName || !industry || !objective || !productDescription} className="w-full">
        {isLoading ? "Generating..." : "Generate 10 Tweets"}
      </Button>
    </form>
  );
}
