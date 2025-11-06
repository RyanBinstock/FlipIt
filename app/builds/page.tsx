import { createClient } from "@/lib/supabase/server";
import Header from "@/components/header";
import BuildsTable from "@/components/builds/builds-table";

export default async function BuildsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("builds").select("*");

  return (
    <>
      <div>
        <Header />
        <BuildsTable builds={data || []} />
      </div>
    </>
  );
}
