"use client";

import { ArrowUpRight, Check, Copy, Download, FileText } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { MarkdownSource } from "@/components/markdown-source";
import { Container, Eyebrow, SectionTitle } from "@/components/section";
import { Button } from "@/components/ui/button";

const FILENAME = "nandha-sundaravadivel.md";
const COPIED_RESET_MS = 2000;

/** Reports a successful copy for a couple of seconds, then resets itself. */
function useCopyToClipboard(text: string) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Without this the timer fires into an unmounted component when the reader
  // flips back to the human view mid-countdown.
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      timer.current = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      setCopied(false);
    }
  };

  return { copied, copy };
}

/** The absolute URL of the markdown file, once we're in the browser and know the origin. */
function useAbsoluteUrl(path: string) {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return `${origin}${path}`;
}

function FileHeader({
  bytes,
  markdownPath,
  copied,
  onCopy,
}: {
  bytes: number;
  markdownPath: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
      <FileText className="size-4 shrink-0 text-muted-foreground" />
      <span className="font-mono text-xs font-medium">{FILENAME}</span>
      <span className="font-mono text-xs text-muted-foreground">
        {bytes.toLocaleString()} B
      </span>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="xs" onClick={onCopy}>
          {copied ? <Check className="text-emerald-600" /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button
          variant="ghost"
          size="xs"
          nativeButton={false}
          render={
            <a href={markdownPath} download={FILENAME}>
              <Download />
              Download
            </a>
          }
        />
        <Button
          variant="ghost"
          size="xs"
          nativeButton={false}
          render={
            <a href={markdownPath} target="_blank" rel="noreferrer">
              Raw
              <ArrowUpRight />
            </a>
          }
        />
      </div>
    </div>
  );
}

export function AgentView({
  markdown,
  markdownPath,
}: {
  markdown: string;
  markdownPath: string;
}) {
  const { copied, copy } = useCopyToClipboard(markdown);
  const absoluteUrl = useAbsoluteUrl(markdownPath);
  const bytes = useMemo(() => new TextEncoder().encode(markdown).length, [markdown]);

  return (
    <Container className="py-24 sm:py-32">
      <Eyebrow>Agent view</Eyebrow>
      <SectionTitle>This page, as markdown</SectionTitle>
      <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
        Every fact on this site, in one plain-text document. Copy it, download it, or
        fetch it directly, with no JavaScript or DOM parsing required.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        <FileHeader
          bytes={bytes}
          markdownPath={markdownPath}
          copied={copied}
          onCopy={copy}
        />
        <MarkdownSource markdown={markdown} />
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-muted/30">
        <p className="border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground">
          Or fetch it
        </p>
        <pre className="overflow-x-auto px-4 py-3 font-mono text-xs leading-5">
          <code>
            <span className="text-emerald-700 dark:text-emerald-400">curl</span>
            {` -s ${absoluteUrl}`}
          </code>
        </pre>
      </div>
    </Container>
  );
}
