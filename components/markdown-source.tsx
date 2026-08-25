import type { ReactNode } from "react";

/** Splits a line into bold / link / code spans, keeping the delimiters visible. */
const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g;
const LINK_PATTERN = /^\[([^\]]+)\]\(([^)]+)\)$/;
const HEADING_PATTERN = /^#+/;

const TOKEN_CLASS = {
  bold: "font-semibold text-foreground",
  code: "text-emerald-700 dark:text-emerald-400",
  marker: "text-violet-700 dark:text-violet-400",
  bullet: "text-amber-700 dark:text-amber-400",
  url: "text-sky-700 dark:text-sky-400",
};

/** Lightweight markdown token coloring, enough to read as a source file, no parser needed. */
function InlineTokens({ text }: { text: string }): ReactNode {
  return text.split(INLINE_PATTERN).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={index} className={TOKEN_CLASS.bold}>
          {part}
        </span>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <span key={index} className={TOKEN_CLASS.code}>
          {part}
        </span>
      );
    }

    const link = LINK_PATTERN.exec(part);
    if (link) {
      return (
        <span key={index}>
          <span className="text-foreground">[{link[1]}]</span>
          <span className={TOKEN_CLASS.url}>({link[2]})</span>
        </span>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function MarkdownLine({ text }: { text: string }): ReactNode {
  if (text.startsWith("#")) {
    const hashes = HEADING_PATTERN.exec(text)?.[0] ?? "";
    return (
      <>
        <span className={TOKEN_CLASS.marker}>{hashes}</span>
        <span className={TOKEN_CLASS.bold}>
          <InlineTokens text={text.slice(hashes.length)} />
        </span>
      </>
    );
  }

  if (text.startsWith(">")) {
    return (
      <span className="text-muted-foreground italic">
        <span className={`not-italic ${TOKEN_CLASS.marker}`}>&gt;</span>
        <InlineTokens text={text.slice(1)} />
      </span>
    );
  }

  if (text.startsWith("- ")) {
    return (
      <>
        <span className={TOKEN_CLASS.bullet}>- </span>
        <InlineTokens text={text.slice(2)} />
      </>
    );
  }

  if (text.startsWith("|")) {
    return (
      <span className="text-muted-foreground">
        <InlineTokens text={text} />
      </span>
    );
  }

  return <InlineTokens text={text} />;
}

/** Renders markdown the way an editor would: line numbers, monospace, syntax tints. */
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
              <MarkdownLine text={text} />
            </span>
          </span>
        ))}
      </code>
    </pre>
  );
}
