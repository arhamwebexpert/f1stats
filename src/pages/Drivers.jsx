import { useEffect, useMemo, useState } from 'react'
import { Users } from 'lucide-react'
import DriverGrid from '../components/drivers/DriverGrid.jsx'
import DriverFilterBar from '../components/drivers/DriverFilterBar.jsx'
import RaceLoader from '../components/reactbits/RaceLoader.jsx'
import SectionHeading from '../components/common/SectionHeading.jsx'
import ErrorState, { EmptyState } from '../components/common/ErrorState.jsx'
import { useDrivers } from '../hooks/useDrivers.js'
import { useChampionDrivers, useDriversInDecade } from '../hooks/useDriverFilters.js'
import { useDriverStandings } from '../hooks/useStandings.js'
import { useDebounce } from '../hooks/useDebounce.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { CURRENT_SEASON } from '../lib/queryClient.js'

const DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]
const PAGE_SIZE = 60

export default function Drivers() {
  useDocumentTitle('Drivers', 'Browse every Formula 1 driver from 1950 to today.')

  const { data: drivers, isLoading, isError, refetch } = useDrivers()
  const { data: currentStandings } = useDriverStandings(CURRENT_SEASON)

  const [search, setSearch] = useState('')
  const [nationality, setNationality] = useState('')
  const [decade, setDecade] = useState('')
  const [championsOnly, setChampionsOnly] = useState(false)
  const [visible, setVisible] = useState(PAGE_SIZE)

  // Only fetches once the toggle is actually turned on (it's ~76 requests
  // the first time, one per season — cached forever after).
  const { data: champions, isLoading: championsLoading } = useChampionDrivers(championsOnly)

  const debouncedSearch = useDebounce(search, 300)
  const { ids: decadeIds } = useDriversInDecade(decade)

  // driverId → constructorId for current grid (team-color borders)
  const teamByDriver = useMemo(() => {
    const map = {}
    currentStandings?.standings?.forEach((s) => {
      map[s.Driver.driverId] = s.Constructors?.[0]?.constructorId
    })
    return map
  }, [currentStandings])

  const nationalities = useMemo(() => {
    if (!drivers) return []
    // Trim + drop falsies so whitespace-variant demonyms don't become
    // duplicate <option> keys ("British" vs "British ").
    const clean = drivers.map((d) => d.nationality?.trim()).filter(Boolean)
    return [...new Set(clean)].sort()
  }, [drivers])

  const filtered = useMemo(() => {
    if (!drivers) return []
    const q = debouncedSearch.trim().toLowerCase()
    return drivers.filter((d) => {
      if (q) {
        const name = `${d.givenName} ${d.familyName}`.toLowerCase()
        if (!name.includes(q)) return false
      }
      if (nationality && d.nationality !== nationality) return false
      if (championsOnly && champions && !champions.has(d.driverId)) return false
      if (decade && decadeIds && !decadeIds.has(d.driverId)) return false
      return true
    })
  }, [drivers, debouncedSearch, nationality, championsOnly, champions, decade, decadeIds])

  // reset pagination when filters change
  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [debouncedSearch, nationality, decade, championsOnly])

  if (isError) {
    return (
      <div className="section-pad pt-28">
        <ErrorState onRetry={refetch} />
      </div>
    )
  }

  const shown = filtered.slice(0, visible)
  const waitingOnChampions = championsOnly && championsLoading

  return (
    <div className="section-pad pb-16 pt-24">
      <SectionHeading
        eyebrow="1950 → today"
        title="The"
        accent="Drivers"
        className="mb-6"
      />
      <p className="-mt-4 mb-6 text-text-dim">
        Every name to start a Formula 1 Grand Prix since 1950.
      </p>

      <DriverFilterBar
        search={search}
        onSearch={setSearch}
        nationality={nationality}
        onNationality={setNationality}
        nationalities={nationalities}
        decade={decade}
        onDecade={setDecade}
        decades={DECADES}
        championsOnly={championsOnly}
        onChampionsOnly={setChampionsOnly}
        resultCount={filtered.length}
      />

      {isLoading ? (
        <div className="grid place-items-center py-20">
          <RaceLoader size="lg" label="Assembling the grid…" />
        </div>
      ) : waitingOnChampions ? (
        <div className="grid place-items-center py-20">
          <RaceLoader size="lg" label="Building the all-time champions list…" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No drivers match"
          message="Try clearing a filter or searching a different name."
        />
      ) : (
        <>
          <DriverGrid drivers={shown} teamByDriver={teamByDriver} />
          {visible < filtered.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="btn-ghost"
              >
                Load more ({filtered.length - visible} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
