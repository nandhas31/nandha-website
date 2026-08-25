"use client";

import { useEffect, useState } from "react";

import { SECTIONS, type SectionId } from "@/lib/site-data";
import { useScroll } from "@/lib/use-scroll";
import { cn } from "@/lib/utils";

/** Treat the middle 10% band of the viewport as "the section you're reading". */
const ACTIVE_BAND = "-45% 0px -45% 0px";

function useActiveSection(): SectionId {
  const [activeId, setActiveId] = useState<SectionId>(SECTIONS[0].id);

  useEffect(() => {
    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        // Several sections can straddle the band at once, so pick the topmost
        // rather than letting whichever entry came last in the batch win.
        const topmost = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (topmost) setActiveId(topmost.target.id as SectionId);
      },
      { rootMargin: ACTIVE_BAND, threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return activeId;
}

export function SectionNav() {
  const activeId = useActiveSection();
  const { progress } = useScroll();

  return (
    <nav
      aria-label="Section navigation"
      className="fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 items-stretch gap-4 lg:flex"
    >
      <ul className="flex flex-col justify-center gap-6">
        {SECTIONS.map((section) => {
          const active = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "text-xs font-medium tracking-wide uppercase transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="relative w-px shrink-0 bg-border">
        <div
          className="absolute inset-x-0 top-0 bg-foreground transition-[height] duration-300 ease-out"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </nav>
  );
}
