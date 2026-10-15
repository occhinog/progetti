# Bisplot — landing page

Single-page site for Bisplot — operational consulting and process engineering for SMEs: clear procedures, ongoing on-site support, and automation that runs in the background. React 19 + TypeScript + Tailwind CSS 3, built with Vite into **one self-contained `index.html`** — JS and CSS inlined — because this repo has no build step: what is committed is what GitHub Pages serves.

| | |
| --- | --- |
| Public URL | https://progetti.occhino.it/bisplot/ |
| Served file | `index.html` (generated — do not edit by hand) |
| Source | `app/` |
| Runtime network | Google Fonts only (Plus Jakarta Sans, Inter, JetBrains Mono). Offline it falls back to system fonts. |

Until 2026-10-15 this folder held the Bisplot Brand System (Claude Design canvas export). It was replaced by this site; the old files are in git history at commit `2772c72`.

## Layout

```
bisplot/
├── index.html        BUILD OUTPUT — regenerate, never hand-edit
├── README.md
└── app/              Vite project (source of truth)
    ├── index.html    dev template: <head> meta, fonts, favicon, noindex
    ├── tailwind.config.ts   design tokens (colours, fonts, radii)
    ├── vite.config.ts       outDir '..' + vite-plugin-singlefile
    └── src/
        ├── config.ts        form endpoint + privacy / legal URLs  ← edit before production
        ├── App.tsx
        └── components/      Navbar, Hero, PhilosophySection, BrainSection,
                             CaseStudiesSection, MethodSection, SupportSection,
                             ContactSection, Footer, Logo, SectionHeader
```

## Build

```sh
cd bisplot/app
npm install
npm run dev       # local dev server
npm run build     # typecheck, then writes ../index.html
```

`vite.config.ts` writes to the parent folder with `emptyOutDir: false` — that folder also contains `app/`, so never switch it to `true`. Commit the regenerated `bisplot/index.html` together with the source change.

## Before real use

Three values in `app/src/config.ts` are still at their staging defaults:

| Setting | Default | Effect |
| --- | --- | --- |
| `contactEndpoint` | `''` | **Demo mode.** The "diagnosi operativa" form validates and shows the success screen, but sends nothing (a console notice says so). Set a URL that accepts a JSON POST `{ name, email, procedure }` — e.g. a Formspree endpoint. |
| `privacyUrl` | `'#'` | Target of the footer "Privacy" link. Point it at the privacy policy. |
| `legalNotesUrl` | `'#'` | Target of the footer "Note legali" link (company details). |

The form collects names and email addresses, so it needs a privacy notice before it goes live. The page also shows no company details (registered name, VAT number) yet.

## Content integrity (from the brief — takes precedence)

- **No invented metrics.** No result figures (hours saved, percentages, reduced times, ROI) unless the client has supplied them.
- **Case studies are real clients only** (`CaseStudiesSection.tsx`): client, sector and services actually delivered are verified; the context is descriptive; no measured results. Each case carries a `// [DA CONFERMARE: eventuale metrica di risultato — in attesa di validazione cliente]` marker — search for `DA CONFERMARE` to find every placeholder to complete once a client validates a figure.
- Client links open in a new tab with `rel="noopener noreferrer"`. Centro Servizi Negri currently points to a Vercel preview URL (`nuovo-sito-…-hg-matts-projects.vercel.app`): swap in the definitive domain when it is live.
- Sober, engineering tone: no marketing superlatives.

## Design rules (from the brief)

- Positioning: Bisplot is not a software product. No fake dashboards, UI screenshots or generic charts.
- Light canvas (`canvas-white`, `canvas-subtle`), text in `ink-900` / `ink-500`, 1px hairlines (`border-border-light`). `canvas-muted`, `border-focus` and `signal-error` are functional extras for form focus and validation.
- Terracotta `#D96B43` is reserved for the logo and the primary contact buttons (plus the mono 01–04 phase numbers in "Come lavoriamo", as specified).
- Radii: 4px badges, 8px inputs/buttons, 12px cards. No pill shapes.
- All copy is the client's wording — change it only on request.
- Icons: `lucide-react`, used sparingly.
- Logo: `Logo.tsx` holds the monogram as inline SVG — a geometric redraw of the master artwork (331 × 424 units: grid-aligned straight edges, parallel 45° cuts, elliptical bowls, constant 13.5-unit gap; ≥99% pixel overlap with the source PNG). Structure `#0A1118`, lower bowl `#D96B43`. The favicon in `app/index.html` is the same mark as a data URI. The wordmark is live text in Plus Jakarta Sans Bold.

## Business Second Brain (`BrainSection.tsx`)

The one dark band on the page (`#cervello`, ink-900): an interactive animation of a company's operating "brain" — six departments (Finance, Operations, Marketing, Knowledge, HR, Sales) around an AI core that carries the Bisplot mark.

- **Story (~18 s, then a loop).** 01 Frammentazione: departments drift in disorder, data goes nowhere, the core is dormant · 02 Connessione: the core wakes, pulls the departments into formation and reaches out to each with a spark-led connection · 03 Intelligenza: ignition — white/ember flash, a shockwave that lights the grid and each department as it passes, then result comets fly out and each result types itself in · 04 Automazione: continuous flow, department-to-department links, a synchronised heartbeat every 6 s.
- **Interaction.** Cursor light and parallax on the particle field (particles move away from the pointer and orbit the core once it wakes); hover, focus or tap a department for its link, result and a round trip; click the core for a pulse to every department; stepper to jump phases; Pausa / Ricomincia.
- **Layers.** A `<canvas>` underneath draws the light (pre-rendered dot grid, particles, bloom, shockwave, comet-trailed packets with additive blending), edge-faded with a CSS mask. The SVG on top holds the structure and text — crisp, focusable, accessible. Terracotta appears only as the core's ember glow (the logo's colour) and in the logo.
- **Cost.** One `requestAnimationFrame` loop; ~1 ms JS + ~1 ms style/layout per frame measured in Chrome. It starts when the scene's top reaches the upper ~65% of the viewport and stops whenever the scene is off screen. `prefers-reduced-motion` draws the finished scene statically.
- **Tuning.** Department content, phase captions and the choreography timings are constants at the top of the file; `WIDE` (≥ 960px of scene width) and `TALL` layouts each define home and "chaos" positions per department.

## Build provenance

The committed `index.html` was produced in a sandbox without npm access, using an equivalent pipeline: Tailwind 3.4.17 standalone CLI with the same config, the same sources bundled by Bun (React 19.2.8, lucide 1.57.0 icon geometry), inlined into one file the way `vite-plugin-singlefile` does. Typecheck passed under TypeScript 6.0. The first `npm run build` replaces it with Vite's output; the page should look identical.
