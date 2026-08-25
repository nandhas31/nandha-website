"use client";

import type { ReactNode } from "react";

import { useScroll } from "@/lib/use-scroll";
import { cn } from "@/lib/utils";

const FLOAT_VARIANTS = [
  "animate-float-a",
  "animate-float-b",
  "animate-float-c",
  "animate-float-d",
];

/** Wavelengths, in pixels of scroll, for the two drift axes. */
const DRIFT = {
  x: { period: 130, amplitude: 10 },
  y: { period: 170, amplitude: 8 },
};

/** Offsets each icon along the wave so a row of them never moves in lockstep. */
const PHASE_STEP = 1.7;

/**
 * An icon that drifts as the page scrolls, on top of its own idle CSS float.
 * `index` picks the idle animation and the scroll phase, so neighbouring icons
 * stay out of sync.
 */
export function FloatingIcon({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const { y } = useScroll();

  const phase = index * PHASE_STEP;
  const dx = Math.sin(y / DRIFT.x.period + phase) * DRIFT.x.amplitude;
  const dy = Math.cos(y / DRIFT.y.period + phase) * DRIFT.y.amplitude;

  return (
    <div className={cn("will-change-transform", FLOAT_VARIANTS[index % FLOAT_VARIANTS.length])}>
      <div
        style={{ transform: `translate(${dx}px, ${dy}px)` }}
        className={cn("motion-reduce:!transform-none", className)}
      >
        {children}
      </div>
    </div>
  );
}
