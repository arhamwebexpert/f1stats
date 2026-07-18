import { useQuery } from '@tanstack/react-query'
import { openF1Get } from '../lib/openf1.js'

const MIN = 1000 * 60

// upcoming | live | finished — from the session's time window vs now.
export function sessionState(session) {
  if (!session?.date_start || !session?.date_end) return 'unknown'
  const now = Date.now()
  const start = new Date(session.date_start).getTime()
  const end = new Date(session.date_end).getTime()
  if (now < start) return 'upcoming'
  if (now > end) return 'finished'
  return 'live'
}

// The most recent (or currently running) session.
export function useLatestSession() {
  return useQuery({
    queryKey: ['openf1', 'latestSession'],
    staleTime: 5 * MIN,
    retry: 1,
    queryFn: async () => {
      const rows = await openF1Get('/sessions?session_key=latest')
      return rows[0] ?? null
    },
  })
}

// Driver identities for a session (name, team colour, headshot).
export function useSessionDrivers(sessionKey) {
  return useQuery({
    queryKey: ['openf1', 'drivers', sessionKey],
    enabled: !!sessionKey,
    staleTime: 30 * MIN,
    retry: 1,
    queryFn: () => openF1Get(`/drivers?session_key=${sessionKey}`),
  })
}

// The classification for a session. When `live`, poll every ~12s.
export function useSessionResult(sessionKey, { live = false } = {}) {
  return useQuery({
    queryKey: ['openf1', 'sessionResult', sessionKey],
    enabled: !!sessionKey,
    staleTime: live ? 0 : 5 * MIN,
    refetchInterval: live ? 12000 : false,
    retry: 1,
    queryFn: () => openF1Get(`/session_result?session_key=${sessionKey}`),
  })
}

// The next scheduled session this year (earliest start after now).
export function useNextSession() {
  const year = new Date().getFullYear()
  return useQuery({
    queryKey: ['openf1', 'nextSession', year],
    staleTime: 30 * MIN,
    retry: 1,
    queryFn: async () => {
      const rows = await openF1Get(`/sessions?year=${year}`)
      const now = Date.now()
      const upcoming = rows
        .filter((s) => new Date(s.date_start).getTime() > now && !s.is_cancelled)
        .sort((a, b) => new Date(a.date_start) - new Date(b.date_start))
      return upcoming[0] ?? null
    },
  })
}
