# Samaritan Design System

The **Samaritan Framework** — the dark, red, scanlined machine-interface style
built for HelioH₂ and used on its contacts page, lifted out of that one page
and made reusable.

The name is the user's own: the source file opens with the comment
`HelioH₂ - Samaritan Interface v2.0`. It is a *style*, not a company brand —
an interface that behaves like a surveillance system talking to you. It sits on
top of, and deliberately in opposition to, the HelioH₂ marketing brand (light,
blue/green/yellow, rounded, shadowed), which is preserved here only as a
migration reference.

---

## 1. Sources

Everything in this system was read from two mounted local folders. No Figma
file, screenshot, deck or published site was used.

| Source | Role |
|---|---|
| `contatti/index.html` | The one Samaritan-styled page. Entry point of the read. |
| `j/contatti.css` (918 lines) | The Samaritan layer proper. Imports `stile.css`. |
| `j/stile.css` (2364 lines) | Global stylesheet: the `--contatti-*` token block plus the legacy marketing brand. Imports `fonts.css`. |
| `j/fonts.css` | Seven Google Font families, `@import`ed. No local binaries. |
| `j/contatti.js` (89 lines) | Boot choreography, typewriter, panel switching, periodic glitch. |

Live page the source renders: `https://www.helioh2.com/w/contatti/`
Company in the copy: HelioH₂ S.r.l., Moncalieri (TO), Italy — solar and hydrogen.

Other files in `j/` (`keynote.*`, `solartools.*`, `tool.*`, `parking.*`,
`rooftop.*`, `simulatore.*`, `groundplants.*`, `auth.*`, `policies.css`,
`underconstruction.css`, the `*-fetch.js` helpers, `structure.js`,
`zone-analysis.js`) are **not** part of this system. They belong to other
themes in the same repo (`--keynote-*`, `--tool-*`, `--solartools-*`) and were
left alone. `structure.js` and `policies.css` were only checked for Samaritan
references; there are none.

### Not available

The `s/` directory was not mounted, so no image, favicon or font binary could
be copied. See `assets/README.md` for the full list of referenced-but-missing
files. **No logo exists in the source and none has been drawn** — the mark is
type. Wherever a logo would go, the wordmark goes.

---

## 2. Content fundamentals

The system speaks like a machine that has already made up its mind.

**Language.** Italian (`lang="it"`), with English left untranslated in the
security chrome. `SESSION ENCRYPTED` sits next to `SISTEMA SICURO` in the same
footer, and that inconsistency is authentic — keep it. Body copy, labels and
data are Italian; the two English strings are `SESSION ENCRYPTED` and
`HELIOH₂ SYSTEM v2.0`.

**Person.** The system addresses the user directly and informally — *tu*, not
*Lei*: `BENVENUTO, COSA STAI CERCANDO?`. The system never says "I" and never
says "we". There is no first person anywhere. It does not offer help, it asks
what you want and then produces a record.

**Case.** Two registers, and never a third:
- **Chrome, labels, actions, status → UPPERCASE, tracked, unpunctuated.**
  `SISTEMA ATTIVO` · `CONNESSIONE SICURA` · `ACCESSO CONCESSO` ·
  `PARTITA IVA` · `DIRETTORE ESECUTIVO`
- **Data, names, values → sentence case, verbatim.**
  `Banca Sella S.p.A.` · `Società a Responsabilità Limitata` ·
  `strada delle Finanze 19 bis`

Classification words are authored in sentence case (`Classificato`,
`Verificato`, `Riservato`) and uppercased by CSS. Write them sentence case.

**Labels are nouns, not verbs.** `Dati di Fatturazione`, not "Vedi i dati".
`Organizzazione`, not "Scopri il team". The one verb in the whole interface is
`Indietro` (back).

**Status vocabulary.** Adjectives and past participles, always affirmative:
`ATTIVO / ATTIVI`, `VERIFICATA`, `CONCESSO`, `SICURA`, `IN CORSO`,
`CRITTOGRAFATA`. Nothing is ever "pending", "loading" or "please wait".

**Classification vocabulary.** Three levels, escalating with intimacy of the
data: `Classificato` (billing), `Verificato` (public contacts), `Riservato`
(people). Pick the word that matches how private the panel feels.

