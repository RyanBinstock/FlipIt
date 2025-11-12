import BuildDetails from "@/app/builds/[id]/build-details";
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
      vendors(vendor_name),
      component_conditions(condition_status), 
      user_id`
    )
    .eq("build_id", buildId);
  console.log(components);
  const flattenedComponents = components?.map((component) => {
    return {
      id: component.id,
      name: component.name,
      price: component.price,
      details: component.details,
      build_id: component.build_id,
      user_id: component.user_id,
      // @ts-expect-error - parts will always be an object
      part: component.parts.part_name || "",
      // @ts-expect-error - vendors will always be an object
      vendor: component.vendors.vendor_name || "",
      //@ts-expect-error - component_conditions will always be an object
      condition_status: component.component_conditions.condition_status || "",
    };
  });
  console.log(flattenedComponents);
  return { components: flattenedComponents, error };
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
