"use client";

import type { ReactNode } from "react";

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g;

/** Lightweight markdown token coloring, enough to read as a source file, no parser needed. */
function inlineTokens(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE_PATTERN).map((part, index) => {
    const key = `${keyPrefix}-${index}`;

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={key} className="font-semibold text-foreground">
          {part}
        </span>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <span key={key} className="text-emerald-700 dark:text-emerald-400">
          {part}
        </span>
      );
    }

    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        <span key={key}>
          <span className="text-foreground">[{link[1]}]</span>
          <span className="text-sky-700 dark:text-sky-400">({link[2]})</span>
        </span>
      );
    }

    return <span key={key}>{part}</span>;
  });
}

function line(text: string, index: number): ReactNode {
  const key = `line-${index}`;

  if (text.startsWith("#")) {
    const hashes = /^#+/.exec(text)?.[0] ?? "";
    return (
      <>
        <span className="text-violet-700 dark:text-violet-400">{hashes}</span>
        <span className="font-semibold text-foreground">
          {inlineTokens(text.slice(hashes.length), key)}
        </span>
      </>
    );
  }

  if (text.startsWith(">")) {
    return (
      <span className="text-muted-foreground italic">
        <span className="text-violet-700 not-italic dark:text-violet-400">&gt;</span>
        {inlineTokens(text.slice(1), key)}
      </span>
    );
  }

  if (text.startsWith("- ")) {
    return (
      <>
        <span className="text-amber-700 dark:text-amber-400">- </span>
        {inlineTokens(text.slice(2), key)}
      </>
    );
  }

  if (text.startsWith("|")) {
    return <span className="text-muted-foreground">{inlineTokens(text, key)}</span>;
  }

  return inlineTokens(text, key);
}

export function MarkdownSource({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  const gutterWidth = String(lines.length).length;

  return (
    <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6 sm:px-5">
      <code>
        {lines.map((text, index) => (
          <span key={index} className="grid grid-cols-[auto_1fr] gap-4">
            <span
              aria-hidden
              className="select-none text-right text-muted-foreground/40"
              style={{ width: `${gutterWidth}ch` }}
            >
              {index + 1}
            </span>
            <span className="whitespace-pre-wrap break-words text-muted-foreground">
              {line(text, index)}
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}
