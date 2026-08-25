"use client";

import { useSyncExternalStore } from "react";

interface ScrollState {
  /** Vertical scroll offset in pixels. */
  y: number;
  /** How far down the page we are, from 0 at the top to 1 at the bottom. */
  progress: number;
}

/**
 * One scroll listener for the whole page, shared by every subscriber.
 * Each component mounting its own listener meant N listeners and N rAF loops
 * for what is really a single piece of state.
 */
const INITIAL: ScrollState = { y: 0, progress: 0 };

let state = INITIAL;
let frame = 0;
const subscribers = new Set<() => void>();

function measure(): ScrollState {
  const y = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0;
  return { y, progress };
}

function publish() {
  frame = 0;
  state = measure();
  subscribers.forEach((notify) => notify());
}

function onScroll() {
  // Coalesce a burst of scroll events into one measurement per frame.
  if (frame) return;
  frame = requestAnimationFrame(publish);
}

function subscribe(notify: () => void) {
  if (subscribers.size === 0) {
    state = measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }
  subscribers.add(notify);

  return () => {
    subscribers.delete(notify);
    if (subscribers.size > 0) return;

    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    cancelAnimationFrame(frame);
    frame = 0;
    state = INITIAL;
  };
}

/** Subscribes to the shared scroll state. Server-renders as the top of the page. */
export function useScroll(): ScrollState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => INITIAL
  );
}
