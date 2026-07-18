import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.js'

// Fetch-all drivers across pages. ~860 total → ~9 pages of 100.
// Cached forever (the historical roster is stable).
export function useDrivers() {
  return useQuery({
    queryKey: ['drivers', 'all'],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: async () => {
      const first = await apiGet('/drivers?limit=100&offset=0')
      const total = Number(first.total) || 0
      let drivers = first.DriverTable?.Drivers ?? []
      const pages = Math.ceil(total / 100)
      for (let page = 1; page < pages; page++) {
        const data = await apiGet(`/drivers?limit=100&offset=${page * 100}`)
        drivers = drivers.concat(data.DriverTable?.Drivers ?? [])
      }
      return drivers
    },
  })
}

export function useDriver(driverId) {
  return useQuery({
    queryKey: ['driver', driverId],
    enabled: !!driverId,
    staleTime: Infinity,
    queryFn: async () => {
      const data = await apiGet(`/drivers/${driverId}`)
      return data.DriverTable?.Drivers?.[0] ?? null
    },
  })
}

// Which seasons a driver competed in (used for the season table + charts).
export function useDriverSeasons(driverId) {
  return useQuery({
    queryKey: ['driverSeasons', driverId],
    enabled: !!driverId,
    staleTime: Infinity,
    queryFn: async () => {
      const data = await apiGet(`/drivers/${driverId}/seasons?limit=100`)
      return (data.SeasonTable?.Seasons ?? []).map((s) => s.season)
    },
  })
}
