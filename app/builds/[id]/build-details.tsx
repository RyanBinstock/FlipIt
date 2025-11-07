import { getBuildById, getComponentsByBuildId } from "@/lib/data";

export default async function BuildDetails({ id }: { id: string }) {
  const { data: build, error: buildError } = await getBuildById(id);
  const { data: components, error: componentsError } =
    await getComponentsByBuildId(id);

  if (buildError || componentsError) {
    console.log(buildError || componentsError);
    return <div>Error fetching build details</div>;
  }

  console.log(build);
  console.log(components);
  return <div>Build ID: {id}</div>;
}
