import Link from "next/link";
import { Build } from "@/app/models/build";
import { Button } from "@/components/ui/button";
import StatusBadge from "./status-badge";
import { formatCurrency } from "@/app/utils/money";
import { formatDate } from "@/app/utils/date";

function getBuildStatus(build: Build): "sold" | "listed" | "in-progress" {
  if (build.date_sold) {
    return "sold";
  }
  if (build.date_listed) {
    return "listed";
  }
  return "in-progress";
}

export default function BuildsTable({ builds }: { builds: Build[] }) {
  return (
    <div className="w-full px-10 py-6">
      <div className="overflow-x-auto border-x border-border rounded-lg shadow-sm bg-background">
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
