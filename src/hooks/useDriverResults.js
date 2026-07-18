import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

// Every race result for a driver in one season → results accordion.
export function useDriverSeasonResults(driverId, season) {
  return useQuery({
    queryKey: ['driverSeasonResults', driverId, String(season)],
    enabled: !!driverId && !!season,
    staleTime: Infinity,
    queryFn: async () => {
      const data = await apiGet(`/${season}/drivers/${driverId}/results?limit=100`)
      return data.RaceTable?.Races ?? []
    },
  })
}
