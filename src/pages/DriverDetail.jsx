import { Link, useParams } from 'react-router-dom'
import {
  Flag,
  Trophy,
  Award,
  Timer,
  Gauge,
  Sigma,
  CalendarDays,
  ArrowLeft,
} from 'lucide-react'
import StatCounter from '../components/common/StatCounter.jsx'
import RaceLoader from '../components/reactbits/RaceLoader.jsx'
import AnimatedList from '../components/reactbits/AnimatedList.jsx'
import PointsProgression from '../components/charts/PointsProgression.jsx'
import SeasonResultsAccordion from '../components/drivers/SeasonResultsAccordion.jsx'
import DriverAvatar from '../components/drivers/DriverAvatar.jsx'
import { TableSkeleton } from '../components/common/LoadingSkeleton.jsx'
import ErrorState from '../components/common/ErrorState.jsx'
import { useDriver } from '../hooks/useDrivers.js'
import { useDriverProfile } from '../hooks/useDriverProfile.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { teamColor, teamColorAlpha } from '../lib/teamColors.js'
import { flag } from '../lib/nationality.js'

export default function DriverDetail() {
  const { driverId } = useParams()
  const { data: driver, isLoading, isError, refetch } = useDriver(driverId)
  // One bulk pass over race results powers all career stats + the season
  // history — a handful of requests instead of one per season.
  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useDriverProfile(driverId)

  const stats = profile?.stats
  const history = profile?.history

  useDocumentTitle(
    driver ? `${driver.givenName} ${driver.familyName} — Career Stats` : 'Driver',
    driver
      ? `Career statistics for ${driver.givenName} ${driver.familyName} — wins, podiums, poles and points.`
      : undefined,
  )

  if (isError) {
    return (
      <div className="section-pad pt-28">
        <ErrorState onRetry={refetch} />
      </div>
    )
  }

  // Latest team from season history drives the accent colour.
  const latest = history?.[history.length - 1]
  const accent = teamColor(latest?.constructorId)

  const statTiles = [
    { label: 'Races', value: stats?.races, icon: CalendarDays },
    { label: 'Wins', value: stats?.wins, icon: Trophy },
    { label: 'Podiums', value: stats?.podiums, icon: Award },
    { label: 'Poles', value: stats?.poles, icon: Gauge },
    { label: 'Fastest Laps', value: stats?.fastestLaps, icon: Timer },
    { label: 'Points', value: stats?.points, icon: Sigma },
  ]

  return (
    <div className="pb-16">
      {/* Hero band */}
      <div
        className="relative overflow-hidden pt-24"
        style={{
          background: `linear-gradient(135deg, ${teamColorAlpha(latest?.constructorId, 0.35)}, transparent 65%)`,
        }}
      >
        <div className="section-pad pb-10">
          <Link
            to="/drivers"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-white"
          >
            <ArrowLeft size={15} /> All drivers
          </Link>

          {isLoading ? (
            <div className="skeleton h-24 w-96 max-w-full" />
          ) : (
            driver && (
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-end gap-3 sm:gap-5">
                  <DriverAvatar
                    driver={driver}
                    accent={accent}
                    eager
                    initialsClassName="text-3xl sm:text-4xl"
                    className="h-20 w-20 shrink-0 border-2 border-white/10 shadow-xl shadow-black/40 sm:h-36 sm:w-36"
                  />
                  <div className="min-w-0">
                  <p className="font-display text-base text-text-dim sm:text-lg">
                    {flag(driver.nationality)} {driver.givenName}
                  </p>
                  <h1
                    className="font-display text-4xl font-900 uppercase leading-[0.9] sm:text-7xl"
                    style={{ transform: 'skewX(-6deg)' }}
                  >
                    {driver.familyName}
                  </h1>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-dim">
                    <span>{driver.nationality}</span>
                    {driver.dateOfBirth && (
                      <span>Born {formatDate(driver.dateOfBirth)}</span>
                    )}
                    {latest && (
                      <span style={{ color: accent }}>
                        Latest team: {latest.team}
                      </span>
                    )}
                    {driver.url && (
                      <a
                        href={driver.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-white"
                      >
                        Wikipedia ↗
                      </a>
                    )}
                  </div>
                  </div>
                </div>
                {driver.permanentNumber && (
                  <span
                    className="font-display text-5xl font-900 leading-none opacity-30 sm:text-8xl"
                    style={{ color: accent }}
                  >
                    #{driver.permanentNumber}
                  </span>
                )}
              </div>
            )
          )}
        </div>
      </div>

      <div className="section-pad">
        {/* Stat row */}
        {profileError ? (
          <div className="-mt-6">
            <ErrorState
              title="Couldn’t load career stats"
              onRetry={refetchProfile}
            />
          </div>
        ) : profileLoading ? (
          <div className="card-surface accent-top -mt-6 grid place-items-center py-10">
            <RaceLoader label="Timing the laps…" />
          </div>
        ) : (
          <div className="-mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {statTiles.map((t) => (
              <StatCounter
                key={t.label}
                label={t.label}
                value={t.value}
                icon={t.icon}
                accent={accent}
                loading={false}
              />
            ))}
          </div>
        )}

        {/* Chart + season table */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {profileError ? (
            <ErrorState
              title="Couldn’t load points progression"
              onRetry={refetchProfile}
            />
          ) : (
            <PointsProgression data={history} color={accent} />
          )}

          <div className="card-surface accent-top overflow-hidden">
            <h3 className="border-b border-border px-4 py-3 font-display text-lg font-bold">
              Season by Season
            </h3>
            {profileError ? (
              <div className="p-4">
                <ErrorState
                  title="Couldn’t load season history"
                  onRetry={refetchProfile}
                />
              </div>
            ) : !history ? (
              <div className="p-4">
                <TableSkeleton rows={6} />
              </div>
            ) : (
              <div className="max-h-[280px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-surface-2 text-left text-xs uppercase tracking-wide text-text-dim">
                    <tr>
                      <th className="px-4 py-2">Year</th>
                      <th className="px-4 py-2">Team</th>
                      <th className="px-4 py-2 text-center">Races</th>
                      <th className="px-4 py-2 text-right">Pts</th>
                      <th className="px-4 py-2 text-right">Wins</th>
                    </tr>
                  </thead>
                  <AnimatedList as="tbody" stagger={26} y={10}>
                    {[...history].reverse().map((h) => (
                      <tr key={h.season} className="border-t border-border/60">
                        <td className="px-4 py-2 font-semibold">{h.season}</td>
                        <td className="px-4 py-2">
                          <span
                            className="inline-flex items-center gap-1.5"
                            style={{ color: teamColor(h.constructorId) }}
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ background: teamColor(h.constructorId) }}
                            />
                            {h.team}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center text-text-dim">{h.races}</td>
                        <td className="px-4 py-2 text-right">{h.points}</td>
                        <td className="px-4 py-2 text-right">{h.wins}</td>
                      </tr>
                    ))}
                  </AnimatedList>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Race results accordions */}
        {history && history.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
              <Flag size={18} className="text-f1-red" /> Race Results by Season
            </h3>
            <div className="space-y-2">
              {[...history].reverse().slice(0, 12).map((h) => (
                <SeasonResultsAccordion
                  key={h.season}
                  driverId={driverId}
                  season={h.season}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
