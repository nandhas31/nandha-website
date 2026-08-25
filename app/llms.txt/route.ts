import { siteMarkdown } from "@/lib/site-markdown";

/** Plain-text markdown view of the site, for agents and other non-browser readers. */
export function GET() {
  return new Response(siteMarkdown(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
