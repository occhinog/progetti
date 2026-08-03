# progetti.occhino.it

A static hub that lists standalone web projects. The root page renders one button per project; each project lives in its own self-contained folder and is served as a subpath.

Live at **https://progetti.occhino.it/**

## How it works

The root `index.html` loads `projects.js`, then generates the button grid at runtime — one `<a>` per array entry, each opening in a new tab. There is no build step, no framework, and no dependencies. What is committed is what is served.

```
/                    hub page
├── index.html       hero + button grid (buttons injected by inline script)
├── projects.js      THE registry — the only file to edit when adding a project
├── css.css          styles for the hub page only
├── hero.jpg         hub background image
├── CNAME            progetti.occhino.it
│
├── elezioni18/      ─┐
├── elezioni23/       ├── project folders, each fully self-contained
└── startupStudio/   ─┘
```

## Adding a project

1. **Create a folder** at the repo root named in `camelCase` (see Conventions). It must contain an `index.html` — that is the entry point the button links to.
2. **Register it** in `projects.js`:

   ```js
   const projects = [
       { name: "Elezioni2018", link: "elezioni18/" },
       { name: "Elezioni2023", link: "elezioni23/" },
       { name: "TEN_M Studio", link: "startupStudio/" }
   ];
   ```

   | Field  | Meaning                                                        |
   | ------ | -------------------------------------------------------------- |
   | `name` | Button label on the hub page. Free text, shown verbatim.          |
   | `link` | Folder path, **with trailing slash**. Resolves to its `index.html`. |

3. **Commit to `parent`** and push. That is all — the hub picks the project up automatically.

Nothing else needs touching. Do not add markup for the button to `index.html`; the buttons are generated.

## Conventions

- **Folder names use `camelCase`** — `startupStudio`, `nuovoProgetto`. `elezioni18` and `elezioni23` predate this rule and stay as they are; do not rename them, their URLs are public.
- **Projects are self-contained.** Each folder carries its own CSS, JS, images and fonts. A project must never reference the root `css.css` or `hero.jpg`, and the root must never reference files inside a project folder. This keeps projects independently movable and lets them use conflicting styles.
- **Relative paths inside projects.** Reference assets as `styles.css`, not `/styles.css` — a leading slash resolves to the domain root, not the project folder, and will break.
- **External CDNs are fine** (Google Fonts is used by the hub and by `startupStudio`). There is no bundler to vendor them.
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
