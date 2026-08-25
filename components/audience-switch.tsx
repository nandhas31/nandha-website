"use client";

import { Bot, User } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { AgentView } from "@/components/agent-view";
import { cn } from "@/lib/utils";

type Audience = "human" | "agent";

const options: { value: Audience; label: string; icon: ReactNode; hint: string }[] = [
  {
    value: "human",
    label: "Human",
    icon: <User className="size-4" />,
    hint: "The page you're on",
  },
  {
    value: "agent",
    label: "Agent",
    icon: <Bot className="size-4" />,
    hint: "Same content as markdown",
  },
];

export function AudienceSwitch({
  children,
  markdown,
  markdownPath,
}: {
  children: ReactNode;
  markdown: string;
  markdownPath: string;
}) {
  const [audience, setAudience] = useState<Audience>("human");

  // Let `?view=agent` link straight into the agent view.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("view") === "agent") {
      setAudience("agent");
    }
  }, []);

  const select = (value: Audience) => {
    if (value === audience) return;
    setAudience(value);

    const url = new URL(window.location.href);
    if (value === "agent") {
      url.searchParams.set("view", "agent");
    } else {
      url.searchParams.delete("view");
    }
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Bottom padding keeps the last of the content clear of the fixed switcher. */}
      <div className="pb-28">
        {audience === "human" ? (
          children
        ) : (
          <AgentView markdown={markdown} markdownPath={markdownPath} />
        )}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-card/80 py-1.5 pr-1.5 pl-2 shadow-lg shadow-black/5 backdrop-blur-md sm:gap-3 sm:pl-4">
          <p className="hidden text-xs font-medium tracking-wide text-muted-foreground uppercase sm:block">
            Who&apos;s reading this?
          </p>
          <div
            role="radiogroup"
            aria-label="Who's reading this?"
            className="flex items-center gap-1"
          >
            {options.map((option) => {
              const active = audience === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  title={option.hint}
                  onClick={() => select(option.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {option.icon}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
