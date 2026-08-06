# TEN/M

A dependency-free, responsive landing page. It presents two routes into the studio: a live [VibeWell](https://vibe-well.vercel.app) market pre-check for product ideas, and a founder programme for people without a market-ready idea. Open `index.html` in any modern browser or deploy the folder to static hosting.

## Edit points

- Copy and sections per page: `index.html`, `startup-studio.html`, `business-studio.html`
- Visual system and breakpoints (shared): `styles.css` — business-page-specific rules are scoped under `.business-page`
- Menu, route switching, motion, demo form state (shared): `script.js` — branches on `document.body.classList.contains('business-page')` where the two pages diverge
- Images: `assets/` — `well.webp` is the wishing-well art from the VibeWell home page, positioned in the VibeWell card by the `--well-w` variable on `.vibe-link`; `business-well.webp` is its amber watermill counterpart, positioned in the BusinessWell card by `--mill-w` on `.businesswell-panel`. Both are 560×741 with a transparent background, so the same size knobs and breakpoints apply.

The forms currently show an on-page confirmation only; connect the submit handler in `script.js` to an inbox, CRM, or form endpoint before going live.
