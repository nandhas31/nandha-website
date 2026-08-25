"use client";

import { ArrowUpRight, Check, Copy, Download, FileText } from "lucide-react";
import { useEffect, useState } from "react";

import { MarkdownSource } from "@/components/markdown-source";
import { Button } from "@/components/ui/button";

const FILENAME = "nandha-sundaravadivel.md";

export function AgentView({
  markdown,
  markdownPath,
}: {
  markdown: string;
  markdownPath: string;
}) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const bytes = new TextEncoder().encode(markdown).length;

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-24 sm:py-32">
      <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
        Agent view
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        This page, as markdown
      </h2>
      <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
        Every fact on this site, in one plain-text document. Copy it, download it, or
        fetch it directly, with no JavaScript or DOM parsing required.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <span className="font-mono text-xs font-medium">{FILENAME}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {bytes.toLocaleString()} B
          </span>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="xs" onClick={copy}>
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

        <MarkdownSource markdown={markdown} />
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-muted/30">
        <p className="border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground">
          Or fetch it
        </p>
        <pre className="overflow-x-auto px-4 py-3 font-mono text-xs leading-5">
          <code>
            <span className="text-emerald-700 dark:text-emerald-400">curl</span>
            {` -s ${origin}${markdownPath}`}
          </code>
        </pre>
      </div>
    </div>
  );
}
