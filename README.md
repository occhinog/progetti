# progetti.occhino.it

A static hub that lists standalone web projects. The hub page renders one button per project, and each project lives in its own folder served as a subpath. The site is public — see [No access control](#no-access-control).

Live at **https://progetti.occhino.it/**

## How it works

`index.html` at the root is a landing page with a single link through to the hub. `hub.html` loads `projects.js` and generates the button grid at runtime — one `<a>` per array entry, each opening in a new tab. There is no build step, no framework, and no dependencies. What is committed is what is served.

```
/                    site root
├── index.html        landing page — hero + one "Entra" link into the hub
├── hub.html          hero + button grid (buttons injected by inline script)
├── projects.js       THE registry — the only file to edit when adding a project
├── css.css           styles for index.html and hub.html
├── hero.jpg          background image, index.html + hub.html
├── robots.txt        Disallow: / — keeps the site out of search engines
├── CNAME             progetti.occhino.it
│
├── elezioni18/       ─┐
├── elezioni23/        │
├── businessai/        ├── project folders — self-contained
├── finance/          ─┘
└── docs/             loose Markdown / XLSX / PDF, not registered in projects.js
```

## No access control

The site is public. Every page, every project folder and every file under `docs/` is served to anyone who requests it.

Until 2026-09-10 the root carried an `auth.js` password gate that every page loaded. It was removed because it never worked: GitHub Pages delivers the full page before any browser-side check runs, so `curl https://progetti.occhino.it/businessai/index.html` returned the whole page with no password, and the repository is public regardless. Password strength was never the issue — a client-side check cannot gate a static host, and neither would browser-side Google SSO. Only an edge that refuses to serve the bytes can (Cloudflare Pages + Cloudflare Access), which would mean moving the `occhino.it` zone to Cloudflare and making this repo private. That was considered and deliberately not done.

What is in place instead:

- `robots.txt` at the root with `User-agent: *` / `Disallow: /`.
- `<meta name="robots" content="noindex, nofollow">` in the `<head>` of all 22 HTML pages.

The two are not additive: a URL blocked by `Disallow:` is never fetched, so its `noindex` is never read. If a URL ever does appear in a search index, drop the `Disallow` first so the `noindex` can be seen, then restore it once the URL has fallen out.

**Do not commit anything confidential here. Unlisted is not private.**

## Adding a project

1. **Create a folder** at the repo root named in `camelCase` (see Conventions). It must contain an `index.html` — that is the entry point the button links to.
2. **Register it** in `projects.js`:

   ```js
   const projects = [
       { name: "Elezioni2018", link: "elezioni18/" },
       { name: "Elezioni2023", link: "elezioni23/" },
       { name: "TEN.M Studio", link: "TenMStudio/" }
   ];
   ```

   | Field  | Meaning                                                        |
   | ------ | -------------------------------------------------------------- |
   | `name` | Button label on the hub page. Free text, shown verbatim.          |
   | `link` | Folder path, **with trailing slash**. Resolves to its `index.html`. |

3. **Commit to `parent`** and push. That is all — the hub picks the project up automatically.

Nothing else needs touching. Do not add markup for the button to `hub.html`; the buttons are generated.

## Conventions

- **Folder names use descriptive mixed case** — `TenMStudio`, `nuovoProgetto`. `elezioni18` and `elezioni23` predate this rule and stay as they are; do not rename them, their URLs are public.
- **Projects are fully self-contained.** Each folder carries its own CSS, JS, images and fonts, and must never reference the root `css.css` or `hero.jpg`. The root, in turn, never reaches into a project folder. There is no shared root dependency any more.
- **Relative paths inside projects.** Reference a project's own assets as `styles.css`, not `/styles.css` — a leading slash resolves to the domain root, not the project folder, and will break.
- **A project can be opened standalone via `file://`.** Nothing depends on a root-absolute script, so opening a project's `index.html` straight from Finder works. A local static server (`python3 -m http.server` from the repo root) is still the way to test root-relative links.
- **Add `<meta name="robots" content="noindex, nofollow">` to every new page**, matching the rest of the site.
- **External CDNs are fine** (Google Fonts is used by the hub and by `TenMStudio`). There is no bundler to vendor them.
- **Folder name is the public URL.** Renaming a folder breaks any existing link to it, so pick the name before the first push.

## Deployment

GitHub Pages, configured as:

| Setting      | Value                             |
| ------------ | --------------------------------- |
| Repository   | `occhinog/progetti`               |
| Branch       | `parent` ← *not* `main`           |
| Path         | `/` (repo root)                   |
| Domain       | `progetti.occhino.it` (via `CNAME`) |
| HTTPS        | Enforced                          |
| Build        | Legacy (Jekyll)                   |

Pushing to `parent` publishes. The rebuild usually lands within a minute or two.

**Because the build is Jekyll-based:** files and folders whose names start with `_` or `.` are excluded from the published site. Avoid those prefixes in project folders. If a project ever needs them, add an empty `.nojekyll` file at the repo root to serve the tree verbatim.

**Do not delete `CNAME`.** It is what binds the custom domain; losing it drops the site back to the `github.io` URL and invalidates the certificate.

## Notes

- Project folders can be large (`elezioni18` and `elezioni23` are ~5–8 MB each, mostly images and fonts). Assets are committed directly — there is no LFS or external asset host.
- The hub page is intentionally minimal. Styling changes to it go in `css.css`; the design tokens are the CSS custom properties under `:root` (copper/cream/dark palette, Playfair Display + Lato).