**Numbers.** Menu indices are zero-padded and bracketed: `[ 01 ]`, `[ 02 ]`.
Time is `HH:MM:SS`, live, from `toTimeString().slice(0,8)`. Dates are
`dd/mm/yyyy` via `toLocaleDateString('it-IT')`. Identifiers are never
abbreviated or spaced for readability: `IT43Q0326822300052916125810`.

**No emoji, ever, in the Samaritan layer.** (The legacy marketing layer does
use them — `.biz-card-image.emoji` at `3rem` and a `✓` bullet in
`.help-features` — which is one more reason the two layers must not mix.)

**Punctuation.** No exclamation marks. One question mark, in the one question.
Arrows are unicode glyphs in the text — `→` `←` `▸` `◂` — never icons.

**Length.** One line per statement. The boot log is four lines and a verdict.
The question is a single line, centred, and does not wrap gracefully.

---

## 3. Visual foundations

### Colour

Three ideas: near-black surfaces, a cold blue-grey text ramp, one arterial red.
Green appears exactly twice, both times as a verified state.

- **Surfaces** `#05050a` void · `rgba(5,5,10,.92)` scrim · `#0a0a10` card ·
  `#0f0f16` card hover. All carry a faint blue-violet cast; none is neutral grey.
- **Text** `#ededf0` → `#b8b8c8` → `#9999b3` → `#8a8a9e` → `#82829a`. Never
  `#fff`. The ramp is cool at every step.
- **Red, four separate jobs.** `#c01010` for *fills and borders only*.
  `#ff6b6b` for *all red type and links*. `rgba(192,16,16,.12)` for the hover
  wash. `#e02020` reserved for alarm. Putting `#c01010` on type is the single
  easiest way to break the system.
- **Green** `#157a3a`, status words only.
- **Two hairline greys**, `#181820` resting and `#252530` active. Every
  division in the layout is one of these two at 1px.

Maximum one accent per surface. There are no gradients anywhere except two
functional ones: the fading brand rule and the vignette.

### Type

Two faces, no third.

- **Share Tech Mono** — the default for the *entire document*. Body, buttons,
  tables, bars, everything. One weight.
- **Rajdhani** — only where the system asserts itself: brand mark (700),
  section titles (600), person names (600).

Seven sizes, 10–17px, and nothing larger except the brand mark
(`clamp(2.2rem, 5.5vw, 4.5rem)`). Type is deliberately small.

**Letter-spacing does the work that size normally would.** Eight tracking
steps from `.04em` to `.35em`, and the step chosen is what tells you whether
something is a name, a label, a status or the mark. This is the most
characteristic single property in the system. `.35em` is reserved for the
wordmark alone.

### Space

Odd-numbered and tight: 7, 9, 11, 22, 44. Not a 4/8 grid. Bars pad `7px 28px`,
options `11px 22px`, table cells `10px 14px`, tags `2px 9px`. Copy the literals
from `tokens/space.css`; do not snap them.

Content measures are fixed, not fluid: results cap at 820px, the query at
560px, the boot log at 500px, and every option button is exactly 310px so a
stack reads as a punched column.

### Corners, borders, shadows

- **`border-radius: 0`. Everywhere.** The only round thing in the system is the
  6px status dot.
- **No box-shadows at all.** Depth is hairlines and darkness. The only
  shadow-like effect is `drop-shadow(0 0 6px …)` on the brand triangle — the
  system's single light source.
- Cards are `#0a0a10` on a 1px `#181820` border. That is the whole recipe: no
  shadow, no radius, no gradient, no coloured left border.

### Backgrounds and surface texture

Four layers stack on every page, bottom to top:

1. A **photographic plate** (`s/images/Helioh2.png`) sized `cover`, centred.
2. A **92% scrim** (`rgba(5,5,10,.92)`) over it — the photo survives only as
   texture, never as an image you can read.
3. An **ambient grid**: 60px cells drawn in `--sam-white` at 3% opacity, inside
   the stage.
