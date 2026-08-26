/** The two ways a test can be bounded: by a clock, or by a word count. */
export type TestMode = "time" | "words";

export interface TestConfig {
  mode: TestMode;
  /** Seconds when `mode` is "time", words when `mode` is "words". */
  amount: number;
}

/**
 * One recorded keystroke. Every statistic is derived from the log after the
 * test rather than accumulated live, so adding a metric later means writing a
 * new pure function instead of threading another counter through the input
 * handler.
 */
export type TestEvent =
  | {
      type: "char";
      /** Milliseconds since the first keystroke. */
      testMs: number;
      /**
       * Judged at the moment the key was pressed. Going back and fixing a typo
       * does not heal it, which is what makes accuracy a measure of typing
       * rather than of editing.
       */
      correct: boolean;
    }
  | { type: "delete"; testMs: number };

export interface TestResult {
  config: TestConfig;
  /** Correct characters only, the headline number. */
  wpm: number;
  /** Every character, right or wrong. */
  rawWpm: number;
  /** Percentage, 0-100. */
  accuracy: number;
  /** Percentage, 0-100. Evenness of speed across the test. */
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  durationMs: number;
  /** Epoch milliseconds. */
  timestamp: number;
}
