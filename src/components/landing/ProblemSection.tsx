import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { painPointsMock } from "@/content/landing-mock-data";

const slides = painPointsMock;

export default function ProblemSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  const onPointerEnter = () => {
    setPaused(true);
    if (resumeRef.current) clearTimeout(resumeRef.current);
  };

  const onPointerLeave = () => {
    resumeRef.current = setTimeout(() => setPaused(false), 400);
  };

  const slide = slides[active];

  return (
    <section id="problem" className="py-20 md:py-32 bg-background scroll-mt-28 section-divider">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground">
            When agents search <span className="text-destructive/90">without oversight</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Runaway loops, surprise costs, and weak accountability erode trust. Human-in-the-loop supervision fixes
            operational issues — not just vibes.
          </p>
        </motion.div>

        <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div
            className="relative"
            onMouseEnter={onPointerEnter}
            onMouseLeave={onPointerLeave}
            onTouchStart={onPointerEnter}
            onTouchEnd={onPointerLeave}
          >
            <p className="text-xs font-mono text-muted-foreground mb-3 md:hidden">
              Swipe dots · auto-advance pauses on hover
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-border bg-card-gradient p-6 md:p-8 shadow-card"
              >
                <div className="mb-4">
                  <span className="text-destructive font-display font-semibold text-lg block">{slide.title}</span>
                  <span className="text-sm text-muted-foreground mt-1 block leading-relaxed">{slide.description}</span>
                </div>
                <blockquote className="text-base md:text-lg font-medium text-foreground/90 italic border-l-2 border-accent/50 pl-4">
                  &ldquo;{slide.quote}&rdquo;
                </blockquote>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-4 mt-6">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => setActive((a) => (a - 1 + slides.length) % slides.length)}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>
              <div className="flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Go to ${s.title}`}
                    onClick={() => setActive(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${i === active ? "w-8 bg-accent" : "w-2 bg-border"}`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setActive((a) => (a + 1) % slides.length)}
                className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(i)}
                className={`text-left rounded-xl p-4 md:p-5 transition-all border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  i === active ? "border-accent/40 bg-accent/5 shadow-card" : "border-transparent hover:bg-muted/50"
                }`}
              >
                <span className={`font-medium ${i === active ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.title}
                </span>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block line-clamp-2">{s.description}</p>
              </button>
            ))}
            <button
              type="button"
              onClick={() => document.getElementById("solution")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-accent/15 px-5 py-2.5 text-accent text-sm font-semibold hover:bg-accent/25 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              See the supervised stack
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
