import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

import { Container, Eyebrow, SectionTitle } from "@/components/section";
import { TypingTest } from "@/components/typing/typing-test";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { aiMonkey } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "aiMonkey",
  description: "A typing speed test. Results are saved in your browser.",
};

export default function TypePage() {
  return (
    <main className="flex min-h-screen flex-col justify-center py-16">
      <Container>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 mb-6 text-muted-foreground"
          nativeButton={false}
          render={
            <a href="/">
              <ArrowLeft />
              Home
            </a>
          }
        />
        <Eyebrow>Type</Eyebrow>
        <div className="flex items-center gap-3">
          <SectionTitle>{aiMonkey.name}</SectionTitle>
          {aiMonkey.stage ? <Badge className="mt-4">{aiMonkey.stage}</Badge> : null}
        </div>
        <div className="mt-10">
          <TypingTest />
        </div>
      </Container>
    </main>
  );
}
