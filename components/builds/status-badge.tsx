import { cn } from "@/lib/utils";

export default function StatusBadge({
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
