# CarportItalia — static export

**Generated output. Do not edit the files in this folder by hand.** Every change belongs in the source app; this folder is replaced wholesale on each re-export.

| | |
| --- | --- |
| Source repo | `occhinog/sun-roof-solutions` (private) |
| Exported commit | `c8e645a` — 2026-09-10 |
| Stack | Lovable · TanStack Start (React 19, Tailwind 4), prerendered to static HTML |
| Public URL | https://progetti.occhino.it/carportitalia/ |

Seven routes are prerendered to their own `index.html`: `/`, `/soluzioni`, `/tecnologia`, `/specifiche`, `/progetti`, `/processo`, `/contatti`. The pages hydrate into a client-side router, so navigation after first load never hits the network. The contact form is client-only — it sets a "sent" state and posts nowhere.

## Re-exporting after a change in Lovable

The app is a TanStack Start SSR project and cannot run on GitHub Pages as built. Four build-only changes turn it into a static bundle for this subpath. They are **not** committed to the source repo — Lovable syncs that branch, and pushing them would break its preview.

```sh
git clone git@github.com:occhinog/sun-roof-solutions.git && cd sun-roof-solutions
npm install
```

1. `vite.config.ts` — pass `vite: { base: "/carportitalia/" }`, `nitro: false`, and under `tanstackStart` add `prerender: { enabled: true, crawlLinks: true, autoSubfolderIndex: true, failOnError: true }` plus a `pages` entry per route. Drop the `server: { entry: "server" }` line.
2. Delete `src/server.ts`. It is picked up by filename convention and its `{ fetch }` shape makes the prerender preview server return 500 on every page (`server.fetch is not a function`).
3. `src/router.tsx` — add `basepath: "/carportitalia"` to `createRouter`.
4. `src/routes/__root.tsx` — point the favicon at `/carportitalia/favicon.ico` and add `{ name: "robots", content: "noindex, nofollow" }` to the head meta, matching the rest of progetti.

```sh
npm run build          # look for "[prerender] Prerendered 14 pages"
rm dist/client/robots.txt
```

Then replace this folder's contents with `dist/client/` (keeping this README) and commit to `parent`.

`nitro: false` is what makes prerendering work: with nitro on, it consumes `dist/server` before the prerender server can import it. Asset filenames are content-hashed, so a re-export changes them — copy the whole folder rather than merging into it.
