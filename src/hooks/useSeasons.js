import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'
import { seasonStaleTime } from '../lib/queryClient.js'

export function useSeasons() {
  return useQuery({
    queryKey: ['seasons'],
    staleTime: Infinity,
    queryFn: async () => {
      const data = await apiGet('/seasons?limit=100')
      return (data.SeasonTable?.Seasons ?? []).map((s) => s.season)
    },
  })
}

export function useRaceCalendar(season) {
  return useQuery({
    queryKey: ['raceCalendar', String(season)],
    enabled: !!season,
    staleTime: seasonStaleTime(season),
    queryFn: async () => {
      const data = await apiGet(`/${season}?limit=100`)
      return data.RaceTable?.Races ?? []
    },
  })
}

export function useRaceResults(season, round) {
  return useQuery({
    queryKey: ['raceResults', String(season), String(round)],
    enabled: !!season && !!round,
    staleTime: seasonStaleTime(season),
    queryFn: async () => {
      const data = await apiGet(`/${season}/${round}/results?limit=100`)
      const race = data.RaceTable?.Races?.[0]
      return race ?? null
    },
  })
}
