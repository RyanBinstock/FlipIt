"use client";

import { useState, useEffect } from "react";
import { updateComponent } from "@/app/builds/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Component } from "@/app/models/component";

type Part = {
  id: string;
  part_name: string;
};

type Vendor = {
  id: string;
  vendor_name: string;
};

type Condition = {
  id: string;
  condition_status: string;
};

export function EditComponentForm({
  component,
  parts,
  vendors,
  conditions,
  onClose,
}: {
  component: Component;
  parts: Part[];
  vendors: Vendor[];
  conditions: Condition[];
  onClose: () => void;
}) {
  const [name, setName] = useState(component.name);
  const [price, setPrice] = useState(component.price.toString());
  const [details, setDetails] = useState(component.details || "");
  const [partId, setPartId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [conditionId, setConditionId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Find matching IDs from component's string values
  useEffect(() => {
    const matchingPart = parts.find((p) => p.part_name === component.part);
    if (matchingPart) {
      setPartId(matchingPart.id);
    }

    const matchingVendor = vendors.find((v) => v.vendor_name === component.vendor);
    if (matchingVendor) {
      setVendorId(matchingVendor.id);
    }

    const matchingCondition = conditions.find(
      (c) => c.condition_status === component.condition_status
    );
    if (matchingCondition) {
      setConditionId(matchingCondition.id);
    }
  }, [component, parts, vendors, conditions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("details", details);
      formData.append("partId", partId);
      formData.append("vendorId", vendorId);
      formData.append("conditionId", conditionId);

      await updateComponent(component.id, formData);
      onClose();
      // Data will be refreshed via revalidatePath in the server action
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Edit Component</CardTitle>
        <CardDescription>Update the details for this component</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Component name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="part">Part</Label>
              <select
                id="part"
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                )}
                value={partId}
                onChange={(e) => setPartId(e.target.value)}
                required
              >
                <option value="">Select a part</option>
                {parts.map((part) => (
                  <option key={part.id} value={part.id}>
                    {part.part_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vendor">Vendor</Label>
              <select
                id="vendor"
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                )}
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                required
              >
                <option value="">Select a vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.vendor_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                )}
                value={conditionId}
                onChange={(e) => setConditionId(e.target.value)}
                required
              >
                <option value="">Select a condition</option>
                {conditions.map((condition) => (
                  <option key={condition.id} value={condition.id}>
                    {condition.condition_status}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="details">Details</Label>
              <Input
                id="details"
                type="text"
                placeholder="Additional details (optional)"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Component"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

