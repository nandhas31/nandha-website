"use client";

import { Button } from "@/components/ui/button";
import type { TestMode } from "@/lib/typing/types";

/** Durations in seconds, and word counts. Both ladders match the genre. */
const AMOUNTS: Record<TestMode, number[]> = {
  time: [15, 30, 60, 120],
  words: [10, 25, 50, 100],
};

const MODES: { value: TestMode; label: string }[] = [
  { value: "time", label: "time" },
  { value: "words", label: "words" },
];

interface ModeBarProps {
  mode: TestMode;
  amount: number;
  onChange: (mode: TestMode, amount: number) => void;
}

export function ModeBar({ mode, amount, onChange }: ModeBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1 rounded-2xl border border-border bg-card px-2 py-1.5 font-mono text-xs">
      {MODES.map((option) => (
        <Button
          key={option.value}
          size="xs"
          variant={mode === option.value ? "secondary" : "ghost"}
          aria-pressed={mode === option.value}
          // Switching mode keeps the ladder's default rather than carrying over
          // an amount that means something else (30 seconds vs 30 words).
          onClick={() => onChange(option.value, AMOUNTS[option.value][1] as number)}
        >
          {option.label}
        </Button>
      ))}

      <span aria-hidden className="mx-1 h-4 w-px bg-border" />

      {AMOUNTS[mode].map((value) => (
        <Button
          key={value}
          size="xs"
          variant={amount === value ? "secondary" : "ghost"}
          aria-pressed={amount === value}
          aria-label={mode === "time" ? `${value} seconds` : `${value} words`}
          onClick={() => onChange(mode, value)}
        >
          {value}
        </Button>
      ))}
    </div>
  );
}
