// Client for the OpenF1 API (https://openf1.org) — live & historical F1
// session data. Separate from the Ergast/Jolpica client in api.js (different
// host, different auth model).
//
// OpenF1 is free and open BETWEEN sessions, but during a live session global
// access is restricted to authenticated users. Supply an API key via the
// VITE_OPENF1_KEY env var to unlock live polling; without one the app shows
// the most-recent session + a countdown and surfaces OpenF1AuthError.

const BASE_URL = 'https://api.openf1.org/v1'
const API_KEY = import.meta.env.VITE_OPENF1_KEY

export class OpenF1AuthError extends Error {
  constructor(message) {
    super(message || 'OpenF1 live access requires an API key during a session.')
    this.name = 'OpenF1AuthError'
  }
}

export class OpenF1Error extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'OpenF1Error'
    this.status = status
  }
}

/**
 * GET an OpenF1 endpoint. `path` is relative to BASE_URL and includes its own
 * query string, e.g. `/sessions?session_key=latest`. Returns the parsed array.
 */
export async function openF1Get(path) {
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const headers = { Accept: 'application/json' }
  if (API_KEY) headers.Authorization = `Bearer ${API_KEY}`

  const res = await fetch(url, { headers })

  // During a live session, unauthenticated access is blocked (429/401/403).
  if (res.status === 429 || res.status === 401 || res.status === 403) {
    throw new OpenF1AuthError()
  }
  if (res.status === 404) return [] // "No results found" — treat as empty
  if (!res.ok) {
    throw new OpenF1Error(`OpenF1 request failed (${res.status})`, res.status)
  }

  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export const HAS_OPENF1_KEY = !!API_KEY
export { BASE_URL }
