import { Build } from "@/app/models/build";

export function getBuildStatus(
  build: Build
): "sold" | "listed" | "in-progress" {
  if (build.date_sold) {
    return "sold";
  }
  if (build.date_listed) {
    return "listed";
  }
  return "in-progress";
}
