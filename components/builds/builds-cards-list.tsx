import Link from "next/link";
import { Build } from "@/app/models/build";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getBuildStatus(build: Build): "sold" | "listed" | "in-progress" {
  if (build.date_sold) {
    return "sold";
  }
  if (build.date_listed) {
    return "listed";
  }
  return "in-progress";
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch {
    return "";
  }
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function StatusBadge({
  status,
}: {
  status: "sold" | "listed" | "in-progress";
}) {
  const statusStyles = {
    sold: "bg-muted/20 text-muted-foreground border-muted",
    listed:
      "bg-green-50 text-green-700 border-green-500/50 dark:bg-green-950/20 dark:text-green-400 dark:border-green-500/50",
    "in-progress":
      "bg-blue-50 text-blue-700 border-blue-500/50 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-500/50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md border",
        statusStyles[status]
      )}
    >
      {status.replace("-", " ")}
    </span>
  );
}

export default function BuildsCardsList({ builds }: { builds: Build[] }) {
  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-semibold">Name</th>
              <th className="text-left p-3 font-semibold">Status</th>
              <th className="text-left p-3 font-semibold">Date Listed</th>
              <th className="text-left p-3 font-semibold">Date Sold</th>
              <th className="text-left p-3 font-semibold">Sold Price</th>
              <th className="text-right p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {builds.map((build) => {
              const status = getBuildStatus(build);
              return (
                <tr
                  key={build.id}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3">{build.name}</td>
                  <td className="p-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {formatDate(build.date_listed) || ""}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {formatDate(build.date_sold) || ""}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {formatCurrency(build.sold_price) || ""}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end">
                      <Link href={`/builds/${build.id}`}>
                        <Button variant="outline" size="sm">
                          Edit Build
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
