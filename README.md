# F1 Stats Hub 🏁

Every lap, every legend — a premium Formula 1 statistics site covering 1950 → present.
React + Vite, Tailwind, anime.js, TanStack Query, Recharts, and React Bits–style
showpiece components, wired to the free **Jolpica** (Ergast-compatible) F1 API.

## Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS 3.4 |
| Animation | anime.js v4 + custom React Bits components |
| Charts | Recharts 2 |
| Data | TanStack Query v5 |
| Routing | React Router v6 |
| Icons | lucide-react |

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the build
```

No API keys required. Data comes from `https://api.jolpi.ca/ergast/f1/`.
A request queue in `src/lib/api.js` spaces calls ~280ms apart to stay under the
API's burst limits, and TanStack Query caches historical data indefinitely.

## Pages

- `/` — cinematic hero, current-season "at a glance" strip
- `/drivers` — filterable grid of every driver (search, nationality, era, champions)
- `/drivers/:driverId` — career stat counters, points-progression chart, season table
- `/teams` + `/teams/:constructorId` — constructor stats, titles timeline, points area chart
- `/standings/:season` — animated driver / constructor standings bars
- `/seasons` + `/seasons/:year/:round` — decade archive and full race classifications
- `/compare` — head-to-head driver comparison with radar chart (shareable URL)

## Video hero

The hero background lazy-mounts a looping video if `public/hero.webm` / `public/hero.mp4`
(+ `public/hero-poster.webp`) exist; otherwise it falls back to a zero-copyright
canvas "Hyperspeed" animation. On mobile or `prefers-reduced-motion` it always uses
the fallback. Source clips from Pexels/Pixabay/Coverr — **do not** rip broadcast footage.

Encode example:

```bash
ffmpeg -i in.mp4 -an -vf "scale=1920:-2" -c:v libvpx-vp9 -b:v 1.5M public/hero.webm
```

## Accessibility & performance

- Route-level code splitting (`React.lazy`) on every page
- Current-season standings prefetched on mount
- `prefers-reduced-motion` respected everywhere (animations snap to final state)
- Focus-visible rings, table semantics, aria-labels on icon buttons

## Notes

Unofficial fan project. Not affiliated with Formula 1, the FIA, or any team.
Data © the Jolpica / Ergast project.
