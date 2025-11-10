import { createClient } from "@/lib/supabase/server";

export async function getBuildById(id: string) {
  const supabase = await createClient();
  const { data: build, error } = await supabase
    .from("builds")
    .select("*")
    .eq("id", id)
    .single();

  return { build, error };
}

export async function getComponentsByBuildId(buildId: string) {
  const supabase = await createClient();
  const { data: components, error } = await supabase
    .from("components")
    .select(
      `
      id,
      name,
      price,
      details,
      build_id,
      parts!inner(part_name),
      vendors!inner(vendor_name),
      component_conditions!inner(condition_status), 
      user_id`
    )
    .eq("build_id", buildId);

  return { components, error };
}

export async function getBuildWithComponents(buildId: string) {
  const { build, error: buildError } = await getBuildById(buildId);
  const { components, error: componentsError } = await getComponentsByBuildId(
    buildId
  );

  if (buildError || componentsError) {
    return {
      build: null,
      components: null,
      error: buildError || componentsError,
    };
  }

  return { build, components, error: null };
}

export async function getPartById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("parts")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}
