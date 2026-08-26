"use client";

import { Button } from "@/components/ui/button";
import type { TestResult } from "@/lib/typing/types";

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div>
      <div className="font-mono text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-2xl font-semibold tabular-nums">{value}</div>
      {hint !== undefined && (
        <div className="font-mono text-xs text-muted-foreground">{hint}</div>
      )}
    </div>
  );
}

interface ResultsViewProps {
  result: TestResult;
  isPersonalBest: boolean;
  onRestart: () => void;
}

export function ResultsView({ result, isPersonalBest, onRestart }: ResultsViewProps) {
  const { config } = result;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">wpm</span>
            {isPersonalBest && (
              <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] tracking-wide text-secondary-foreground uppercase">
                personal best
              </span>
            )}
          </div>
          {/* The one hero figure on the screen. */}
          <div className="font-mono text-6xl font-semibold tabular-nums">
            {Math.round(result.wpm)}
          </div>
        </div>

        <Stat label="accuracy" value={`${Math.round(result.accuracy)}%`} />
        <Stat label="consistency" value={`${Math.round(result.consistency)}%`} />
        <Stat label="raw" value={`${Math.round(result.rawWpm)}`} />
        <Stat
          label="characters"
          value={`${result.correctChars}/${result.incorrectChars}`}
          hint="correct / wrong"
        />
        <Stat
          label="test"
          value={config.mode === "time" ? `${config.amount}s` : `${config.amount} words`}
          hint={`${(result.durationMs / 1000).toFixed(1)}s elapsed`}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={onRestart}>Try again</Button>
        <span className="font-mono text-xs text-muted-foreground">
          or press <kbd className="rounded border border-border px-1">tab</kbd>
        </span>
      </div>
    </div>
  );
}
