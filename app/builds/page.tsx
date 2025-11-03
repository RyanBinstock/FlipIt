import { createClient } from "@/lib/supabase/server";
import Header from "@/components/header";

export default async function BuildsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("builds").select("*");

  return (
    <div>
      <Header />
      <h1>Welcome to your builds!</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
