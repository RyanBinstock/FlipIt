"use server";

import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";

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

