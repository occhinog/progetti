# Bisplot — brand system canvas export

**The `*.dc.html` artboards and `support.js` are generated output. Do not edit them by hand** — a re-export from the Claude Design canvas replaces them wholesale. `index.html`, `7_Business_Model.html`, `8_Funnels.html` and this README are hand-written and must survive a re-export.

| | |
| --- | --- |
| Source | Claude Design canvas, exported to `~/Desktop/Bisplot` on `mcmn` |
| Exported | 2026-09-13 |
| Stack | `.dc.html` artboards rendered client-side by `support.js` (Claude Design canvas runtime) |
| Public URL | https://progetti.occhino.it/bisplot/ |

Seven artboards, each a standalone page linked from `index.html`:

| File | Sheet |
| --- | --- |
| `1_Brand_Whole_System.dc.html` | One company, four brands — the whole system |
| `2_Brand_Bisplot.dc.html` | The holding, applied |
| `3_Brand_SmartAI.dc.html` | SAI.wiki — open education arm |
| `4_Brand_BusinessAI.dc.html` | BusinessAI.academy — paid arm |
| `5_Brand_HouseOfVibes.dc.html` | HouseOfVibes — venture building arm |
| `5b_Brand_HouseOfVibes_Samaritan.dc.html` | HouseOfVibes × Samaritan unified mark |
| `6_Mascotte.dc.html` | Milo, Mila, Semino |

One hand-written sheet sits alongside them, outside the canvas export:

| File | Sheet |
| --- | --- |
| `7_Business_Model.html` | How the group earns — revenue streams, cost base, invoicing entity |
| `8_Funnels.html` | How people move — one funnel per brand, every rate tied to a stated base |

They continue the numbering but deliberately carry no `.dc.` segment, so a re-export cannot overwrite them. Both are styled by hand to match the canvas sheets and depend on neither `support.js` nor `_ds/`.

`8_Funnels.html` records one open conflict: sheet 3 publishes an *Attestato di partecipazione* that SAI does not issue. Correcting it needs a canvas re-export.

## Two hard dependencies

1. **`.nojekyll` at the repo root.** The artboards load their CSS and JS from `_ds/`, and GitHub Pages' Jekyll build drops any path starting with `_`. Without that file, sheets 1, 2, 3, 5b and 6 render unstyled on the live site while looking correct locally. `_ds/` holds two design systems — `sai-ten-m-…` (1, 2, 3, 6) and `samaritan-…` (5b) — and the files inside are `_`-prefixed too, so renaming the folder is not a fix.
2. **Internet at page load.** `support.js` fetches React 18, ReactDOM and Babel standalone from `unpkg.com` before it boots. Offline, the pages stay blank.

## Not copied from the export

The source folder holds more than what is published here:

- `Brainstorming_Archived.dc.html` — archived exploration, deliberately not published.
- `uploads/hov.png`, `uploads/spritesheet.webp` — referenced only by that archived sheet (3.8 MB).
- `uploads/smartaiMasterLogo.png`, `uploads/sai-logo.png`, `uploads/sai-logo-white.png` — not referenced by any published sheet.

A re-export brings all of these back; drop them again unless a published sheet has started using them.

## Re-exporting

1. Export the canvas over `~/Desktop/Bisplot` as before.
2. Copy the seven artboards, `support.js`, `_ds/` and only the referenced `uploads/` into this folder, leaving `index.html`, `7_Business_Model.html`, `8_Funnels.html` and this README in place.
3. If an artboard was added, removed or retitled, update the card grid in `index.html` by hand — the cards are static markup, not generated.
4. Commit to `parent`.

The artboards carry no `<meta name="robots">`; the root `robots.txt` `Disallow: /` covers them. Re-adding the tag after each export is optional and gets overwritten anyway.
