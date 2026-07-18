import { useNavigate, useParams } from 'react-router-dom'
import StandingsTable from '../components/standings/StandingsTable.jsx'
import SeasonPicker from '../components/common/SeasonPicker.jsx'
import SectionHeading from '../components/common/SectionHeading.jsx'
import { TableSkeleton } from '../components/common/LoadingSkeleton.jsx'
import ErrorState, { EmptyState } from '../components/common/ErrorState.jsx'
import { useDriverStandings, useConstructorStandings } from '../hooks/useStandings.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { CURRENT_SEASON } from '../lib/queryClient.js'
import { useState } from 'react'

export default function Standings() {
  const { season = String(CURRENT_SEASON) } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('drivers')

  useDocumentTitle(
    `${season} Standings`,
    `Formula 1 ${season} driver and constructor championship standings.`,
  )

  const driversQ = useDriverStandings(season)
  const teamsQ = useConstructorStandings(season)
  const active = tab === 'drivers' ? driversQ : teamsQ
  const rows = active.data?.standings ?? []

  return (
    <div className="section-pad pb-16 pt-24">
      <SectionHeading
        eyebrow={active.data?.round ? `After round ${active.data.round}` : 'World Championship'}
        title={season}
        accent="Standings"
        className="mb-6"
        action={
          <SeasonPicker
            value={season}
            onChange={(s) => navigate(`/standings/${s}`)}
          />
        }
      />

      {/* toggle */}
      <div className="mb-6 inline-flex rounded-lg border border-border bg-surface p-1">
        {['drivers', 'constructors'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t === 'constructors' ? 'teams' : 'drivers')}
            className={`rounded-md px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
              (tab === 'drivers') === (t === 'drivers')
                ? 'bg-f1-red text-white'
                : 'text-text-dim hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {active.isError ? (
        <ErrorState onRetry={active.refetch} />
      ) : active.isLoading ? (
        <TableSkeleton rows={12} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No standings"
          message={`The ${season} season may not have data yet.`}
        />
      ) : (
        <StandingsTable
          rows={rows}
          type={tab === 'drivers' ? 'drivers' : 'teams'}
        />
      )}
    </div>
  )
}
