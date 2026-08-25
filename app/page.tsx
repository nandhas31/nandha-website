import { Mail } from "lucide-react";
import type { ReactNode } from "react";

import { AudienceSwitch } from "@/components/audience-switch";
import { FloatingIcon } from "@/components/floating-icon";
import { AmazonIcon } from "@/components/icons/amazon";
import { GeorgiaTechLogo } from "@/components/icons/georgia-tech";
import { HubspotIcon } from "@/components/icons/hubspot";
import { LinkedinIcon } from "@/components/icons/linkedin";
import { SalesforceIcon } from "@/components/icons/salesforce";
import { UkgLogo } from "@/components/icons/ukg";
import { Reveal } from "@/components/reveal";
import { SectionNav } from "@/components/section-nav";
import { Button } from "@/components/ui/button";
import {
  AGENTFORCE_URL,
  EMAIL,
  LINKEDIN_URL,
  MARKDOWN_PATH,
  currentRole,
  education,
  internships,
  profile,
  projects,
} from "@/lib/site-data";
import { siteMarkdown } from "@/lib/site-markdown";

const SALESFORCE_COLOR = "#00A1E0";

const companyIcons: Record<string, ReactNode> = {
  Salesforce: <SalesforceIcon className="size-5" />,
  HubSpot: <HubspotIcon className="size-5" />,
  Amazon: <AmazonIcon className="size-5" />,
  UKG: <UkgLogo className="h-6 w-auto" />,
};

function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <AudienceSwitch markdown={siteMarkdown()} markdownPath={MARKDOWN_PATH}>
        <SectionNav />

        <section id="home" className="flex min-h-screen flex-col justify-center">
          <div className="mx-auto w-full max-w-4xl px-6">
            <Reveal>
              <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
                Hello, I&apos;m
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-4 max-w-2xl text-5xl font-semibold tracking-tight sm:text-6xl">
                {profile.name}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                {profile.tagline}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8">
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<a href="#experience">Learn more about me</a>}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <Section id="experience" label="Professional Experience">
          <Reveal delay={80}>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Where I&apos;ve worked
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-10 flex items-center gap-5 rounded-lg border border-border bg-card p-6">
              <FloatingIcon index={0}>
                <div
                  className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#00A1E0]/10"
                  style={{ color: SALESFORCE_COLOR }}
                >
                  <SalesforceIcon className="size-7" />
                </div>
              </FloatingIcon>
              <div>
                <h3 className="text-lg font-semibold">{currentRole.company}</h3>
                <p className="text-sm text-muted-foreground">{currentRole.date}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Currently building{" "}
                  <a
                    href={AGENTFORCE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                  >
                    {currentRole.link.label}
                  </a>
                  .
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <h3 className="mt-12 text-lg font-semibold">Internships</h3>
          </Reveal>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {internships.map((intern, index) => (
              <Reveal key={intern.company} delay={260 + index * 80}>
                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-5">
                  <div className="pointer-events-none absolute top-1/2 right-6 -translate-y-1/2 opacity-90">
                    <FloatingIcon index={index}>
                      {intern.color ? (
                        <div
                          className="flex size-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${intern.color}1A`, color: intern.color }}
                        >
                          {companyIcons[intern.company]}
                        </div>
                      ) : (
                        companyIcons[intern.company]
                      )}
                    </FloatingIcon>
                  </div>
                  <div className="pr-16">
                    <h4 className="font-semibold">{intern.company}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{intern.date}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="education" label="Education">
          <Reveal delay={80}>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Academic background
            </h2>
          </Reveal>
          <div className="mt-10 space-y-4">
            {education.map((entry, index) => (
              <Reveal key={entry.degree} delay={120 + index * 80}>
                <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center">
                  <GeorgiaTechLogo className="h-7 w-auto shrink-0 sm:h-8" />
                  <div>
                    <h3 className="font-semibold">{entry.school}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {entry.degree} · {entry.years}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="projects" label="Projects">
          <Reveal delay={80}>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Projects
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={index} delay={200 + index * 80}>
                <div className="rounded-lg border border-border bg-card p-5">
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        <Section id="contact" label="Get in touch">
          <Reveal delay={80}>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Say hello
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-8 flex items-center gap-4">
              <a
                href={`mailto:${EMAIL}`}
                aria-label="Email"
                className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
              >
                <Mail className="size-5" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
              >
                <LinkedinIcon className="size-5" />
              </a>
            </div>
          </Reveal>
        </Section>
      </AudienceSwitch>
    </main>
  );
}
