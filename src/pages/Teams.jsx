import { useMemo, useState } from 'react'
import { Search, LayoutGrid } from 'lucide-react'
import TeamGrid from '../components/teams/TeamGrid.jsx'
import RaceLoader from '../components/reactbits/RaceLoader.jsx'
import SectionHeading from '../components/common/SectionHeading.jsx'
import ErrorState, { EmptyState } from '../components/common/ErrorState.jsx'
import { useConstructors } from '../hooks/useConstructors.js'
import { useConstructorStandings } from '../hooks/useStandings.js'
import { useDebounce } from '../hooks/useDebounce.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { CURRENT_SEASON } from '../lib/queryClient.js'
import { TEAM_COLORS } from '../lib/teamColors.js'

export default function Teams() {
  useDocumentTitle('Teams', 'Every Formula 1 constructor from 1950 to today.')

  const { data: teams, isLoading, isError, refetch } = useConstructors()
  const { data: current } = useConstructorStandings(CURRENT_SEASON)
  const [search, setSearch] = useState('')
  const [currentOnly, setCurrentOnly] = useState(false)
  const debounced = useDebounce(search, 300)

  const currentIds = useMemo(
    () => new Set(current?.standings?.map((s) => s.Constructor.constructorId)),
    [current],
  )

  const filtered = useMemo(() => {
    if (!teams) return []
    const q = debounced.trim().toLowerCase()
    return teams
      .filter((t) => (q ? t.name.toLowerCase().includes(q) : true))
      .filter((t) => (currentOnly ? currentIds.has(t.constructorId) : true))
      .sort((a, b) => {
        // Known-brand teams first for visual richness.
        const ak = TEAM_COLORS[a.constructorId] ? 0 : 1
        const bk = TEAM_COLORS[b.constructorId] ? 0 : 1
        if (ak !== bk) return ak - bk
        return a.name.localeCompare(b.name)
      })
  }, [teams, debounced, currentOnly, currentIds])

  if (isError) {
    return (
      <div className="section-pad pt-28">
        <ErrorState onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className="section-pad pb-16 pt-24">
      <SectionHeading
        eyebrow="The machines & their makers"
        title="The"
        accent="Constructors"
        className="mb-6"
      />
      <p className="-mt-4 mb-6 text-text-dim">
        Every team to enter a Formula 1 World Championship.
      </p>

      <div className="sticky top-16 z-30 mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-bg/85 p-3 backdrop-blur-md">
        <div className="relative flex-1 basis-64">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-dim"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teams…"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-f1-red"
          />
        </div>
        <label className="flex cursor-pointer select-none items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={currentOnly}
            onChange={(e) => setCurrentOnly(e.target.checked)}
            className="peer sr-only"
          />
          <span className="relative h-5 w-9 rounded-full bg-border transition-colors peer-checked:bg-f1-red">
            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
          </span>
          {CURRENT_SEASON} grid only
        </label>
        <span className="ml-auto text-xs text-text-dim">{filtered.length} teams</span>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-20">
          <RaceLoader size="lg" label="Rolling out the garage…" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="No teams match" />
      ) : (
        <TeamGrid teams={filtered} />
      )}
    </div>
  )
}
