import type { ReactNode } from "react";

import { Reveal } from "@/components/reveal";
import type { SectionId } from "@/lib/site-data";
import { cn } from "@/lib/utils";

/**
 * Stagger step between revealed elements. Sections express delays as
 * `step(n)` rather than hand-tuned millisecond literals.
 */
const STEP_MS = 80;

export function step(n: number): number {
  return n * STEP_MS;
}

/** The small uppercase kicker that opens every section. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{children}</h2>
  );
}

/** Standard content width, shared by the sections and the agent view. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-4xl px-6", className)}>{children}</div>;
}

/** A titled page section, registered under one of the `SECTIONS` ids. */
export function Section({
  id,
  label,
  title,
  children,
}: {
  id: SectionId;
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <Eyebrow>{label}</Eyebrow>
        </Reveal>
        <Reveal delay={step(1)}>
          <SectionTitle>{title}</SectionTitle>
        </Reveal>
        {children}
      </Container>
    </section>
  );
}

/** The bordered surface every experience / education / project entry sits on. */
export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-5", className)}>
      {children}
    </div>
  );
}
