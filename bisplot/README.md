# Bisplot — landing page

Single-page site for Bisplot (data systems and AI tools for SMEs). React 19 + TypeScript + Tailwind CSS 3, built with Vite into **one self-contained `index.html`** — JS and CSS inlined — because this repo has no build step: what is committed is what GitHub Pages serves.

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
        ├── config.ts        form endpoint + privacy URL  ← edit before production
        ├── App.tsx
        └── components/      Navbar, Hero, ProblemSection, SolutionsSection,
                             HumanFactorSection, MethodSection, ContactSection,
                             Footer, Logo, SectionHeader
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

Two values in `app/src/config.ts` are still at their staging defaults:

| Setting | Default | Effect |
| --- | --- | --- |
| `contactEndpoint` | `''` | **Demo mode.** The "diagnosi operativa" form validates and shows the success screen, but sends nothing (a console notice says so). Set a URL that accepts a JSON POST `{ name, email, message }` — e.g. a Formspree endpoint. |
| `privacyUrl` | `'#'` | Target of the footer "Privacy" link. Point it at the privacy policy. |

The form collects names and email addresses, so it needs a privacy notice before it goes live.

## Design rules (from the brief)

- Light canvas (`canvas-white`, `canvas-subtle`, `canvas-muted`), text in `ink-900` / `ink-500`, 1px hairlines (`border-border-light`).
- Terracotta `#D96B43` is reserved for the logo and primary actions (plus the 01–03 numbers in "Cosa realizziamo", as specified).
- Radii: 4px badges, 8px inputs/buttons, 12px cards. No pill shapes.
- All copy is the client's wording — change it only on request.
- Icons: `lucide-react`. Logo: inline SVG in `Logo.tsx`; the favicon in `app/index.html` is the same mark as a data URI.

## Build provenance

The first committed `index.html` was produced in a sandbox without npm access, using an equivalent pipeline: Tailwind 3.4.17 standalone CLI with the same config, the same sources bundled by Bun (React 19.2.8, lucide 1.57.0 icon geometry), inlined into one file the way `vite-plugin-singlefile` does. Typecheck passed under TypeScript 6.0. The first `npm run build` replaces it with Vite's output; the page should look identical.
