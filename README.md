# honeytabs.com

Static marketing site for HoneyTabs (made for the busy bee). Plain HTML, CSS and a little JS. Hosted on GitHub Pages with the custom domain in `CNAME`.

## Pages
- `/` (index.html): homepage
- `/privacy/`: Privacy Policy, including the Google API Services / Limited Use section (`/privacy/#google`)
- `/terms/`: Terms of Use
- `/support/`: Support and contact (hello@honeytabs.com)
- `/r/`: referral invite page (`/r/?code=<code>`). `honeytabs.com/r/<code>` has no file, so `404.html` redirects it to `/r/?code=<code>`. `assets/js/referral.js` shows the code, saves it to `localStorage` (`referral:pending_code`, the same key the app uses on web), and opens the app (`eventdesk://r/<code>`; Android uses an intent URL that falls back to Google Play).
- `404.html`: not-found page

## Editing
Page content lives in `tools/pages/*.html`. The shared head, header, icon sprite and footer live in `tools/build.py`.
After editing, run:

    python3 tools/build.py

That rewrites the HTML at the repo root. Commit both the source and the output. No dependencies.

Styles: `assets/css/site.css`. Script: `assets/js/site.js` (sticky header, mobile menu, scroll reveal; honors prefers-reduced-motion).

## Assets
From Logan's approved brand kit (`ventures/event_app/brand/final/`):
- Logo: `09_vector_redraw/honeytabs_logo.svg` (and the dark version), with only the viewBox cropped (`assets/img/logo*.svg`). The artwork is unchanged.
- Favicons and `site.webmanifest`: `11_app_icon_final/favicon/`
- App icon: `11_app_icon_final/ios/AppIcon-1024.png`, resized to webp, avif and png
- Fonts: Fraunces, Nunito and Kaushan Script (OFL), subset to Latin and self-hosted as woff2. Licenses are in `assets/fonts/`.
- `assets/img/og-image.png` is rendered from `tools/og/og.html`.

No pricing, no analytics, no cookies, no third-party requests.