4. **Scanlines** (`z-index: 9000`) — 3px clear, 1px `rgba(0,0,0,.07)`,
   repeating — and a **vignette** (`z-index: 8999`) that is transparent to 55%
   then falls to 65% black at the edges. Both `position: fixed`,
   `pointer-events: none`.

Portraits get their own denser scanlines at `rgba(0,0,0,.13)`.

No full-bleed hero imagery, no illustration, no pattern fills.

### Imagery

Everything arrives desaturated; colour is the reward for attention.
Portraits sit in a 4:3 well at `object-position: top center` under
`grayscale(.35) contrast(1.05)`, resolving to
`grayscale(0) contrast(1.1) brightness(1.04)` over `.35s` on hover.
Third-party embeds are pushed into the palette with
`invert(1) hue-rotate(180deg) saturate(.25) brightness(.85)` — cool, low
chroma, slightly dim. Nothing is warm. Nothing is glossy.

### Motion

Short, flat, and never playful.

- `.15s` link colour · `.18s` every border/colour hover · `.20s` the red wash
  sweeping across an option · `.25s` phase cross-fades · `.38s`
  `cubic-bezier(.16,1,.3,1)` for a result panel rising 14px into place ·
  `.6s` for the option list appearing.
- `1.6s` **linear** for the boot progress fill. Linear because it is
  instrumentation, not decoration.
- **Nothing scales. Nothing lifts. Nothing bounces.** No `translateY(-6px)`
  hover, no `scale()`, no spring. (The legacy layer does all three — that
  contrast is the point.)
- Three infinite loops, and only three: the status dot pulsing 1 → 0.25 over
  `2.4s`, the cursor blinking on `step-end` at `1s`, and the wordmark glitch —
  a `2.8s` skew sequence fired every `9s`.
- Character-level jitter is deliberate: boot lines land at `380ms + rnd(200)`,
  characters type at `48ms + rnd(28)`. Evenly spaced timing reads as animation;
  uneven timing reads as work being done.

**The intro choreography**, end to end, exactly as `j/contatti.js` drives it —
this is the sequence you see on load at `/w/contatti/`:

| At | What happens |
|---|---|
| 0ms | Bars, brand mark and brackets are already there. The mark starts its 9s glitch cycle. |
| 700ms | First boot line fades in over `.25s`. |
| +380ms + rnd(200) each | Lines 2, 3, 4 follow. Status words (`ATTIVI`, `VERIFICATA`) are green; everything else is muted grey. |
| with line 4 | The 220×1px progress track appears; 80ms later the red fill starts a `1.6s` **linear** run to 100%. |
| +1800ms | `ACCESSO CONCESSO` fades in, in white. |
| +900ms | The boot log fades out over `.4s`. |
| +420ms | The query mounts: label, red `>` prompt, and the question typed at `48ms + rnd(28)` per character behind a blinking 9×17px red block cursor. |
| +280ms after last char | Cursor disappears; the option stack fades in over `.6s`. |
| on pick | The query fades out over `.25s`; 260ms later the panel rises 14px into place over `.38s` on `cubic-bezier(.16,1,.3,1)`, and the window smooth-scrolls to top. |
| on back | Panel fades out over `.25s`; 260ms later the query fades back in over `.3s`, this time without re-typing. |

`BootSequence`, `QueryLine` and `ProgressLine` each own their part; the
phase cross-fades live in `ui_kits/samaritan-console/App.jsx`, which is the
reference implementation to copy from.
- Everything collapses to `.01ms` under `prefers-reduced-motion`.

### Interaction states

- **Hover** changes *border colour and text colour*, and on options adds the
  12% red wash sweeping left to right plus a 4px arrow step. Never a fill,
  never a lift, never a shadow.
- **Cards on hover** go one surface step lighter (`#0a0a10` → `#0f0f16`), the
  border goes to `#252530`, and a 2px red rail fades in down the left edge.
- **Press states do not exist.** The source defines none. Do not add them.
- **Focus** is a 1px red outline at 3px offset, square.
- **Disabled** is opacity `.45` with `cursor: default`.

### Layout rules

- The top bar is `position: sticky`, `z-index: 200`. The stage is a centred
  flex column that shows **one state at a time** — boot, or query, or a result
  panel; the source cross-fades between them rather than stacking.
