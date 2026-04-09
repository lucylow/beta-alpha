import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import frameworkMd from "@/content/specialized-ai-agents-framework.md?raw";

export default function SpecializedAgentsFramework() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Landing</span>
            </Link>
            <Badge variant="outline" className="hidden border-accent/30 font-mono text-[10px] text-accent sm:inline-flex">
              Long read
            </Badge>
          </div>
          <div className="hidden min-w-0 items-center gap-2 text-sm font-semibold font-display text-foreground md:flex">
            <BookOpen className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            <span className="truncate">Specialized AI agents · MCP &amp; payments</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14">
        <p className="mb-8 text-sm text-muted-foreground leading-relaxed">
          Companion doc for judges and builders: how SLMs, tool routing, and paid MCP endpoints (like{" "}
          <span className="font-mono text-foreground/90">web_search</span>) fit together in agent systems.
        </p>
        <article
          className="prose prose-neutral max-w-none overflow-x-auto rounded-2xl border border-border/80 bg-card/40 px-4 py-8 shadow-card sm:px-8 dark:prose-invert prose-headings:scroll-mt-28 prose-headings:font-display prose-a:text-accent prose-code:rounded-md prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{frameworkMd}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
