import { Reveal } from "@/components/reveal";
import { Card, Section, step } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { highlights } from "@/lib/site-data";

export function Highlights() {
  return (
    <Section id="highlights" label="Highlights" title="Highlights">
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {highlights.map((highlight, index) => (
          <Reveal key={highlight.id} delay={step(2 + index)}>
            <Card
              className={
                highlight.href
                  ? "relative transition-colors hover:border-foreground/30"
                  : undefined
              }
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">
                  {highlight.href ? (
                    /* Stretched so the whole card is the click target. */
                    <a href={highlight.href} className="after:absolute after:inset-0">
                      {highlight.name}
                    </a>
                  ) : (
                    highlight.name
                  )}
                </h3>
                {highlight.stage ? <Badge>{highlight.stage}</Badge> : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {highlight.description}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
