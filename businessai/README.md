# SMARTAI — businessai.academy · Option B

Standalone, dependency-free alternative for the SMARTAI institutional website. Option B uses an editorial manifesto homepage and moves Academy, companies, pro bono and activities into dedicated pages. It is intentionally separate from the current local build.

No Git repository, remote, deployment, DNS or server configuration is included.

## Local preview

From this directory:

```bash
python3 -m http.server 8767 --bind 127.0.0.1
```

Open `http://127.0.0.1:8767/`.

Run the structural and local-link validator:

```bash
node scripts/validate.mjs
```

## Editorial direction

- Main thesis: **“Non ti serve un altro prompt. Ti serve un sistema.”**
- The homepage is a manifesto and routing surface, not a catalogue.
- Impact comes from monumental typography, the approved indigo/black system and real workshop photography.
- July uses documentary photography. September uses a typographic poster until September photography exists.
- Claims describe method and documented activity; no invented dates, prices or performance results are used.
- Mila supports the Guides identity and is not the primary SMARTAI brand.

## Route map

| Local route | Intended public URL | Purpose |
|---|---|---|
| `/` | `https://businessai.academy/` | Manifesto, page introductions and activity highlights |
| `/academy/` | `https://businessai.academy/academy/` | Six-module Academy and recurring foundation day |
| `/aziende/` | `https://businessai.academy/aziende/` | Company training and adoption paths |
| `/pro-bono/` | `https://businessai.academy/pro-bono/` | Educational and social-impact programme |
| `/attivita/` | `https://businessai.academy/attivita/` | Activity hub and archive policy |
| `/contatti/` | `https://businessai.academy/contatti/` | Contact routes, team and partnerships |
| `/guides/` | `https://guides.businessai.academy/` | Technical publication homepage |
| `/guides/codex-cli-server/` | `https://guides.businessai.academy/codex-cli-server/` | Codex CLI on macOS/Linux and remote server via SSH |
| `/guides/second-brain/` | `https://guides.businessai.academy/second-brain/` | Markdown knowledge system |
| `/guides/mcp/` | `https://guides.businessai.academy/mcp/` | MCP boundaries and permissions |
| `/guides/automazioni/` | `https://guides.businessai.academy/automazioni/` | Controlled automation method |
| `/jul26/` | `https://jul26.businessai.academy/` | July archive |
| `/jul26/deck/` | `https://jul26.businessai.academy/deck/` | July deck |
| `/sep26/` | `https://sep26.businessai.academy/` | September campaign, later archive |

Links with `data-local-href` keep cross-host navigation usable on localhost.

The homepage retains the anchor IDs `#academy`, `#aziende`, `#impatto`, `#guide` and `#attivita` for compatibility, while primary navigation uses the dedicated routes.

## Guides protocol

Guides are procedures aimed at a named user and outcome. The intended article structure is:

1. problem and expected result;
2. tested environment and prerequisites;
3. commands or actions;
4. verification criteria;
5. common failures and risks;
6. rollback;
7. maintenance and last-checked date.

The Codex CLI article distinguishes the machine running the CLI, repository and tools from the model service. “On your own server” does **not** mean a self-hosted OpenAI model. Official installation and headless-authentication sources were checked on 17 August 2026, but the full flow still needs an end-to-end test on the target server before publication as a definitive procedure.

## Future host mapping

- `businessai.academy` serves the project root.
- `www.businessai.academy` should permanently redirect to the apex while preserving path and query.
- `guides.businessai.academy`, `jul26.businessai.academy` and `sep26.businessai.academy` map page requests to their matching folders.
- Folder routing alone is insufficient: every subdomain must alias `/assets/*` and the three favicon files to the project root before resolving page files.
- Each subdomain serves its folder-specific `robots.txt` and `sitemap.xml` at host root.

No DNS, TLS, redirects or deployment changes are part of this build.

## Content boundaries

- SMARTAI is the public brand; `businessai.academy` is the canonical domain.
- Academy prices, total duration and unconfirmed dates are omitted.
- `smartai@threshlds.co` is a provisional operational address pending a domain email decision.
- September operational details remain delegated to Luma until confirmed.
- July survey, feedback, donation, payment and personal-data routes are not linked.
- No forms, analytics, cookies, trackers or local storage are used.

## Source and isolation

Option B was copied from `/Users/gabriel/Progetti/businessai-academy` and developed independently. The original SMARTAI repository remained a read-only source and was not modified. The current local site was not overwritten; only its reported footer aspect-ratio bug was fixed separately by adding `height: auto` to the footer logo rule.

Source assets include the approved SMARTAI raster marks, Mila with its license note, team headshots and real photographs from the Torino workshop on 4 July 2026. Confirm all participant-photo and headshot rights before publication.

## Pre-publication checklist

1. Confirm the legal operator and mandatory footer disclosures.
2. Confirm the public email address.
3. Confirm team descriptions with the three people named.
4. Confirm photograph and headshot reuse rights.
5. Recheck September logistics and every Luma destination.
6. End-to-end test the Codex CLI guide on its declared macOS and Linux targets.
7. Configure canonical hosts, TLS, `www` redirect and shared-asset aliases.
8. Run responsive, keyboard, accessibility and external-link checks on production hosts.
