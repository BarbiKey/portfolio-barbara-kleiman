# Portfolio backlog

Author: Barbara Kleiman
Last updated: 2026-11-05

Things parked on purpose, to revisit later. Order of work: content and videos first, visual style after.

## Parked

### Shooting star (hidden)
- **Status:** hidden. Disabled with `STAR_ENABLED = false` in `app.js` (commit `b0cd73c`, branch `portfolio-motion`). Nothing was deleted.
- **Why:** the result does not convince me visually. Revisit during the style pass.
- **To bring it back:** set `STAR_ENABLED = true`. It fires once when `#about` is 40% in view (`STAR_SECTION_ID`) and never under `prefers-reduced-motion`.
- **Open question for the style pass:** keep it with a different look, or remove the code and CSS for good.

## To verify
- [PENDING] Browser pass over the rest of `portfolio-motion`: accordion (mouse and keyboard), side index, reduced motion on and off, width at or below 640px, filter pill.
