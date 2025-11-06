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
        {data?.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">
            No builds found. Start by adding a new build.
          </div>
        )}
      </div>
    </>
  );
}
