// Helpers for pulling driver portraits from Wikipedia. Ergast/Jolpica driver
// objects carry a Wikipedia `url`; the Wikipedia REST summary endpoint returns
// a thumbnail for that page — which covers historical drivers too, not just
// the current grid (unlike OpenF1's headshots).

// "http://en.wikipedia.org/wiki/Charles_Leclerc" → "Charles_Leclerc"
export function wikiTitle(url) {
  if (!url) return null
  const m = url.match(/\/wiki\/(.+)$/)
  return m ? m[1] : null
}
