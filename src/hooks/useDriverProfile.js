import { useQuery } from '@tanstack/react-query'
import { apiGet, apiCount } from '../lib/api.js'

// One bulk pass over a driver's race results powers almost the entire driver
// page — career totals AND season-by-season history — in a handful of calls
// instead of one-standings-call-per-season. A 400-race veteran is ~5 pages
// (100/page) + 1 poles count, vs ~30 requests the old way.
//
// Poles still need the qualifying endpoint (grid position can differ from
// qualifying due to penalties), so that stays a separate count call.
export function useDriverProfile(driverId) {
  return useQuery({
    queryKey: ['driverProfile', driverId],
    enabled: !!driverId,
    staleTime: Infinity,
    queryFn: async () => {
      // Page 1 tells us the total; fetch the rest in parallel.
      const first = await apiGet(`/drivers/${driverId}/results?limit=100&offset=0`)
      const total = Number(first.total) || 0
      let races = first.RaceTable?.Races ?? []

      const pages = Math.ceil(total / 100)
      if (pages > 1) {
        const rest = await Promise.all(
          Array.from({ length: pages - 1 }, (_, i) =>
            apiGet(`/drivers/${driverId}/results?limit=100&offset=${(i + 1) * 100}`),
          ),
        )
        rest.forEach((d) => {
          races = races.concat(d.RaceTable?.Races ?? [])
        })
      }

      const poles = await apiCount(`/drivers/${driverId}/qualifying/1`)

      return aggregate(races, poles)
    },
  })
}

function aggregate(races, poles) {
  let wins = 0
  let podiums = 0
  let fastestLaps = 0
  let points = 0
  const seasons = new Map()

  for (const race of races) {
    const r = race.Results?.[0]
    if (!r) continue
    const pos = Number(r.position) // NaN for DNF/DNS/etc.
    const pts = Number(r.points) || 0
    const isWin = r.positionText === '1'
    const isPodium = pos === 1 || pos === 2 || pos === 3
    const isFastest = r.FastestLap?.rank === '1'

    if (isWin) wins += 1
    if (isPodium) podiums += 1
    if (isFastest) fastestLaps += 1
    points += pts

    const season = race.season
    if (!seasons.has(season)) {
      seasons.set(season, {
        season,
        races: 0,
        wins: 0,
        podiums: 0,
        points: 0,
        team: '—',
        constructorId: undefined,
      })
    }
    const s = seasons.get(season)
    s.races += 1
    s.points += pts
    if (isWin) s.wins += 1
    if (isPodium) s.podiums += 1
    // Latest constructor seen in the season becomes its team label.
    if (r.Constructor) {
      s.team = r.Constructor.name
      s.constructorId = r.Constructor.constructorId
    }
  }

  const history = [...seasons.values()].sort(
    (a, b) => Number(a.season) - Number(b.season),
  )

  return {
    stats: { races: races.length, wins, podiums, poles, fastestLaps, points },
    history,
  }
}
