"use client";

import { useSyncExternalStore } from "react";

import type { TestConfig, TestResult } from "./types";

const STORAGE_KEY = "nandha:typing:v1";
/** Enough history to plot a trend without letting the entry grow unbounded. */
const MAX_RESULTS = 50;

export interface StoredResult {
  mode: TestConfig["mode"];
  amount: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  timestamp: number;
}

interface HistoryState {
  results: StoredResult[];
  /**
   * Best WPM per mode, kept alongside the results rather than derived from
   * them: a personal best should not disappear because it aged out of the
   * capped list.
   */
  bests: Record<string, number>;
}

const EMPTY: HistoryState = { results: [], bests: {} };

export function modeKey(config: TestConfig): string {
  return `${config.mode}-${config.amount}`;
}

/**
 * Reading and writing storage both throw in private windows and in browsers
 * with site data blocked. Every access is guarded, and a failure degrades to an
 * in-memory session rather than taking the test down with it.
 */
function read(): HistoryState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return EMPTY;

    const parsed = JSON.parse(raw) as Partial<HistoryState>;
    return {
      results: Array.isArray(parsed.results) ? parsed.results : [],
      bests: typeof parsed.bests === "object" && parsed.bests !== null ? parsed.bests : {},
    };
  } catch {
    return EMPTY;
  }
}

let state: HistoryState = EMPTY;
let loaded = false;
const subscribers = new Set<() => void>();

function publish(next: HistoryState) {
  state = next;
  subscribers.forEach((notify) => notify());
}

function persist(next: HistoryState) {
  publish(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage is unavailable; `state` still holds the session's results.
  }
}

function subscribe(notify: () => void) {
  if (!loaded) {
    loaded = true;
    state = read();
  }
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
}

/**
 * Records a finished test. Returns whether it beat the stored best for its
 * mode, so the results screen can say so.
 */
export function saveResult(result: TestResult): boolean {
  if (!loaded) {
    loaded = true;
    state = read();
  }

  const key = modeKey(result.config);
  const previousBest = state.bests[key] ?? 0;
  const isBest = result.wpm > previousBest;

  const stored: StoredResult = {
    mode: result.config.mode,
    amount: result.config.amount,
    wpm: result.wpm,
    rawWpm: result.rawWpm,
    accuracy: result.accuracy,
    consistency: result.consistency,
    timestamp: result.timestamp,
  };

  persist({
    results: [stored, ...state.results].slice(0, MAX_RESULTS),
    bests: isBest ? { ...state.bests, [key]: result.wpm } : state.bests,
  });

  return isBest;
}

export function clearHistory(): void {
  publish(EMPTY);
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing persisted, so nothing to remove.
  }
}

/** Server-renders as empty; history is a browser-local fact. */
export function useHistory(): HistoryState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY
  );
}
