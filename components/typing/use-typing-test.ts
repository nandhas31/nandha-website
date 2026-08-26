"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { summarize, wpm } from "@/lib/typing/stats";
import { saveResult } from "@/lib/typing/storage";
import type { TestConfig, TestEvent, TestMode, TestResult } from "@/lib/typing/types";
import { TIME_MODE_BUFFER, generateWords } from "@/lib/typing/words";

export type TestStatus = "idle" | "running" | "done";

/** Typing past the end of a word is allowed, but not indefinitely. */
const MAX_EXTRA_CHARS = 10;
/** Fast enough for the live counters to feel continuous, slow enough to be free. */
const TICK_MS = 100;

function wordBudget(config: TestConfig): number {
  // A timed test has no natural word count, so it generates a buffer deep
  // enough that nobody reaches the end of it.
  return config.mode === "time" ? TIME_MODE_BUFFER : config.amount;
}

export function useTypingTest(mode: TestMode, amount: number) {
  const config = useMemo<TestConfig>(() => ({ mode, amount }), [mode, amount]);

  /**
   * Deliberately empty for the first render. Word generation is random, so
   * doing it during render gives the server one set of words and hydration a
   * different set, which React rejects as a mismatch. The mount effect below
   * fills them in on the client, where randomness is safe.
   */
  const [words, setWords] = useState<string[]>([]);
  const [typed, setTyped] = useState<string[]>([""]);
  const [status, setStatus] = useState<TestStatus>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState<TestResult | null>(null);
  const [isPersonalBest, setIsPersonalBest] = useState(false);

  /**
   * `typed` is mirrored into a ref because the key handlers read the previous
   * value before writing the next one. Reading it from render scope would risk
   * dropping a keystroke whenever two land inside one render.
   */
  const typedRef = useRef<string[]>([""]);
  const eventsRef = useRef<TestEvent[]>([]);
  const startRef = useRef<number | null>(null);
  const statusRef = useRef<TestStatus>("idle");

  const commit = useCallback((next: string[]) => {
    typedRef.current = next;
    setTyped(next);
  }, []);

  const setPhase = useCallback((next: TestStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  /** Milliseconds since the first keystroke; 0 before the clock starts. */
  const elapsed = useCallback(
    () => (startRef.current === null ? 0 : performance.now() - startRef.current),
    []
  );

  const begin = useCallback(() => {
    if (startRef.current !== null) return;
    startRef.current = performance.now();
    setPhase("running");
  }, [setPhase]);

  const finish = useCallback(
    (durationMs: number) => {
      if (statusRef.current === "done") return;
      setPhase("done");

      const summary = summarize(eventsRef.current, config, durationMs, Date.now());
      setResult(summary);
      setIsPersonalBest(saveResult(summary));
    },
    [config, setPhase]
  );

  const restart = useCallback(() => {
    eventsRef.current = [];
    startRef.current = null;
    typedRef.current = [""];
    statusRef.current = "idle";

    setWords(generateWords(wordBudget(config)));
    setTyped([""]);
    setStatus("idle");
    setElapsedMs(0);
    setResult(null);
    setIsPersonalBest(false);
  }, [config]);

  /**
   * Generates the first set of words on mount, and starts a fresh test whenever
   * the mode changes: a half-finished test under new rules is meaningless.
   */
  useEffect(() => {
    restart();
  }, [restart]);

  useEffect(() => {
    if (status !== "running") return;

    const id = window.setInterval(() => {
      const ms = elapsed();
      if (config.mode === "time" && ms >= config.amount * 1000) {
        const exact = config.amount * 1000;
        setElapsedMs(exact);
        // The clock, not the last keystroke, defines a timed test's duration.
        finish(exact);
        return;
      }
      setElapsedMs(ms);
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [status, config, elapsed, finish]);

  const insertChar = useCallback(
    (char: string) => {
      const current = typedRef.current;
      const index = current.length - 1;
      const typedWord = current[index] ?? "";
      const target = words[index] ?? "";

      if (typedWord.length >= target.length + MAX_EXTRA_CHARS) return;

      begin();
      const testMs = elapsed();
      // Characters past the end of the target word have no counterpart, so
      // `target[i]` is undefined and they count as errors.
      eventsRef.current.push({
        type: "char",
        testMs,
        correct: char === target[typedWord.length],
      });

      const next = [...current];
      next[index] = typedWord + char;
      commit(next);

      const isLastWord = index === words.length - 1;
      if (config.mode === "words" && isLastWord && next[index].length === target.length) {
        finish(testMs);
      }
    },
    [words, config.mode, begin, elapsed, commit, finish]
  );

  const submitWord = useCallback(() => {
    const current = typedRef.current;
    const index = current.length - 1;
    const typedWord = current[index] ?? "";

    // A space before any letter is a no-op rather than an empty word.
    if (typedWord.length === 0) return;

    begin();
    const testMs = elapsed();
    const target = words[index] ?? "";
    // The space counts as a character, and it is correct only if the word it
    // closes was typed exactly.
    eventsRef.current.push({ type: "char", testMs, correct: typedWord === target });

    if (config.mode === "words" && index === words.length - 1) {
      finish(testMs);
      return;
    }

    commit([...current, ""]);
  }, [words, config.mode, begin, elapsed, commit, finish]);

  const deleteChar = useCallback(
    (wholeWord: boolean) => {
      const current = typedRef.current;
      const index = current.length - 1;
      const typedWord = current[index] ?? "";
      const started = startRef.current !== null;

      if (typedWord.length === 0) {
        if (index === 0) return;
        // Stepping back is for fixing a word you got wrong. A word already
        // typed correctly stays closed, so backspace cannot rewind the test.
        if ((current[index - 1] ?? "") === words[index - 1]) return;
        if (started) eventsRef.current.push({ type: "delete", testMs: elapsed() });
        commit(current.slice(0, index));
        return;
      }

      if (started) eventsRef.current.push({ type: "delete", testMs: elapsed() });
      const next = [...current];
      next[index] = wholeWord ? "" : typedWord.slice(0, -1);
      commit(next);
    },
    [words, elapsed, commit]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;

      // Tab restarts, which means it cannot also move focus.
      if (key === "Tab" || key === "Escape") {
        event.preventDefault();
        restart();
        return;
      }

      if (statusRef.current === "done") return;

      if (key === "Backspace") {
        event.preventDefault();
        deleteChar(event.ctrlKey || event.altKey);
        return;
      }

      // Leave browser and OS shortcuts alone.
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (key === " ") {
        event.preventDefault();
        submitWord();
        return;
      }

      // Everything else with a one-character name is printable; named keys
      // like "Shift" or "ArrowLeft" are not.
      if (key.length !== 1) return;
      event.preventDefault();
      insertChar(key);
    },
    [restart, deleteChar, submitWord, insertChar]
  );

  const wordIndex = typed.length - 1;
  const charIndex = (typed[wordIndex] ?? "").length;

  const liveWpm = useMemo(() => {
    let correct = 0;
    for (const event of eventsRef.current) {
      if (event.type === "char" && event.correct) correct++;
    }
    return wpm(correct, elapsedMs);
  }, [elapsedMs]);

  /** Counts down in time mode and up in words mode, matching what is bounded. */
  const progress =
    config.mode === "time"
      ? Math.max(0, Math.ceil(config.amount - elapsedMs / 1000))
      : Math.min(wordIndex + 1, config.amount);

  return {
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
  };
}
