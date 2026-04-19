import { getBuildWithComponents, getAllParts, getAllVendors, getAllComponentConditions } from "@/lib/data";
import { ComponentsGruidBuild } from "./components-grid-build";

export default async function BuildDetails({ id }: { id: string }) {
  const { build, components, error } = await getBuildWithComponents(id);
  const { parts } = await getAllParts();
  const { vendors } = await getAllVendors();
  const { conditions } = await getAllComponentConditions();

  if (error || !build) {
    console.log(error);
    return (
      <div className="w-full px-10 py-6">
        <div className="text-center text-muted-foreground">
          Error fetching build details
        </div>
      </div>
    );
  }
  return (
    <ComponentsGruidBuild
      build={build}
      components={components || []}
      parts={parts}
      vendors={vendors}
      conditions={conditions}
    />
  );
}
