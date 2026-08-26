import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Small uppercase chip, used for ship-stage labels like alpha and beta. */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-border px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-muted-foreground uppercase",
        className
      )}
    >
      {children}
    </span>
  );
}
