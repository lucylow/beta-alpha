import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--accent) / 0.2), transparent), radial-gradient(ellipse 60% 40% at 100% 100%, hsl(var(--primary) / 0.15), transparent)",
        }}
      />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-card">
          <Search className="h-8 w-8 text-muted-foreground" aria-hidden />
        </div>
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">404</p>
        <h1 className="mt-3 max-w-lg font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          This path is not indexed
        </h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground md:text-base">
          The URL <code className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-foreground">{location.pathname}</code>{" "}
          does not exist. Head back to the landing page or open the paid search demo.
        </p>
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="rounded-full px-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-full px-6">
            <Link to="/demo" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 rotate-180" />
              Open demo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
