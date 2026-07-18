import { QueryClient } from '@tanstack/react-query'

const DAY = 1000 * 60 * 60 * 24
const HOUR = 1000 * 60 * 60

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DAY, // historical data essentially never changes
      gcTime: DAY,
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
    },
  },
})

// Season helpers used across hooks to pick the right cache policy.
export const CURRENT_SEASON = new Date().getFullYear()

/**
 * Historical seasons never change → cache forever.
 * Current season standings update during a race weekend → 1h.
 */
export function seasonStaleTime(season) {
  const s = Number(season)
  if (!s || s >= CURRENT_SEASON) return HOUR
  return Infinity
}
