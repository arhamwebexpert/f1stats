import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, CalendarDays, Timer } from 'lucide-react'
import { useRaceResults } from '../hooks/useSeasons.js'
import { TableSkeleton } from '../components/common/LoadingSkeleton.jsx'
import SplitText from '../components/reactbits/SplitText.jsx'
import ShinyText from '../components/reactbits/ShinyText.jsx'
import AnimatedList from '../components/reactbits/AnimatedList.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { teamColor } from '../lib/teamColors.js'
import { flag } from '../lib/nationality.js'

export default function RaceDetail() {
  const { year, round } = useParams()
  const { data: race, isLoading, isError, refetch } = useRaceResults(year, round)

  useDocumentTitle(
    race ? `${race.raceName} ${year}` : `${year} Race`,
    race ? `Full classification for the ${year} ${race.raceName}.` : undefined,
  )

  if (isError) {
    return (
      <div className="section-pad pt-28">
        <ErrorState onRetry={refetch} />
      </div>
    )
  }

  const results = race?.Results ?? []
  const fastest = results.find((r) => r.FastestLap?.rank === '1')

  return (
    <div className="section-pad pb-16 pt-24">
      <Link
        to="/seasons"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-white"
      >
        <ArrowLeft size={15} /> Season archive
      </Link>

      {isLoading ? (
        <div className="skeleton mb-6 h-16 w-96 max-w-full" />
      ) : (
        race && (
          <header className="mb-6">
            <ShinyText
              as="p"
              className="font-display text-xs uppercase tracking-[0.25em]"
            >
              Round {race.round} · {year}
            </ShinyText>
            <h1
              className="font-display text-3xl font-900 uppercase leading-tight sm:text-5xl"
              style={{ transform: 'skewX(-5deg)' }}
            >
              <SplitText text={race.raceName} delay={18} className="inline-block" />
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-dim">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={14} /> {race.Circuit?.circuitName},{' '}
                {race.Circuit?.Location?.locality}, {race.Circuit?.Location?.country}
              </span>
              {race.date && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} /> {formatDate(race.date)}
                </span>
              )}
              {fastest && (
                <span className="inline-flex items-center gap-1.5 text-purple-300">
                  <Timer size={14} /> Fastest lap:{' '}
                  {fastest.Driver.familyName} ({fastest.FastestLap?.Time?.time})
                </span>
              )}
            </div>
          </header>
        )
      )}

      {isLoading ? (
        <TableSkeleton rows={12} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <caption className="sr-only">Race classification</caption>
            <thead>
              <tr className="bg-surface-2 text-left text-xs uppercase tracking-wider text-text-dim">
                <th className="w-12 px-4 py-3">Pos</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3 text-center">Grid</th>
                <th className="px-4 py-3 text-center">Δ</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Pts</th>
              </tr>
            </thead>
            <AnimatedList as="tbody" stagger={28} y={10}>
              {results.map((r) => {
                const grid = Number(r.grid)
                const pos = Number(r.position)
                const delta = grid && pos ? grid - pos : 0
                const isFastest = r.FastestLap?.rank === '1'
                return (
                  <tr
                    key={r.position}
                    className={`border-t border-border ${
                      isFastest ? 'bg-purple-500/10' : 'bg-surface hover:bg-surface-2'
                    }`}
                  >
                    <td className="px-4 py-3 font-display text-lg font-bold">
                      {r.positionText}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/drivers/${r.Driver.driverId}`}
                        className="font-semibold hover:text-f1-red"
                      >
                        {flag(r.Driver.nationality)} {r.Driver.givenName}{' '}
                        {r.Driver.familyName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/teams/${r.Constructor.constructorId}`}
                        className="inline-flex items-center gap-1.5 text-text-dim hover:text-white"
                        style={{ color: teamColor(r.Constructor.constructorId) }}
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: teamColor(r.Constructor.constructorId) }}
                        />
                        {r.Constructor.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center text-text-dim">{r.grid}</td>
                    <td className="px-4 py-3 text-center">
                      {delta === 0 ? (
                        <span className="text-text-dim">—</span>
                      ) : delta > 0 ? (
                        <span className="text-green-400">▲{delta}</span>
                      ) : (
                        <span className="text-red-400">▼{Math.abs(delta)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-dim">{r.status}</td>
                    <td className="px-4 py-3 text-right font-semibold">{r.points}</td>
                  </tr>
                )
              })}
            </AnimatedList>
          </table>
        </div>
      )}
    </div>
  )
}

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
