# H3RD — h3rd.net

Static, single-page marketing site. No build step, no npm, no framework —
open `index.html` and it runs. Fonts come from Google Fonts; everything else
is local.

```
index.html            the whole page
css/styles.css        design system (tokens → base → components → breakpoints)
js/main.js            ES5-only behaviour, guarded so nothing depends on it
assets/images/        logo, floor-map.svg, qr-label.svg, facility.jpg,
                      logistics.jpg, favicons
site.webmanifest      PWA manifest
CNAME                 h3rd.net
.github/workflows/    GitHub Pages deploy (runs on push to master)
_shots/               live-site reference captures + screenshot tooling (gitignored)
```

## Design system

Tokens are mirrored verbatim from the live site so the two stay visually
identical.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0c0d0e` | page background |
| `--accent` | `#033156` | buttons, rules, "Effortless Efficiency.", chips |
| `--cyan` | `#00e5ff` | schematic highlights, focus ring |
| `--alert` | `#ff4444` | loss-prevention schematic |
| `--ink` / `--muted` | `#fff` / `#6b7280` | body text / secondary text |
| `--grid` | `rgba(255,255,255,.05)` | hairlines + the fixed 40px background grid |
| `--surface` | `#16181a` | artwork panel backdrop |
| `--font-heading` | Spectral 800 | `h1`, `h2` — UPPERCASE, tight tracking |
| `--font-sub` | Merriweather 700 | `h3`, `h4` |
| `--font-sans` | Roboto | body, nav, buttons |
| `--font-mono` | Courier New | chips, tag mock-up, schematics |

Headings are uppercase with negative letter-spacing and `line-height: .9`;
the hero steps 36px → 60px → 110px. The container is 1280px (`max-w-7xl`)
with `clamp(1rem, 4vw, 2rem)` gutters and a header that is 64px on mobile,
88px from 768px up.

## Page structure

1. **Hero** — "Precision Tracking." plus the accent "Effortless Efficiency."
2. **`01 / Methodology`** — H3RD Smart Tag Workflow: a 4-step tablist
   (Smart Tag → Gateway → Live Dashboard → WMS / ERP) driving a detail panel,
   then "The H3RD Advantage" 4-up.
3. **`02 / Technology`** — four capability cards. Card I carries a click-to-flip
   3D e-ink label mock-up, card II a generated floor-map schematic, cards III/IV
   mini schematics (geofenced transaction, mismatch alert). Cards II–IV replay the
   live site’s looping artwork in pure CSS.
4. **`03 / ROI & Markets`** — Measurable Return on Investment (hard/soft
   savings), then Target Industry Focus tabs (High-Tech Manufacturing /
   3PL & Logistics).
5. **CTA** — Enterprise Deployments → Schedule a Demo (opens the booking page).
6. **Footer** — contact details and the Confidential badge.

## Behaviour

`js/main.js` is plain ES5 in an IIFE with numbered sections. Every feature is
additive: if the script fails to load, all content stays readable and both tab
groups simply show their first panel.

- **Progressive enhancement** — the `<head>` script adds `.anim` before first
  paint, which is what enables scroll reveal. A 1.6s safety timer reveals
  anything the `IntersectionObserver` misses, so content can never stay hidden.
- **Mobile header** — matching the live site, below 768px the three section
  links are hidden and only the logo and the "Book a Demo" button remain.
- **Tabs** — `.workflow__step` and `.tab` share one `wireTablist()` helper with
  arrow / Home / End keyboard support and `aria-selected`.
- **Label flip** — `#label-flip` toggles `aria-pressed` to rotate the e-ink
  label between its front and back faces (pure CSS 3D).
- **Card artwork motion** — the loops inside cards II–IV (BLE rings on the floor
  map, the sliding work-order label and its transaction spark, the hand-held
  drop with the WRONG OP overlay) are CSS keyframes, not JavaScript. They are
  gated twice — the head script’s `.anim` *and* the card’s own `.is-visible` —
  so with scripting off, or under `prefers-reduced-motion`, the artwork rests
  quietly at its static state, and cards II–IV lift 4px on hover.

## Preview locally

```bash
python -m http.server 5199
# then open http://127.0.0.1:5199/
```

## Validate

There is no build step, so `_shots/tools/validate.py` checks the site by hand:

```bash
python _shots/tools/validate.py
```

It verifies HTML tag balance, duplicate ids, that every `#anchor` resolves,
that every local asset reference exists on disk, CSS brace balance, JS
delimiter balance, and that `main.js` stays ES5-only.

`.github/workflows/deploy.yml` publishes `index.html css js assets favicon.ico
site.webmanifest CNAME .nojekyll` to GitHub Pages on push to `master`.
`_shots/` is gitignored and is never published.

## Contact details

`info@h3rd.net` · `408-643-4444` (Sales Team) · © 2026 H3RD, LLC.

Both demo buttons — the header CTA and the one in the CTA band — open the H3RD
booking page at `https://zcal.co/h3rd` in a new tab (`target="_blank"` with
`rel="noopener noreferrer"`). This matches the live site, where those are the
only two links it has. There is no form backend; the footer contact block is the
only `mailto:` on the page.
