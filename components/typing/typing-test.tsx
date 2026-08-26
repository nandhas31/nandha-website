"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { clearHistory, modeKey, useHistory } from "@/lib/typing/storage";
import type { TestMode } from "@/lib/typing/types";
import { cn } from "@/lib/utils";

import { ModeBar } from "./mode-bar";
import { ResultsView } from "./results-view";
import { useTypingTest } from "./use-typing-test";
import { WordsView } from "./words-view";

export function TypingTest() {
  const [mode, setMode] = useState<TestMode>("time");
  const [amount, setAmount] = useState(30);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();

  const {
    config,
    words,
    typed,
    status,
    wordIndex,
    charIndex,
    liveWpm,
    progress,
    result,
    isPersonalBest,
    onKeyDown,
    restart,
  } = useTypingTest(mode, amount);

  const done = status === "done" && result !== null;

  // Return focus after a restart or a mode change, so the next test starts on a
  // keystroke rather than on a click. `preventScroll` keeps an auto-focus from
  // yanking the page around on load.
  useEffect(() => {
    if (!done) inputRef.current?.focus({ preventScroll: true });
  }, [done, words]);

  /**
   * The hidden input only exists while a test is in progress, so on the results
   * screen there is nothing to receive a keystroke. This listener owns the keys
   * that have to work regardless of what is focused: restart from the results
   * screen, and typing anywhere on the page to resume a blurred test.
   */
  useEffect(() => {
    function onWindowKeyDown(event: KeyboardEvent) {
      // The input handles its own keys; this is only for everything else.
      if (event.target === inputRef.current) return;

      if (event.key === "Tab" || event.key === "Escape") {
        event.preventDefault();
        restart();
        return;
      }

      if (done || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.length !== 1) return;
      inputRef.current?.focus({ preventScroll: true });
    }

    window.addEventListener("keydown", onWindowKeyDown);
    return () => window.removeEventListener("keydown", onWindowKeyDown);
  }, [done, restart]);

  function handleModeChange(nextMode: TestMode, nextAmount: number) {
    setMode(nextMode);
    setAmount(nextAmount);
    // Clicking a button moves focus to it. Re-clicking the current setting
    // changes no state, so the effect above would not fire to hand focus back.
    inputRef.current?.focus({ preventScroll: true });
  }

  const best = history.bests[modeKey(config)];

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <ModeBar mode={mode} amount={amount} onChange={handleModeChange} />
      </div>

      {done ? (
        <ResultsView result={result} isPersonalBest={isPersonalBest} onRestart={restart} />
      ) : (
        <div>
          <div className="mb-6 flex items-baseline justify-between px-2 pt-4 font-mono text-sm">
            <span className="text-3xl font-semibold tabular-nums">
              {mode === "time" ? progress : `${progress}/${amount}`}
            </span>
            <span
              className={cn(
                "tabular-nums transition-opacity",
                status === "running" ? "text-muted-foreground" : "opacity-0"
              )}
            >
              {Math.round(liveWpm)} wpm
            </span>
          </div>

          <div className="relative">
            <WordsView
              words={words}
              typed={typed}
              wordIndex={wordIndex}
              charIndex={charIndex}
              status={status}
              focused={focused}
            />

            {/* The input covers the words, so a click anywhere in the area starts typing. */}
            <input
              ref={inputRef}
              value=""
              onChange={() => {}}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="Typing test input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className="absolute inset-0 h-full w-full cursor-text opacity-0"
            />

            {!focused && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-sm text-muted-foreground">
                click or press any key to focus
              </div>
            )}
          </div>

          <div className="mt-3 text-center font-mono text-xs text-muted-foreground">
            <kbd className="rounded border border-border px-1">tab</kbd> restarts ·{" "}
            <kbd className="rounded border border-border px-1">ctrl</kbd> +{" "}
            <kbd className="rounded border border-border px-1">backspace</kbd> deletes a word
          </div>
        </div>
      )}

      {(best !== undefined || history.results.length > 0) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
          <span>
            {best !== undefined
              ? `best at ${config.mode === "time" ? `${config.amount}s` : `${config.amount} words`}: ${Math.round(best)} wpm`
              : "no result yet at this length"}
            {history.results.length > 0 && ` · ${history.results.length} saved locally`}
          </span>
          <Button size="xs" variant="ghost" onClick={clearHistory}>
            Clear history
          </Button>
        </div>
      )}
    </div>
  );
}
