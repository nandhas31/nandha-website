import type { TestConfig, TestEvent, TestResult } from "./types";

/**
 * Typing speed has always been defined against a five-character "word" rather
 * than real words, so that a test on short words is comparable to one on long
 * words.
 */
const CHARS_PER_WORD = 5;

export function wpm(chars: number, ms: number): number {
  if (ms <= 0) return 0;
  return chars / CHARS_PER_WORD / (ms / 60000);
}

/**
 * Turns raw-speed samples into a 0-100 evenness score.
 *
 * The input is the coefficient of variation (standard deviation over mean),
 * which lives in [0, infinity); the output has to be a percentage. The mapping
 * is `1 - tanh(x + x^3/3 + x^5/5)`: the polynomial is the leading part of the
 * artanh series, so the curve tracks the identity function for the small
 * variation a real test produces and only saturates once the samples are wild.
 * A flat, metronomic test approaches 100; one with long pauses approaches 0.
 */
function consistency(samples: number[]): number {
  if (samples.length < 2) return 0;

  const mean = samples.reduce((total, value) => total + value, 0) / samples.length;
  if (mean <= 0) return 0;

  const variance =
    samples.reduce((total, value) => total + (value - mean) ** 2, 0) / samples.length;
  const cov = Math.sqrt(variance) / mean;

  return 100 * (1 - Math.tanh(cov + cov ** 3 / 3 + cov ** 5 / 5));
}

/**
 * Raw typing speed sampled once per elapsed second. Only consistency reads
 * this: it needs a spread of speeds over the test, not a single average.
 */
function rawPerSecond(events: TestEvent[], durationMs: number): number[] {
  const samples: number[] = [];
  const seconds = Math.max(1, Math.ceil(durationMs / 1000));

  for (let second = 1; second <= seconds; second++) {
    // The final bucket is usually a fraction of a second. Measuring it against
    // a full second would report a speed collapse that never happened.
    const windowStart = (second - 1) * 1000;
    const windowEnd = Math.min(second * 1000, durationMs);

    let charsInBucket = 0;
    for (const event of events) {
      if (event.type !== "char") continue;
      if (event.testMs > windowStart && event.testMs <= windowEnd) charsInBucket++;
    }

    samples.push(wpm(charsInBucket, windowEnd - windowStart));
  }

  return samples;
}

export function summarize(
  events: TestEvent[],
  config: TestConfig,
  durationMs: number,
  timestamp: number
): TestResult {
  let correctChars = 0;
  let incorrectChars = 0;

  for (const event of events) {
    if (event.type !== "char") continue;
    if (event.correct) correctChars++;
    else incorrectChars++;
  }

  const typedChars = correctChars + incorrectChars;
  const samples = rawPerSecond(events, durationMs);

  // A trailing partial second is a small sample of a short window, so it swings
  // far more than a real one and would dominate the variance.
  const wholeSeconds =
    durationMs % 1000 >= 500 || samples.length < 3 ? samples : samples.slice(0, -1);

  return {
    config,
    wpm: wpm(correctChars, durationMs),
    rawWpm: wpm(typedChars, durationMs),
    accuracy: typedChars === 0 ? 0 : (correctChars / typedChars) * 100,
    consistency: consistency(wholeSeconds),
    correctChars,
    incorrectChars,
    durationMs,
    timestamp,
  };
}
