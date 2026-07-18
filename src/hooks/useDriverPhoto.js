import { useQuery } from '@tanstack/react-query'
import { wikiTitle } from '../lib/wiki.js'

// Resolves a driver's portrait URL from their Wikipedia page. Cached forever
// (a driver's photo rarely changes) and only runs when `enabled` (so grids can
// lazy-load per card via IntersectionObserver). Returns null when the page has
// no thumbnail, letting callers fall back to an initials avatar.
export function useDriverPhoto(wikiUrl, enabled = true) {
  const title = wikiTitle(wikiUrl)
  return useQuery({
    queryKey: ['driverPhoto', title],
    enabled: enabled && !!title,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    queryFn: async () => {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { headers: { Accept: 'application/json' } },
      )
      if (!res.ok) return null
      const data = await res.json()
      // Use the exact thumbnail the summary returns — Wikimedia rejects
      // arbitrary resized dimensions for many cached files.
      return data.thumbnail?.source ?? null
    },
  })
}
