import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'
import { seasonStaleTime } from '../lib/queryClient.js'

export function useDriverStandings(season) {
  return useQuery({
    queryKey: ['driverStandings', String(season)],
    enabled: !!season,
    staleTime: seasonStaleTime(season),
    queryFn: async () => {
      const data = await apiGet(`/${season}/driverstandings?limit=100`)
      const list = data.StandingsTable?.StandingsLists?.[0]
      return {
        season: list?.season ?? String(season),
        round: list?.round,
        standings: list?.DriverStandings ?? [],
      }
    },
  })
}

export function useConstructorStandings(season) {
  return useQuery({
    queryKey: ['constructorStandings', String(season)],
    enabled: !!season,
    staleTime: seasonStaleTime(season),
    queryFn: async () => {
      const data = await apiGet(`/${season}/constructorstandings?limit=100`)
      const list = data.StandingsTable?.StandingsLists?.[0]
      return {
        season: list?.season ?? String(season),
        round: list?.round,
        standings: list?.ConstructorStandings ?? [],
      }
    },
  })
}
