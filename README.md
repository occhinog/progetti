# progetti.occhino.it

A static hub that lists standalone web projects. The whole site sits behind a password gate; the hub page renders one button per project, and each project lives in its own folder served as a subpath.

Live at **https://progetti.occhino.it/**

## How it works

`index.html` at the root is now the **login page**, not the hub — see [Access control](#access-control). Once authenticated, `hub.html` loads `projects.js` and generates the button grid at runtime — one `<a>` per array entry, each opening in a new tab. There is no build step, no framework, and no dependencies. What is committed is what is served.

```
/                    site root
├── index.html       login page — password gate, sets the auth cookie
├── hub.html          hero + button grid (former index.html; buttons injected by inline script)
├── auth.js           shared auth module — every gated page loads this
├── projects.js       THE registry — the only file to edit when adding a project
├── css.css           styles for index.html and hub.html
├── hero.jpg           background image, index.html + hub.html
├── CNAME             progetti.occhino.it
│
├── elezioni18/       ─┐
├── elezioni23/        ├── project folders — gated, otherwise self-contained
└── TenMStudio/       ─┘
```

## Access control

Every page on the site — the hub and every project folder — is gated behind a password, via `auth.js` at the repo root.

**This is a client-side deterrent, not real access control.** There is no backend on GitHub Pages. The password check and the cookie logic are visible to anyone who views source or opens dev tools. It keeps casual visitors and search crawlers out; it does not stop a determined person. Treat it the same way as HelioH2's `auth.js` — same pattern, same limitation.

How it works:

- `index.html` shows a password form. A correct password sets a `progetti_auth` cookie (24h expiry, `path=/`) and redirects onward.
- Every other page loads `/auth.js` **synchronously as the first tag in `<head>`**, immediately followed by `ProgettiAuth.requireAuth();`. This blocks the page from rendering until the cookie is checked — an unauthenticated visitor is redirected to the login page before any protected content paints (no flash).
- `requireAuth()` remembers the page the visitor was trying to reach (`?redirect=`) and `index.html` sends them back there after a successful login. Redirect targets are validated as same-site relative paths only, to prevent open-redirect abuse via a crafted `?redirect=` link.
- The password is date-based, generated fresh every day (`validatePassword` in `auth.js`, same pattern as HelioH2's), and uses a fixed order: two capital-letter peer initials (`GO`, `DR` or `MM`), then a literal `$`, then the current year with its digits reversed, then the current day zero-padded to 2 digits. 9 characters total. Example for 2026-08-06, peer `GO`: `GO$620206`.
- It was simplified from an earlier 10-character scheme that accepted any of `! # % & @ $` plus a dot in any order after the initials. Fixed order and a single special character make it typeable from memory; as the deterrent note above says, the entropy was never doing the work.

**Adding auth to a new project:** put this as the very first two tags inside `<head>`, before anything else:

```html
<script src="/auth.js"></script>
<script>ProgettiAuth.requireAuth();</script>
```

## Adding a project

1. **Create a folder** at the repo root named in `camelCase` (see Conventions). It must contain an `index.html` — that is the entry point the button links to.
2. **Gate it.** Add these as the first two tags in `<head>`, before anything else loads (see [Access control](#access-control)):

   ```html
   <script src="/auth.js"></script>
   <script>ProgettiAuth.requireAuth();</script>
   ```

3. **Register it** in `projects.js`:

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

4. **Commit to `parent`** and push. That is all — the hub picks the project up automatically.

Nothing else needs touching. Do not add markup for the button to `hub.html`; the buttons are generated.

## Conventions

- **Folder names use descriptive mixed case** — `TenMStudio`, `nuovoProgetto`. `elezioni18` and `elezioni23` predate this rule and stay as they are; do not rename them, their URLs are public.
- **Projects are self-contained, with one exception: `auth.js`.** Each folder carries its own CSS, JS, images and fonts, and must never reference the root `css.css` or `hero.jpg`. The one sanctioned shared dependency is `/auth.js` for the password gate — every project loads it via absolute path. The root, in turn, never reaches into a project folder.
- **Relative paths inside projects.** Reference a project's own assets as `styles.css`, not `/styles.css` — a leading slash resolves to the domain root, not the project folder, and will break. `/auth.js` is the deliberate exception, since it must resolve to the root regardless of the project's folder depth.
- **A project can no longer be opened standalone via `file://`.** Because `requireAuth()` needs `/auth.js` and reads/writes a cookie, a project only works when served over `http(s)://` — from GitHub Pages, or a local static server (e.g. `python3 -m http.server`) run from the repo root.
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
