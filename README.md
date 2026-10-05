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

## Deploy

`.github/workflows/deploy.yml` publishes `index.html css js assets favicon.ico
site.webmanifest CNAME .nojekyll` to GitHub Pages on push to `master`.
`_shots/` is gitignored and is never published. Dedicated to
`https://github.com/yeh325/H3RD-site`, whose default branch is `master`.

### Repository settings

Two settings live in **Settings → Pages**, not in this repo:

- **Build and deployment → Source: GitHub Actions.** Until this is set, the
  workflow fails at its `configure-pages` step with *"Get Pages site failed.
  Please verify that the repository has Pages enabled and configured to build
  using GitHub Actions"*.
- **Custom domain: `h3rd.net`**, then **Enforce HTTPS**.

Publishing from the branch instead exposes the whole repo root — `README.md` and
`.gitignore` both return 200 that way, and 404 once the workflow owns the site.
The `CNAME` file still ships inside the artifact, but under Actions-based
publishing the custom domain *setting* above is what counts.

### DNS

DNS for `h3rd.net` must point at GitHub Pages rather than Wix:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `185.199.108.153` `185.199.109.153` `185.199.110.153` `185.199.111.153` |
| `AAAA` | `@` | `2606:50c0:8000::153` `2606:50c0:8001::153` `2606:50c0:8002::153` `2606:50c0:8003::153` |
| `CNAME` | `www` | `yeh325.github.io` |

The old Wix records — `185.230.63.186`, `185.230.63.107`, `185.230.63.171` and the
`www` → `cdn1.wixdns.net` alias — can be deleted once the new records resolve.
If Wix shows the apex `A` records as read-only, disconnect the domain from the
Wix site first; Wix does not release records for a domain it is actively
serving.

**Do not touch the mail records.** `h3rd.net` also runs Google Workspace mail
out of the same zone:

| Type | Name | Value |
|---|---|---|
| `MX` | `@` | `10 aspmx.l.google.com` |
| `TXT` | `@` | `v=spf1 include:_spf.google.com ~all` |
| `TXT` | `@` | two `google-site-verification=…` values |

### Enabling HTTPS

Both the apex `A` records **and** the `www` CNAME have to be right before GitHub
will issue a certificate. With only the apex correct, Pages reports *"Your
site's DNS settings are using a custom subdomain, www.h3rd.net, that is not set
up with a correct CNAME record … (InvalidCNAMEError)"* and never provisions the
certificate — `https://h3rd.net` then fails on a certificate-name mismatch,
serving GitHub's `*.github.io` fallback:

```bash
echo | openssl s_client -connect 185.199.108.153:443 -servername h3rd.net 2>&1 | grep '^ 0 s:'
#   CN=*.github.io   → not issued yet
#   CN=h3rd.net      → issued
```

Pages caches the result of its last DNS check and keeps displaying it until a
new check runs, so that error can outlive the fix. Force a fresh check by
editing **Custom domain** (remove `h3rd.net`, add it back and save) or by
re-running the deployment. Once the check is green GitHub issues the certificate
by itself — minutes to about an hour, though the docs allow up to 24h — and
**Enforce HTTPS** becomes selectable. Ticking it also buys `http://` →
`https://` and `www` → apex, both automatic.

### Verifying a deployment

Address the edge IP directly to bypass local DNS caching while propagation
settles:

```bash
curl -sI -H 'Host: h3rd.net' http://185.199.108.153/               # 200, Server: GitHub.com
curl -sI --resolve h3rd.net:443:185.199.108.153 https://h3rd.net/  # fails until the cert exists
```

Once live, `https://h3rd.net`, `http://h3rd.net` and `http://www.h3rd.net`
should all end up at `https://h3rd.net`.

## Contact details

`info@h3rd.net` · `408-643-4444` (Sales Team) · © 2026 H3RD, LLC.

Both demo buttons — the header CTA and the one in the CTA band — open the H3RD
booking page at `https://zcal.co/h3rd` in a new tab (`target="_blank"` with
`rel="noopener noreferrer"`). This matches the live site, where those are the
only two links it has. There is no form backend; the footer contact block is the
only `mailto:` on the page.
