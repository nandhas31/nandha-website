import { Container, Eyebrow, step } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/site-data";

export function Hero() {
  return (
    <section id="home" className="flex min-h-screen flex-col justify-center">
      <Container>
        <Reveal>
          <Eyebrow>Hello, I&apos;m</Eyebrow>
        </Reveal>
        <Reveal delay={step(1)}>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold tracking-tight sm:text-6xl">
            {profile.name}
          </h1>
        </Reveal>
        <Reveal delay={step(2)}>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            {profile.tagline}
          </p>
        </Reveal>
        <Reveal delay={step(3)}>
          <div className="mt-8">
            <Button
              size="lg"
              nativeButton={false}
              render={<a href="#experience">Learn more about me</a>}
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
