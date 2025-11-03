type Build = {
  name: string;
};

export default function BuildCard({ build }: { build: Build }) {
  return <div>Build Card for {build.name}</div>;
}
