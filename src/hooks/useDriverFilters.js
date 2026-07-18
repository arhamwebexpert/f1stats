import { useQueries, useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

// All drivers who have ever won a championship (finished a season P1).
// The standings API only supports season-scoped queries (no flat
// "all-time champions" endpoint exists), so this fetches every season, then
// each season's P1 driver, in parallel. ~76 requests the first time it
// fires — cached forever after — so it's gated behind `enabled` and only
// triggered when the "Champions only" filter is actually turned on.
export function useChampionDrivers(enabled = true) {
  return useQuery({
    queryKey: ['championDrivers'],
    enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: async () => {
      const seasonsData = await apiGet('/seasons?limit=100')
      const seasons = (seasonsData.SeasonTable?.Seasons ?? []).map((s) => s.season)

      const perSeason = await Promise.all(
        seasons.map((season) => apiGet(`/${season}/driverstandings/1`)),
      )

      const ids = new Set()
      perSeason.forEach((data) => {
        const champion = data.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0]
        if (champion?.Driver?.driverId) ids.add(champion.Driver.driverId)
      })
      return ids
    },
  })
}

// Driver IDs active within a decade. Only fires when a decade is selected;
// unions the roster of each year in the decade (≤10 spaced requests, cached).
export function useDriversInDecade(decade) {
  const start = Number(decade)
  const years = decade
    ? Array.from({ length: 10 }, (_, i) => start + i).filter(
        (y) => y <= new Date().getFullYear(),
      )
    : []

  const results = useQueries({
    queries: years.map((year) => ({
      queryKey: ['seasonDrivers', String(year)],
      staleTime: Infinity,
      queryFn: async () => {
        const data = await apiGet(`/${year}/drivers?limit=100`)
        return (data.DriverTable?.Drivers ?? []).map((d) => d.driverId)
      },
    })),
  })

  const isLoading = decade ? results.some((r) => r.isLoading) : false
  const ids = new Set()
  results.forEach((r) => r.data?.forEach((id) => ids.add(id)))

  return { ids: decade ? ids : null, isLoading }
}
