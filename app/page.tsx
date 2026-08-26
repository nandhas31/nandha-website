import { AudienceSwitch } from "@/components/audience-switch";
import { SectionNav } from "@/components/section-nav";
import { Contact } from "@/components/sections/contact";
import { EducationSection } from "@/components/sections/education";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Highlights } from "@/components/sections/highlights";
import { MARKDOWN_PATH } from "@/lib/site-data";
import { siteMarkdown } from "@/lib/site-markdown";

export default function Home() {
  return (
    <main className="min-h-screen">
      <AudienceSwitch markdown={siteMarkdown()} markdownPath={MARKDOWN_PATH}>
        <SectionNav />
        <Hero />
        <Experience />
        <EducationSection />
        <Highlights />
        <Contact />
      </AudienceSwitch>
    </main>
  );
}
