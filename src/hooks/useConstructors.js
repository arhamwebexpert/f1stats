import { useQuery } from '@tanstack/react-query'
import { apiCount, apiGet } from '../lib/api.js'

export function useConstructors() {
  return useQuery({
    queryKey: ['constructors', 'all'],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: async () => {
      const first = await apiGet('/constructors?limit=100&offset=0')
      const total = Number(first.total) || 0
      let items = first.ConstructorTable?.Constructors ?? []
      const pages = Math.ceil(total / 100)
      for (let page = 1; page < pages; page++) {
        const data = await apiGet(`/constructors?limit=100&offset=${page * 100}`)
        items = items.concat(data.ConstructorTable?.Constructors ?? [])
      }
      return items
    },
  })
}

// Every driver who has raced for a constructor (all-time roster). Pass a
// `season` to get just that season's line-up. Driver objects include the
// Wikipedia `url`, so they feed DriverAvatar directly.
export function useConstructorDrivers(constructorId, season) {
  return useQuery({
    queryKey: ['constructorDrivers', constructorId, season ? String(season) : 'all'],
    enabled: !!constructorId,
    staleTime: Infinity,
    queryFn: async () => {
      const path = season
        ? `/${season}/constructors/${constructorId}/drivers?limit=100`
        : `/constructors/${constructorId}/drivers?limit=100`
      const data = await apiGet(path)
      return data.DriverTable?.Drivers ?? []
    },
  })
}

export function useConstructor(constructorId) {
  return useQuery({
    queryKey: ['constructor', constructorId],
    enabled: !!constructorId,
    staleTime: Infinity,
    queryFn: async () => {
      const data = await apiGet(`/constructors/${constructorId}`)
      return data.ConstructorTable?.Constructors?.[0] ?? null
    },
  })
}

// Wins/poles/races are cheap ?limit=1 total counts, fetched in parallel.
export function useConstructorStats(constructorId) {
  return useQuery({
    queryKey: ['constructorStats', constructorId],
    enabled: !!constructorId,
    staleTime: Infinity,
    queryFn: async () => {
      const [races, wins, poles] = await Promise.all([
        apiCount(`/constructors/${constructorId}/results`),
        apiCount(`/constructors/${constructorId}/results/1`),
        apiCount(`/constructors/${constructorId}/qualifying/1`),
      ])
      return { races, wins, poles }
    },
  })
}

// Season-by-season history (points/wins/races/season) + career points via ONE
// bulk pass over the constructor's race results — a handful of paged requests
// instead of one constructorStandings call per season (a 75-year team like
// Ferrari would otherwise be ~78 requests, which stalled the page).
//
// Trade-off vs the old standings approach: race results don't carry final
// championship standings, so there's no per-season *position* (and therefore
// no constructors'-title count) here — those needed the slow per-season calls.
export function useConstructorProfile(constructorId) {
  return useQuery({
    queryKey: ['constructorProfile', constructorId],
    enabled: !!constructorId,
    staleTime: Infinity,
    queryFn: async () => {
      const first = await apiGet(
        `/constructors/${constructorId}/results?limit=100&offset=0`,
      )
      const total = Number(first.total) || 0
      let races = first.RaceTable?.Races ?? []

      const pages = Math.ceil(total / 100)
      if (pages > 1) {
        const rest = await Promise.all(
          Array.from({ length: pages - 1 }, (_, i) =>
            apiGet(
              `/constructors/${constructorId}/results?limit=100&offset=${(i + 1) * 100}`,
            ),
          ),
        )
        rest.forEach((d) => {
          races = races.concat(d.RaceTable?.Races ?? [])
        })
      }

      return aggregateConstructor(races)
    },
  })
}

function aggregateConstructor(races) {
  let points = 0
  let wins = 0
  const seasons = new Map()

  for (const race of races) {
    const season = race.season
    if (!seasons.has(season)) {
      seasons.set(season, {
        season,
        points: 0,
        wins: 0,
        rounds: new Set(),
      })
    }
    const s = seasons.get(season)
    s.rounds.add(race.round)

    // A constructor race entry can list both cars in Results.
    for (const r of race.Results ?? []) {
      const pts = Number(r.points) || 0
      points += pts
      s.points += pts
      if (r.positionText === '1') {
        wins += 1
        s.wins += 1
      }
    }
  }

  const history = [...seasons.values()]
    .map((s) => ({
      season: s.season,
      points: s.points,
      wins: s.wins,
      races: s.rounds.size,
    }))
    .sort((a, b) => Number(a.season) - Number(b.season))

  return {
    history,
    career: { points, wins, seasons: history.length },
  }
}
