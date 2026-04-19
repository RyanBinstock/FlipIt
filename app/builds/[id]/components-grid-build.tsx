"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import StatusBadge from "@/components/builds/status-badge";
import { formatCurrency } from "@/app/utils/money";
import { formatDate } from "@/app/utils/date";
import { Build } from "@/app/models/build";
import { Component } from "@/app/models/component";
import { getBuildStatus } from "@/app/utils/build-status";
import { AddComponentForm } from "@/components/builds/add-component-form";
import { EditComponentForm } from "@/components/builds/edit-component-form";
import { deleteComponent } from "@/app/builds/actions";

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

export function ComponentsGruidBuild({
  build,
  components,
  parts,
  vendors,
  conditions,
}: {
  build: Build;
  components: Component[];
  parts: Part[];
  vendors: Vendor[];
  conditions: Condition[];
}) {
  const router = useRouter();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [deletingComponentId, setDeletingComponentId] = useState<string | null>(
    null
  );
  const status = getBuildStatus(build);
  const totalComponentCost =
    components?.reduce((sum, component) => sum + (component.price || 0), 0) ||
    0;

  const handleAddClose = () => {
    setIsAddDialogOpen(false);
    router.refresh();
  };

  const handleEditClick = (component: Component) => {
    setSelectedComponent(component);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setSelectedComponent(null);
    router.refresh();
  };

  const handleDeleteClick = async (componentId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this component? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingComponentId(componentId);
    try {
      await deleteComponent(componentId);
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to delete component"
      );
    } finally {
      setDeletingComponentId(null);
    }
  };

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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Components</CardTitle>
              <CardDescription>
                {components?.length || 0} component
                {(components?.length || 0) !== 1 ? "s" : ""} in this build
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add Component</Button>
              </DialogTrigger>
              <DialogContent>
                <AddComponentForm
                  buildId={build.id}
                  parts={parts}
                  vendors={vendors}
                  conditions={conditions}
                  onClose={handleAddClose}
                />
              </DialogContent>
            </Dialog>
          </div>
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
                    <th className="text-right p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {components.map((component) => {
                    const partName = component.part;
                    const vendorName = component.vendor;
                    const conditionStatus = component.condition_status;

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
                        <td className="p-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(component)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(component.id)}
                              disabled={deletingComponentId === component.id}
                            >
                              {deletingComponentId === component.id
                                ? "Deleting..."
                                : "Delete"}
                            </Button>
                          </div>
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

      {/* Edit Component Dialog */}
      {selectedComponent && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <EditComponentForm
              component={selectedComponent}
              parts={parts}
              vendors={vendors}
              conditions={conditions}
              onClose={handleEditClose}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
