import { GeorgiaTechLogo } from "@/components/icons/georgia-tech";
import { Reveal } from "@/components/reveal";
import { Card, Section, step } from "@/components/section";
import { education } from "@/lib/site-data";

export function EducationSection() {
  return (
    <Section id="education" label="Education" title="Academic background">
      <div className="mt-10 space-y-4">
        {education.map((entry, index) => (
          <Reveal key={entry.id} delay={step(2 + index)}>
            <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <GeorgiaTechLogo className="h-7 w-auto shrink-0 sm:h-8" />
              <div>
                <h3 className="font-semibold">{entry.school}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {entry.degree} · {entry.years}
                </p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
