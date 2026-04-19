"use server";

import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createBuild(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Get form data
  const name = formData.get("name") as string;
  const status = formData.get("status") as string;
  const dateListed = formData.get("dateListed") as string | null;
  const dateSold = formData.get("dateSold") as string | null;
  const soldPrice = formData.get("soldPrice") as string | null;

  // Validate required fields
  if (!name || !status) {
    throw new Error("Name and status are required");
  }

  // Generate UUID for build ID
  const buildId = randomUUID();

  // Map status to database fields
  let date_listed: string | null = null;
  let date_sold: string | null = null;
  let sold_price: number | null = null;

  if (status === "Listed") {
    if (!dateListed) {
      throw new Error("List date is required when status is Listed");
    }
    date_listed = new Date(dateListed).toISOString();
  } else if (status === "Sold") {
    if (!dateSold) {
      throw new Error("Sold date is required when status is Sold");
    }
    date_sold = new Date(dateSold).toISOString();
    sold_price = soldPrice ? parseFloat(soldPrice) : null;
  }
  // If status is "In progress", all date fields remain null

  // Insert build into database
  const { error: insertError } = await supabase.from("builds").insert({
    id: buildId,
    name,
    user_id: user.id,
    date_listed,
    date_sold,
    sold_price,
  });

  if (insertError) {
    throw new Error(`Failed to create build: ${insertError.message}`);
  }

  // Redirect to the new build page
  redirect(`/builds/${buildId}`);
}

export async function createComponent(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Get form data
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const details = formData.get("details") as string | null;
  const partId = formData.get("partId") as string;
  const vendorId = formData.get("vendorId") as string;
  const conditionId = formData.get("conditionId") as string;
  const buildId = formData.get("buildId") as string;

  // Validate required fields
  if (!name || !price || !partId || !vendorId || !conditionId || !buildId) {
    throw new Error(
      "Name, price, part, vendor, condition, and build are required"
    );
  }

  // Validate build ownership
  const { data: build, error: buildError } = await supabase
    .from("builds")
    .select("id, user_id")
    .eq("id", buildId)
    .single();

  if (buildError || !build) {
    throw new Error("Build not found");
  }

  if (build.user_id !== user.id) {
    throw new Error("Unauthorized: You don't own this build");
  }

  // Generate UUID for component ID
  const componentId = randomUUID();

  // Parse price
  const priceValue = parseFloat(price);
  if (isNaN(priceValue) || priceValue < 0) {
    throw new Error("Price must be a valid positive number");
  }

  // Insert component into database
  const { error: insertError } = await supabase.from("components").insert({
    id: componentId,
    name,
    price: priceValue,
    details: details || null,
    build_id: buildId,
    part_id: partId,
    vendor_id: vendorId,
    condition_status_id: conditionId,
    user_id: user.id,
  });

  if (insertError) {
    throw new Error(`Failed to create component: ${insertError.message}`);
  }

  // Revalidate the build page
  revalidatePath(`/builds/${buildId}`);
}

export async function updateComponent(componentId: string, formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Verify component exists and user owns it
  const { data: component, error: componentError } = await supabase
    .from("components")
    .select("id, user_id, build_id")
    .eq("id", componentId)
    .single();

  if (componentError || !component) {
    throw new Error("Component not found");
  }

  if (component.user_id !== user.id) {
    throw new Error("Unauthorized: You don't own this component");
  }

  // Get form data
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const details = formData.get("details") as string | null;
  const partId = formData.get("partId") as string;
  const vendorId = formData.get("vendorId") as string;
  const conditionId = formData.get("conditionId") as string;

  // Validate required fields
  if (!name || !price || !partId || !vendorId || !conditionId) {
    throw new Error("Name, price, part, vendor, and condition are required");
  }

  // Parse price
  const priceValue = parseFloat(price);
  if (isNaN(priceValue) || priceValue < 0) {
    throw new Error("Price must be a valid positive number");
  }

  // Update component in database
  const { error: updateError } = await supabase
    .from("components")
    .update({
      name,
      price: priceValue,
      details: details || null,
      part_id: partId,
      vendor_id: vendorId,
      condition_id: conditionId,
    })
    .eq("id", componentId);

  if (updateError) {
    throw new Error(`Failed to update component: ${updateError.message}`);
  }

  // Revalidate the build page
  revalidatePath(`/builds/${component.build_id}`);
}

export async function deleteComponent(componentId: string) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Verify component exists and user owns it
  const { data: component, error: componentError } = await supabase
    .from("components")
    .select("id, user_id, build_id")
    .eq("id", componentId)
    .single();

  if (componentError || !component) {
    throw new Error("Component not found");
  }

  if (component.user_id !== user.id) {
    throw new Error("Unauthorized: You don't own this component");
  }

  // Delete component from database
  const { error: deleteError } = await supabase
    .from("components")
    .delete()
    .eq("id", componentId);

  if (deleteError) {
    throw new Error(`Failed to delete component: ${deleteError.message}`);
  }

  // Revalidate the build page
  revalidatePath(`/builds/${component.build_id}`);
}
