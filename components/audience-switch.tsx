"use client";

import { Bot, User, type LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { AgentView } from "@/components/agent-view";
import { cn } from "@/lib/utils";

type Audience = "human" | "agent";

/** Query param that deep-links straight into the agent view. */
const VIEW_PARAM = "view";

const OPTIONS: { value: Audience; label: string; Icon: LucideIcon; hint: string }[] = [
  { value: "human", label: "Human", Icon: User, hint: "The page you're on" },
  { value: "agent", label: "Agent", Icon: Bot, hint: "Same content as markdown" },
];

/** Keeps `?view=agent` and the selected audience in step, in both directions. */
function useAudience() {
  const [audience, setAudience] = useState<Audience>("human");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get(VIEW_PARAM) === "agent") {
      setAudience("agent");
    }
  }, []);

  const select = (value: Audience) => {
    if (value === audience) return;
    setAudience(value);

    const url = new URL(window.location.href);
    if (value === "agent") {
      url.searchParams.set(VIEW_PARAM, "agent");
    } else {
      url.searchParams.delete(VIEW_PARAM);
    }
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { audience, select };
}

function AudienceToggle({
  audience,
  onSelect,
}: {
  audience: Audience;
  onSelect: (value: Audience) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-card/80 py-1.5 pr-1.5 pl-2 shadow-lg shadow-black/5 backdrop-blur-md sm:gap-3 sm:pl-4">
        <p
          id="audience-switch-label"
          className="hidden text-xs font-medium tracking-wide text-muted-foreground uppercase sm:block"
        >
          Who&apos;s reading this?
        </p>
        {/* Toggle buttons rather than radios: `role="radio"` would owe the reader
            arrow-key navigation, which two buttons do not need. */}
        <div
          role="group"
          aria-labelledby="audience-switch-label"
          aria-label="Who's reading this?"
          className="flex items-center gap-1"
        >
          {OPTIONS.map(({ value, label, Icon, hint }) => {
            const active = audience === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                title={hint}
                onClick={() => onSelect(value)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AudienceSwitch({
  children,
  markdown,
  markdownPath,
}: {
  children: ReactNode;
  markdown: string;
  markdownPath: string;
}) {
  const { audience, select } = useAudience();

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

      <AudienceToggle audience={audience} onSelect={select} />
    </>
  );
}
