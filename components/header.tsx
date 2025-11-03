import Link from "next/link";
import { AuthButton } from "./auth-button";

export default function Header() {
  return (
    <header className="w-full flex justify-around items-center p-4 border-b">
      <div className="text-4xl font-bold">
        <Link href="/">Flip It</Link>
      </div>
      <nav className="flex gap-4">
        <Link className="text-2xl" href="/dashboard">
          Dashboard
        </Link>
        <Link className="text-2xl" href="/builds">
          Builds
        </Link>
        <Link className="text-2xl" href="/inventory">
          Inventory
        </Link>
      </nav>

      <AuthButton />
    </header>
  );
}
