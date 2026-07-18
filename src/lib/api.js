// Central fetch wrapper for the Jolpica F1 API (Ergast-compatible).
//
// The API is slow (~0.5–1.4s/request) and rate-limited (~4 req/sec burst,
// 500/hr sustained). So instead of a single serial pipe — which stacks every
// request's latency and made pages take 20s+ — this uses a concurrency-limited
// launcher: up to MAX_CONCURRENT requests in flight at once, with new launches
// spaced MIN_GAP_MS apart to stay under the burst cap. That lets a hook's
// Promise.all actually overlap, while still throttling the launch rate.

const BASE_URL = 'https://api.jolpi.ca/ergast/f1'

// The Jolpica limit is ~4 req/sec burst. Launching one request every 300ms
// (~3.3/sec) keeps us provably under it with NO simultaneous bursts — the
// earlier concurrency-first approach let fast responses spike past 4/sec and
// triggered 429s. Requests still overlap naturally (each takes ~400ms+), so
// throughput stays high without ever bursting.
const MAX_CONCURRENT = 4 // safety cap; the gap is the real limiter
const MIN_GAP_MS = 300 // spacing between launches (~3.3/sec, under the cap)
const MAX_429_RETRIES = 4 // transient burst rejections self-heal

let active = 0
let lastLaunchAt = 0
let drainTimer = null
const queue = []

function scheduleDrain(delay) {
  if (drainTimer) return
  drainTimer = setTimeout(() => {
    drainTimer = null
    drain()
  }, delay)
}

function drain() {
  if (queue.length === 0) return
  if (active >= MAX_CONCURRENT) return

  const since = Date.now() - lastLaunchAt
  if (since < MIN_GAP_MS) {
    scheduleDrain(MIN_GAP_MS - since)
    return
  }

  const { task, resolve, reject } = queue.shift()
  active += 1
  lastLaunchAt = Date.now()

  Promise.resolve()
    .then(task)
    .then(resolve, reject)
    .finally(() => {
      active -= 1
      drain()
    })

  // Schedule the next launch a full gap later (never in the same tick, so we
  // can't burst multiple requests simultaneously).
  if (queue.length) scheduleDrain(MIN_GAP_MS)
}

/** Enqueue a task under the concurrency + rate limits. */
function schedule(task) {
  return new Promise((resolve, reject) => {
    queue.push({ task, resolve, reject })
    drain()
  })
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Fetch a JSON endpoint. `path` should be relative to BASE_URL and may or may
 * not include the `.json` suffix (we add it if missing, before any query).
 * Retries transient 429s with exponential back-off so a momentary burst over
 * the limit doesn't surface as a hard error.
 */
export async function apiGet(path) {
  const clean = path.startsWith('/') ? path.slice(1) : path
  const [pathPart, queryPart] = clean.split('?')
  const withExt = pathPart.endsWith('.json') ? pathPart : `${pathPart}.json`
  const url = `${BASE_URL}/${withExt}${queryPart ? `?${queryPart}` : ''}`

  for (let attempt = 0; ; attempt++) {
    const res = await schedule(() =>
      fetch(url, { headers: { Accept: 'application/json' } }),
    )

    if (res.status === 429) {
      if (attempt < MAX_429_RETRIES) {
        // Honour Retry-After when present, else back off 0.6s, 1.2s, 2.4s…
        const retryAfter = Number(res.headers.get('retry-after'))
        const wait = retryAfter ? retryAfter * 1000 : 600 * 2 ** attempt
        await sleep(wait)
        continue
      }
      throw new ApiError('Rate limited by F1 API — please retry shortly.', 429)
    }

    if (!res.ok) {
      throw new ApiError(`Request failed (${res.status}) for ${withExt}`, res.status)
    }

    const json = await res.json()
    return json.MRData
  }
}

/**
 * Career-total trick: request with ?limit=1 and read MRData.total to get a
 * count (wins, poles, races…) without downloading every result row.
 */
export async function apiCount(path) {
  const sep = path.includes('?') ? '&' : '?'
  const data = await apiGet(`${path}${sep}limit=1`)
  return Number(data.total) || 0
}

export { BASE_URL }
