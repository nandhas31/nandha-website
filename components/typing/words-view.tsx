"use client";

import { Fragment, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import type { TestStatus } from "./use-typing-test";

/** One line in rem. The viewport shows three; the rest scrolls under them. */
const LINE_REM = 3;
const VISIBLE_LINES = 3;

interface WordProps {
  target: string;
  typed: string;
  active: boolean;
  /** Where the caret sits within this word. Only read when `active`. */
  caretIndex: number;
}

/**
 * Memoised because a keystroke changes exactly one word: without this every
 * word in the buffer re-renders on every character, which is a few hundred
 * nodes of work per keypress in a 120-second test.
 */
const Word = memo(function Word({ target, typed, active, caretIndex }: WordProps) {
  // Overtyping makes the rendered word longer than the target.
  const length = Math.max(target.length, typed.length);
  const chars: React.ReactNode[] = [];

  for (let index = 0; index < length; index++) {
    const expected = target[index];
    const actual = typed[index];
    const isCaret = active && (caretIndex === index || (caretIndex >= length && index === length - 1));

    chars.push(
      <span
        key={index}
        data-caret={isCaret ? (caretIndex >= length ? "after" : "before") : undefined}
        className={cn(
          actual === undefined && "text-muted-foreground/40",
          actual !== undefined && expected === undefined && "text-destructive/70 underline",
          actual !== undefined && expected !== undefined && actual === expected && "text-foreground",
          actual !== undefined && expected !== undefined && actual !== expected && "text-destructive"
        )}
      >
        {/* Overtyped characters have no target, so show what was actually hit. */}
        {expected ?? actual}
      </span>
    );
  }

  const submittedWrong = !active && typed.length > 0 && typed !== target;

  return (
    <span
      data-active={active || undefined}
      style={{ lineHeight: `${LINE_REM}rem` }}
      className={cn(
        "inline-block",
        submittedWrong && "underline decoration-destructive/60 decoration-2 underline-offset-4"
      )}
    >
      {chars}
    </span>
  );
});

interface CaretRect {
  left: number;
  top: number;
  height: number;
}

interface WordsViewProps {
  words: string[];
  typed: string[];
  wordIndex: number;
  charIndex: number;
  status: TestStatus;
  focused: boolean;
}

export function WordsView({
  words,
  typed,
  wordIndex,
  charIndex,
  status,
  focused,
}: WordsViewProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [caret, setCaret] = useState<CaretRect | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  // Re-wrapping on resize moves every word, so the caret has to be re-measured.
  const [resizeTick, setResizeTick] = useState(0);

  const measure = useCallback(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const anchor = inner.querySelector<HTMLElement>("[data-caret]");
    const activeWord = inner.querySelector<HTMLElement>("[data-active]");
    if (!anchor || !activeWord) return;

    const after = anchor.dataset.caret === "after";
    setCaret({
      left: anchor.offsetLeft + (after ? anchor.offsetWidth : 0),
      top: anchor.offsetTop,
      height: anchor.offsetHeight,
    });

    // Hold the active word on the second of the three visible lines, so there
    // is always a line of context behind and a line of runway ahead.
    const lineHeight = activeWord.offsetHeight;
    setScrollTop(Math.max(0, activeWord.offsetTop - lineHeight));
  }, []);

  useLayoutEffect(measure, [measure, words, typed, wordIndex, charIndex, resizeTick]);

  useEffect(() => {
    const onResize = () => setResizeTick((tick) => tick + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: `${LINE_REM * VISIBLE_LINES}rem` }}
    >
      <div
        ref={innerRef}
        aria-hidden
        className={cn(
          "relative px-2 font-mono text-2xl transition-[transform,filter,opacity] duration-150",
          // Enough to read as inactive, but not so much that a correct
          // character stops looking different from an untyped one.
          !focused && "opacity-60 blur-[2px]"
        )}
        style={{ transform: `translateY(-${scrollTop}px)` }}
      >
        {/*
          The space between words is a real text node rather than a margin.
          Adjacent inline-blocks with no whitespace between them give the
          browser no soft-wrap opportunity, so the buffer runs off in one
          unbreakable line instead of filling the three visible rows.
        */}
        {words.map((word, index) => (
          <Fragment key={index}>
            <Word
              target={word}
              typed={typed[index] ?? ""}
              active={index === wordIndex}
              caretIndex={charIndex}
            />{" "}
          </Fragment>
        ))}

        {caret !== null && (
          <span
            className={cn(
              "pointer-events-none absolute w-[2px] rounded-full bg-primary",
              "transition-[left,top] duration-75 ease-linear motion-reduce:transition-none",
              status !== "running" && "animate-pulse"
            )}
            style={{ left: caret.left, top: caret.top, height: caret.height }}
          />
        )}
      </div>
    </div>
  );
}
