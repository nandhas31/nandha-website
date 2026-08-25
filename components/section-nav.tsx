"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const sections = [
  { id: "home", label: "Intro" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function SectionNav() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const updateProgress = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 items-stretch gap-4 lg:flex"
    >
      <ul className="flex flex-col justify-center gap-6">
        {sections.map((section) => {
          const active = activeId === section.id;
          return (
            <li key={section.id}>
              <button
                type="button"
                onClick={() =>
                  document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" })
                }
                aria-current={active ? "true" : undefined}
                className={cn(
                  "text-xs font-medium tracking-wide uppercase transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {section.label}
              </button>
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
