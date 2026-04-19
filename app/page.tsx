import Header from "@/components/header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6 md:p-10">
        <section className="rounded-2xl border bg-gradient-to-br from-background to-muted/40 p-8 md:p-12">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Welcome to Flip It
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Run smarter projects from planning to profit.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Flip It is your workspace for managing builds, tracking inventory,
            and keeping every project on schedule. Use one clean workflow to
            stay organized, reduce delays, and make better decisions.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/builds">View Builds</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/inventory">Check Inventory</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Build Tracking</CardTitle>
              <CardDescription>
                Keep projects moving without missing details.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Create and manage builds, assign components, and stay on top of
              project progress in one place.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Visibility</CardTitle>
              <CardDescription>
                Know what is in stock before it becomes a blocker.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Track parts and availability so your team can plan confidently
              and avoid costly last-minute shortages.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actionable Insights</CardTitle>
              <CardDescription>
                See the health of your workflow at a glance.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Use the dashboard to review status, prioritize work, and keep
              every build aligned with your goals.
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
