"use client";

import { useState } from "react";
import { createBuild } from "@/app/builds/actions";
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

export function AddBuildForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"In progress" | "Listed" | "Sold">(
    "In progress",
  );
  const [dateListed, setDateListed] = useState("");
  const [dateSold, setDateSold] = useState("");
  const [soldPrice, setSoldPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("status", status);
      if (status === "Listed" && dateListed) {
        formData.append("dateListed", dateListed);
      }
      if (status === "Sold" && dateSold) {
        formData.append("dateSold", dateSold);
        if (soldPrice) {
          formData.append("soldPrice", soldPrice);
        }
      }

      await createBuild(formData);
      // Navigation will happen in the server action via redirect
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Add Build</CardTitle>
        <CardDescription>
          Enter the details for your new build
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Build name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className={cn(
                  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                )}
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as "In progress" | "Listed" | "Sold",
                  )
                }
              >
                <option value="In progress">In progress</option>
                <option value="Listed">Listed</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            {status === "Listed" && (
              <div className="grid gap-2">
                <Label htmlFor="dateListed">List Date</Label>
                <Input
                  id="dateListed"
                  type="datetime-local"
                  required
                  value={dateListed}
                  onChange={(e) => setDateListed(e.target.value)}
                />
              </div>
            )}

            {status === "Sold" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="dateSold">Sold Date</Label>
                  <Input
                    id="dateSold"
                    type="datetime-local"
                    required
                    value={dateSold}
                    onChange={(e) => setDateSold(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="soldPrice">Sold Price</Label>
                  <Input
                    id="soldPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={soldPrice}
                    onChange={(e) => setSoldPrice(e.target.value)}
                  />
                </div>
              </>
            )}

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
                {isLoading ? "Creating..." : "Add Build"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

