import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Trophy, Gauge, CalendarDays, Sigma } from 'lucide-react'
import StatCounter from '../components/common/StatCounter.jsx'
import RaceLoader from '../components/reactbits/RaceLoader.jsx'
import AnimatedList from '../components/reactbits/AnimatedList.jsx'
import TeamRoster from '../components/teams/TeamRoster.jsx'
import PointsArea from '../components/charts/PointsArea.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import {
  useConstructor,
  useConstructorStats,
  useConstructorProfile,
} from '../hooks/useConstructors.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { teamColor, teamColorAlpha } from '../lib/teamColors.js'
import { flag } from '../lib/nationality.js'

export default function TeamDetail() {
  const { constructorId } = useParams()
  const { data: team, isLoading, isError, refetch } = useConstructor(constructorId)
  const {
    data: stats,
    isError: statsError,
  } = useConstructorStats(constructorId)
  // One bulk pass over race results → season history + career totals.
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useConstructorProfile(constructorId)

  const history = profile?.history
  const career = profile?.career

  useDocumentTitle(
    team ? `${team.name} — Team Stats` : 'Team',
    team ? `Formula 1 history and statistics for ${team.name}.` : undefined,
  )

  if (isError) {
    return (
      <div className="section-pad pt-28">
        <ErrorState onRetry={refetch} />
      </div>
    )
  }

  const accent = teamColor(constructorId)

  const statTiles = [
    { label: 'Seasons', value: career?.seasons, icon: CalendarDays },
    { label: 'Race Wins', value: stats?.wins, icon: Trophy },
    { label: 'Poles', value: stats?.poles, icon: Gauge },
    { label: 'Points', value: career?.points, icon: Sigma },
  ]

  return (
    <div className="pb-16">
      <div
        className="relative overflow-hidden pt-24"
        style={{
          background: `linear-gradient(135deg, ${teamColorAlpha(constructorId, 0.4)}, transparent 65%)`,
        }}
      >
        <div className="section-pad pb-10">
          <Link
            to="/teams"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-white"
          >
            <ArrowLeft size={15} /> All teams
          </Link>
          {isLoading ? (
            <div className="skeleton h-20 w-96 max-w-full" />
          ) : (
            team && (
              <>
                <div
                  className="mb-3 h-1.5 w-24 rounded-full"
                  style={{ background: accent }}
                />
                <h1
                  className="font-display text-4xl font-900 uppercase leading-[0.9] sm:text-6xl"
                  style={{ transform: 'skewX(-6deg)' }}
                >
                  {team.name}
                </h1>
                <div className="mt-3 flex flex-wrap gap-x-5 text-sm text-text-dim">
                  <span>{flag(team.nationality)} {team.nationality}</span>
                  {team.url && (
                    <a href={team.url} target="_blank" rel="noreferrer" className="hover:text-white">
                      Wikipedia ↗
                    </a>
                  )}
                </div>
              </>
            )
          )}
        </div>
      </div>

      <div className="section-pad">
        {statsError && profileError ? (
          <div className="-mt-6">
            <ErrorState title="Couldn’t load team stats" onRetry={refetch} />
          </div>
        ) : (
          <div className="-mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {statTiles.map((t) => (
              <StatCounter
                key={t.label}
                label={t.label}
                value={t.value}
                icon={t.icon}
                accent={accent}
                loading={t.value == null && !statsError && !profileError}
              />
            ))}
          </div>
        )}

        {/* Driver roster (current line-up + all-time) */}
        <TeamRoster constructorId={constructorId} accent={accent} />

        <div className="mt-10">
          {profileError ? (
            <ErrorState title="Couldn’t load points history" onRetry={refetchProfile} />
          ) : profileLoading ? (
            <div className="card-surface accent-top grid place-items-center py-16">
              <RaceLoader label="Poring over the results…" />
            </div>
          ) : (
            <PointsArea data={history} color={accent} />
          )}
        </div>

        {/* Season roster / results */}
        {!profileError && history && (
          <div className="card-surface accent-top mt-10 overflow-hidden">
            <h3 className="border-b border-border px-4 py-3 font-display text-lg font-bold">
              Season by Season
            </h3>
            <div className="max-h-[360px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-surface-2 text-left text-xs uppercase tracking-wide text-text-dim">
                  <tr>
                    <th className="px-4 py-2">Year</th>
                    <th className="px-4 py-2 text-center">Races</th>
                    <th className="px-4 py-2 text-right">Pts</th>
                    <th className="px-4 py-2 text-right">Wins</th>
                  </tr>
                </thead>
                <AnimatedList as="tbody" stagger={22} y={10}>
                  {[...history].reverse().map((h) => (
                    <tr key={h.season} className="border-t border-border/60">
                      <td className="px-4 py-2 font-semibold">{h.season}</td>
                      <td className="px-4 py-2 text-center text-text-dim">{h.races}</td>
                      <td className="px-4 py-2 text-right">{h.points}</td>
                      <td className="px-4 py-2 text-right">{h.wins}</td>
                    </tr>
                  ))}
                </AnimatedList>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
