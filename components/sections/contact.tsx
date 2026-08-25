import { Mail } from "lucide-react";
import type { ReactNode } from "react";

import { LinkedinIcon } from "@/components/icons/linkedin";
import { Reveal } from "@/components/reveal";
import { Section, step } from "@/components/section";
import { EMAIL, LINKEDIN_URL } from "@/lib/site-data";

function SocialLink({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
    >
      {children}
    </a>
  );
}

export function Contact() {
  return (
    <Section id="contact" label="Get in touch" title="Say hello">
      <Reveal delay={step(2)}>
        <div className="mt-8 flex items-center gap-4">
          <SocialLink href={`mailto:${EMAIL}`} label="Email">
            <Mail className="size-5" />
          </SocialLink>
          <SocialLink href={LINKEDIN_URL} label="LinkedIn" external>
            <LinkedinIcon className="size-5" />
          </SocialLink>
        </div>
      </Reveal>
    </Section>
  );
}
