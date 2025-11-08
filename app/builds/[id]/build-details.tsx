import { getBuildWithComponents } from "@/lib/data";
import { Build } from "@/app/models/build";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatusBadge from "@/components/builds/status-badge";
import { formatCurrency } from "@/app/utils/money";
import { formatDate } from "@/app/utils/date";

type ComponentWithRelations = {
  id: string;
  name: string;
  price: number;
  details: string;
  build_id: string;
  parts: { part_name: string }[] | { part_name: string };
  vendors: { vendor_name: string }[] | { vendor_name: string };
  component_conditions:
    | { condition_status: string }[]
    | { condition_status: string };
};

function getBuildStatus(build: Build): "sold" | "listed" | "in-progress" {
  if (build.date_sold) {
    return "sold";
  }
  if (build.date_listed) {
    return "listed";
  }
  return "in-progress";
}

function getPartName(
  parts: { part_name: string }[] | { part_name: string }
): string {
  if (Array.isArray(parts)) {
    return parts.length > 0 ? parts[0].part_name : "-";
  }
  return parts.part_name || "-";
}

function getVendorName(
  vendors: { vendor_name: string }[] | { vendor_name: string }
): string {
  if (Array.isArray(vendors)) {
    return vendors.length > 0 ? vendors[0].vendor_name : "-";
  }
  return vendors.vendor_name || "-";
}

function getConditionStatus(
  conditions: { condition_status: string }[] | { condition_status: string }
): string {
  if (Array.isArray(conditions)) {
    return conditions.length > 0 ? conditions[0].condition_status : "-";
  }
  return conditions.condition_status || "-";
}

export default async function BuildDetails({ id }: { id: string }) {
  const { build, components, error } = await getBuildWithComponents(id);

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

  const status = getBuildStatus(build);
  const totalComponentCost =
    components?.reduce((sum, component) => sum + (component.price || 0), 0) ||
    0;

  return (
    <div className="w-full px-10 py-6 space-y-6">
      {/* Build Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{build.name}</CardTitle>
              <CardDescription className="mt-2">
                Build ID: {build.id}
              </CardDescription>
            </div>
            <StatusBadge status={status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date Listed</p>
              <p className="font-medium">
                {formatDate(build.date_listed) || "Not Listed"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date Sold</p>
              <p className="font-medium">
                {formatDate(build.date_sold) || "Not Sold"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sold Price</p>
              <p className="font-medium">
                {formatCurrency(build.sold_price) || formatCurrency(0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Component Cost
              </p>
              <p className="font-medium">
                {formatCurrency(totalComponentCost)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Components Table */}
      <Card>
        <CardHeader>
          <CardTitle>Components</CardTitle>
          <CardDescription>
            {components?.length || 0} component
            {(components?.length || 0) !== 1 ? "s" : ""} in this build
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!components || components.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No components found for this build.
            </div>
          ) : (
            <div className="overflow-x-auto border-x border-border rounded-lg shadow-sm bg-background">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Part</th>
                    <th className="text-left p-3 font-semibold">Name</th>
                    <th className="text-left p-3 font-semibold">Price</th>
                    <th className="text-left p-3 font-semibold">Vendor</th>
                    <th className="text-left p-3 font-semibold">Condition</th>
                    <th className="text-left p-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((component: ComponentWithRelations) => {
                    const partName = getPartName(component.parts);
                    const vendorName = getVendorName(component.vendors);
                    const conditionStatus = getConditionStatus(
                      component.component_conditions
                    );

                    return (
                      <tr
                        key={component.id}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-3 text-muted-foreground">
                          {partName}
                        </td>
                        <td className="p-3">{component.name}</td>
                        <td className="p-3">
                          {formatCurrency(component.price)}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {vendorName}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {conditionStatus}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {component.details || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
