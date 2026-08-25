import { Reveal } from "@/components/reveal";
import { Card, Section, step } from "@/components/section";
import { projects } from "@/lib/site-data";

export function Projects() {
  return (
    <Section id="projects" label="Projects" title="Projects">
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {projects.map((project, index) => (
          <Reveal key={project.id} delay={step(2 + index)}>
            <Card>
              <h3 className="font-semibold">{project.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {project.description}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
