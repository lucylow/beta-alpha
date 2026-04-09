import { useEffect, useState } from "react";

/** Section `id`s wired to sticky nav (order = scroll priority). */
export const NAV_SECTION_IDS = [
  "guardrails",
  "risks",
  "demo",
  "safety",
  "spending",
  "lists",
  "audit",
  "pricing",
  "install",
  "docs",
  "faq",
  "roadmap",
] as const;

export type NavSectionId = (typeof NAV_SECTION_IDS)[number];

const NAV_OFFSET_PX = 110;
const HERO_CLEAR_PX = 72;

export function useActiveNavSection(): NavSectionId | null {
  const [active, setActive] = useState<NavSectionId | null>(null);

  useEffect(() => {
    const pick = () => {
      if (window.scrollY < HERO_CLEAR_PX) {
        setActive(null);
        return;
      }
      const y = window.scrollY + NAV_OFFSET_PX;
      let current: NavSectionId | null = null;
      for (const id of NAV_SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) current = id;
      }
      setActive(current);
    };

    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, []);

  return active;
}
