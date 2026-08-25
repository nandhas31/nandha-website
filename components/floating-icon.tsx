"use client";

import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const FLOAT_VARIANTS = ["animate-float-a", "animate-float-b", "animate-float-c", "animate-float-d"];

export function FloatingIcon({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const phase = index * 1.7;
  const dx = Math.sin(scrollY / 130 + phase) * 10;
  const dy = Math.cos(scrollY / 170 + phase) * 8;

  return (
    <div className={cn("will-change-transform", FLOAT_VARIANTS[index % FLOAT_VARIANTS.length])}>
      <div
        style={{ transform: `translate(${dx}px, ${dy}px)` }}
        className={cn("transition-transform duration-300 ease-out", className)}
      >
        {children}
      </div>
    </div>
  );
}
