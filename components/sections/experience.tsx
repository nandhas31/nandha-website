import { CompanyLogo } from "@/components/company-logo";
import { FloatingIcon } from "@/components/floating-icon";
import { Reveal } from "@/components/reveal";
import { Card, Section, step } from "@/components/section";
import { currentRole, internships } from "@/lib/site-data";

function CurrentRole() {
  return (
    <Card className="mt-10 flex items-center gap-5 p-6">
      <FloatingIcon index={0}>
        <CompanyLogo role={currentRole} size="lg" />
      </FloatingIcon>
      <div>
        <h3 className="text-lg font-semibold">{currentRole.company}</h3>
        <p className="text-sm text-muted-foreground">{currentRole.date}</p>
        {currentRole.link && (
          <p className="mt-2 text-sm text-muted-foreground">
            Currently building{" "}
            <a
              href={currentRole.link.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
            >
              {currentRole.link.label}
            </a>
            .
          </p>
        )}
      </div>
    </Card>
  );
}

export function Experience() {
  return (
    <Section id="experience" label="Professional Experience" title="Where I've worked">
      <Reveal delay={step(2)}>
        <CurrentRole />
      </Reveal>

      <Reveal delay={step(3)}>
        <h3 className="mt-12 text-lg font-semibold">Internships</h3>
      </Reveal>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {internships.map((role, index) => (
          <Reveal key={role.company} delay={step(4 + index)}>
            <Card className="relative overflow-hidden">
              <div className="pointer-events-none absolute top-1/2 right-6 -translate-y-1/2 opacity-90">
                <FloatingIcon index={index}>
                  <CompanyLogo role={role} />
                </FloatingIcon>
              </div>
              <div className="pr-16">
                <h4 className="font-semibold">{role.company}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{role.date}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