- Four red corner brackets, 28px arms at 2px, inset 32px, at 50% opacity. They
  frame the view; they never contain content.
- Breakpoints: **580px** contact grid collapses to one column · **520px** the
  data table stacks label above value · **480px** the right-hand bar group and
  the third footer slot disappear and brackets pull in to 16px.
- Transparency and blur: transparency yes (the scrim, the wash, the bracket
  opacity), **blur never**. There is no `backdrop-filter` in the Samaritan
  layer. The legacy header has one; that is a legacy header.

---

## 4. Iconography

**There is no icon system, and that is the design.**

- **One vector in the entire source**: the brand triangle, an inline
  `<polygon points="10,0 20,17 0,17">` at 18×16px, filled `#c01010` with a 6px
  red glow. Copied verbatim to `assets/brand-triangle.svg`.
- **Everything else is a text glyph.** Unicode arrows and pointers carry all
  navigational meaning: `→` (`&rarr;`) on options, `←` (`&larr;`) on back,
  `▸ … ◂` (`&#9656; &#9666;`) bracketing the interface label.
- **Words are used where icons normally would be.** Contact rows are keyed by
  a 10px uppercase word — `TEL`, `MAIL` — not by a phone or envelope glyph.
  This is the system's icon language: type doing an icon's job.
- **No icon font, no sprite sheet, no SVG set, no PNG icons, no emoji.** None
  are present in the source and none have been substituted. Nothing was
  linked from a CDN.
- The only "icon-sized" shapes are the 6px status dot and the corner brackets,
  both drawn in CSS.

If you need a new affordance, reach for a unicode glyph or an uppercase word
before you reach for an icon set. If an icon set becomes unavoidable, that is a
decision for the brand owner, not a substitution to make quietly.

---

## 5. Components

React primitives, one directory per concern, all styling delegated to the
`.sam-*` classes in `patterns/samaritan.css`. Every component's directory
contains `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md` and one card HTML.

**`components/chrome/`** — `Shell` · `Stage` · `StatusBar` · `StatusFooter` ·
`StatusDot` · `CornerBrackets`

**`components/brand/`** — `BrandMark`

**`components/boot/`** — `BootSequence` · `ProgressLine`

**`components/query/`** — `QueryLine` · `OptionButton`

**`components/controls/`** — `GhostButton`

**`components/data/`** — `SectionHeader` · `ClassificationTag` · `DataTable` ·
`InfoField` · `PersonCard` · `MapFrame`

Eighteen components. The inventory is exactly what `contatti/index.html` and
`j/contatti.css` define — no Toast, no Avatar, no Tabs, no Modal, because the
source has none. There is one filled-button style (`OptionButton`) and one
outline style (`GhostButton`); there is no third.

### Intentional additions

Two, both minimal:

1. **`PersonCard`'s initials fallback.** The source calls
   `mkAvatar(initials, id)` as the `onerror` handler for every portrait, but
   that function is not defined anywhere in `contatti/` or `j/`. Rather than
   ship a broken image, the card renders a dark well printing the two-letter
   initials and the record id (`GO` / `ID-001`) — both values the source
   already carries in `data-` attributes.
2. **`Shell`'s `contained` mode and element-level CRT overlays.** The source
   puts scanlines and vignette on `body::before` / `body::after`, which cannot
   work inside a card preview. `.sam-crt` / `.sam-crt-vignette` are the same
   two gradients as elements.

---

## 6. UI kit

**`ui_kits/samaritan-console/`** — a click-through recreation of
`contatti/index.html`: boots, asks its question, then opens any of the three
records. Five tagged screens (full sequence, query, and one per record).
Copy, values and the map embed string are verbatim from the source. See that
folder's `README.md` for fidelity notes and the two missing image assets.

There is one product surface because the source contains one Samaritan-styled
page. The rest of the repo is the legacy marketing site, which this system is
explicitly not.

## 7. Templates

Starting folders for consuming projects:

- **`templates/samaritan-console/`** — `SamaritanConsole.dc.html`: full shell,
  bars, brackets, wordmark, numbered option stack, live clock and glitch.
