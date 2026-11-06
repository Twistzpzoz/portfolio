# Myo Ko Zin — Portfolio

Personal portfolio: digital marketing, UX and data-driven research.

A static site in plain HTML, CSS and JavaScript, with no build step.

## Structure

```
index.html          Homepage
assets/css/         Shared styles (light and dark mode)
assets/js/          Theme toggle, animations, copy-email
images/             Project slides (full-size PNG)
images/web/         Optimised WebP images used on the pages
files/              Original PDFs (pitch decks, research paper)
```

## Run locally

```bash
python -m http.server 8123
```

Then open http://localhost:8123.

## Deploy

Hosted on Vercel and imported from this repository. Every push to `main` redeploys the site automatically.
