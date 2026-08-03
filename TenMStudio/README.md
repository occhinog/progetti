# TEN/M

A dependency-free, responsive site for TEN/M, sharing one `styles.css` and `script.js` across two landing pages:

- **`index.html`** — Startup Studio. Two routes in: idea validation through VibeWell, or a founder programme for people without a market-ready idea.
- **`business-studio.html`** — Business Studio. AI operating transformation for existing companies, via BusinessWell.

Each page cross-links to the other (header nav + hero switch-link). Open either file in any modern browser, or deploy the folder to static hosting.

## Edit points

- Copy and sections per page: `index.html`, `business-studio.html`
- Visual system and breakpoints (shared): `styles.css` — business-page-specific rules are scoped under `.business-page`
- Menu, route switching, motion, demo form state (shared): `script.js` — branches on `document.body.classList.contains('business-page')` where the two pages diverge

The forms currently show an on-page confirmation only; connect the submit handler in `script.js` to an inbox, CRM, or form endpoint before going live.
