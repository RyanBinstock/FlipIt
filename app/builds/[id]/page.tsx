import Header from "@/components/header";
import BuildDetails from "./build-details";

export default async function BuildPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <BuildDetails id={id} />
    </>
  );
}
