# nandha-website

Personal site. Built with vinext, deployed to Cloudflare Workers.

## Structure

- `app/` routes: the page, the root layout, and `/llms.txt`.
- `components/sections/` one file per page section; `app/page.tsx` just composes them.
- `components/` shared building blocks (`section.tsx` holds the layout primitives).
- `lib/site-data.ts` every fact on the site, in one place.
- `lib/site-markdown.ts` renders that same data as markdown for `/llms.txt`.

Adding a section means adding it to `SECTIONS` in `lib/site-data.ts`, writing the
component in `components/sections/`, and rendering it in `app/page.tsx`. The nav
picks it up from `SECTIONS`.

## Scripts

- `pnpm run dev` starts the vinext dev server.
- `pnpm run build` builds the Cloudflare Worker output.
- `pnpm run start` starts the built Worker locally with Wrangler.
- `pnpm run deploy` deploys the Cloudflare Worker.
