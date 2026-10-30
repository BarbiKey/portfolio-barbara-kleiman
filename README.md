# Barbara Kleiman, portfolio

Personal portfolio of Barbara Kleiman, UX/UI and Product Designer (Buenos Aires). Case studies on role architecture, design systems, and coded prototypes.

## Stack

Plain HTML, CSS and JavaScript. No framework, no build step.

| File | What it does |
| --- | --- |
| `index.html` | Page structure and copy |
| `styles.css` | Visual system (design tokens at the top, in `:root`) |
| `app.js` | Side index, expandable cards, tag filter, scroll-painted version curve |
| `assets/` | CV (PDF) and future images |

Fonts load from Google Fonts: Fraunces (display), Work Sans (body), IBM Plex Mono (labels).

## Visual system

Palette "Clay": cream background, charcoal ink, terracotta accent (`--shout`), peach panels. Organic panel shapes and a curved version line that paints as you scroll. Motion stays low and respects `prefers-reduced-motion`.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: it checks that referenced files exist and that `app.js` parses, then publishes to GitHub Pages.

In the repo: Settings, Pages, Source: GitHub Actions.

## Roadmap

- Dark theme (CSS variables)
- Spanish version (`navigator.language` detection plus manual toggle)
- Product Owner variant
- Screens and diagrams per case
- Responsive breakpoint pass

## Contributions

This is a personal project and is not open to contributions. Issues and pull requests will not be merged.

## License

Copyright Barbara Kleiman. The code structure may be used as reference, but the copy, case studies and CV are not for reuse.
