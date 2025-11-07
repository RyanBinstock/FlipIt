import { createClient } from "@/lib/supabase/server";

export async function getBuildById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("builds")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

export async function getComponentsByBuildId(buildId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("components")
    .select("*")
    .eq("build_id", buildId);

  return { data, error };
}