- **`templates/samaritan-record/`** — `SamaritanRecord.dc.html`: classified
  header, key/value table, field stack and a personnel grid. This is the one to
  copy when moving existing page content onto the framework.

Each has a sibling `ds-base.js`; edit its one `base` line to point at the
design system.

---

## 8. File index

| Path | What |
|---|---|
| `styles.css` | Root entry. `@import` lines only — link this one file. |
| `tokens/colors.css` | Surfaces, text ramp, red, green, hairlines + semantic aliases. |
| `tokens/typography.css` | Two families, seven sizes, eight tracking steps. |
| `tokens/space.css` | Spacing scale, composite paddings, measures, geometry, z-index. |
| `tokens/effects.css` | Scanlines, vignette, filters, durations, easings, the four keyframes. |
| `tokens/fonts.css` | Google Font imports + the two Samaritan `@font-face` rules. |
| `tokens/legacy-helioh2.css` | The outgoing light brand, for migration reference only. |
| `patterns/base.css` | Reset, `body.sam` defaults, link colours, focus ring. |
| `patterns/samaritan.css` | The full class layer — drop-in for plain HTML pages. |
| `compat/contatti-aliases.css` | `--contatti-*` → `--sam-*`, so existing pages keep working. |
| `guidelines/*.html` | 18 foundation specimen cards (Colors, Type, Space, Surface, Brand). |
| `components/<group>/` | 18 React primitives with types, prompts and cards. |
| `ui_kits/samaritan-console/` | The product recreation. |
| `templates/<slug>/` | Copyable starting folders. |
| `assets/` | The one vector mark, plus the list of missing images. |
| `thumbnail.html` | Homepage tile. |
| `SKILL.md` | Agent Skills entry point. |

---

## 9. Migrating a page onto the framework

The framework was extracted so it can leave `/w/contatti/`. Three routes,
cheapest first:

1. **Keep your CSS, swap the stylesheet.** Point the page at this system's
   `styles.css` instead of `j/stile.css`. `compat/contatti-aliases.css` maps
   every `--contatti-*` name onto its `--sam-*` equivalent, so existing rules
   keep resolving. Nothing should move by a pixel.
2. **Rewrite the markup against `.sam-*`.** `patterns/samaritan.css` is
   `j/contatti.css` generalised — the class map is at the top of that file
   (`.shell` → `.sam-shell`, `.opt` → `.sam-opt`, `.rsec-head` →
   `.sam-section-head`, and so on). This is the route for a page that is not
   the contacts page.
3. **Compose the React components.** For new surfaces, start from
   `templates/samaritan-record/` and build with the primitives in section 5.

Naming: the canonical prefix is `--sam-*`. `--contatti-*` is a compatibility
shim and should be treated as deprecated — it names a page, not a system.

---

## 10. Caveats

- **No image files.** The background plate, four portraits, favicon and OG
  image were not mounted (`s/` was not attached). The UI kit loads them from
  `https://www.helioh2.com/s/images/…` by absolute URL so the recreation looks
  right, which means **the system is not yet self-contained** — an offline or
  re-hosted consumer will get the `PersonCard` initials fallback and a flat
  `#05050a` surface. Drop the files into `assets/` and switch the `S` and
  `PLATE` constants in `panels.jsx`.
- **Verified against the live page.** `https://www.helioh2.com/w/contatti/` was
  fetched and compared against the mounted source: markup, copy, values, boot
  lines and the map embed string are identical. No drift.
- **No logo, by design.** None exists in the source. Nothing was invented.
- **Fonts are hotlinked, not self-hosted.** No binaries were available, so the
  Google Fonts `@import` set from `j/fonts.css` is preserved as-is, plus
  explicit `@font-face` rules for Share Tech Mono 400 and Rajdhani 400.
  Rajdhani 500/600/700 still resolve through the `@import`. Drop real font
  files into `assets/fonts/` and rewrite the two `src:` URLs to self-host.
- **`mkAvatar()` is undefined in the source.** Worth fixing upstream — the
  live page's portraits fail silently if the JPEGs 404.
- The legacy HelioH₂ marketing brand is documented and tokenised but **not**
  componentised. If you need light-mode marketing components too, say so.
