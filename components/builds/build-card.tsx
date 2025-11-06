import Link from "next/link";
import { Build } from "@/app/models/build";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function BuildCard({ build }: { build: Build }) {
  const status = getBuildStatus(build);

  const statusStyles = {
    sold: "opacity-60 border-muted bg-muted/20 hover:opacity-70",
    listed:
      "border-green-500/50 bg-green-50/50 dark:bg-green-950/20 hover:border-green-500 hover:shadow-md",
    "in-progress":
      "border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20 hover:border-blue-500 hover:shadow-md",
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 w-3/12 m-4 flex flex-col",
        statusStyles[status]
      )}
    >
      <Link href={`/builds/${build.id}`}>
        <CardHeader className="flex-grow">
          <CardTitle className="text-lg">{build.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground capitalize">
            {status.replace("-", " ")}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
