import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import DriverAvatar from '../drivers/DriverAvatar.jsx'
import AnimatedList from '../reactbits/AnimatedList.jsx'
import { TableSkeleton } from '../common/LoadingSkeleton.jsx'
import { useConstructorDrivers } from '../../hooks/useConstructors.js'
import { flag } from '../../lib/nationality.js'
import { CURRENT_SEASON } from '../../lib/queryClient.js'

// Team driver roster: the current-season line-up shown large, plus the full
// all-time roster as a lazy-loading avatar grid (current drivers ringed).
export default function TeamRoster({ constructorId, accent }) {
  const { data: current } = useConstructorDrivers(constructorId, CURRENT_SEASON)
  const { data: all, isLoading } = useConstructorDrivers(constructorId)

  const currentIds = new Set((current ?? []).map((d) => d.driverId))
  // Current drivers first, then the rest of the all-time roster.
  const roster = [...(all ?? [])].sort((a, b) => {
    const ac = currentIds.has(a.driverId) ? 0 : 1
    const bc = currentIds.has(b.driverId) ? 0 : 1
    return ac - bc
  })

  return (
    <section className="mt-10">
      <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
        <Users size={18} className="text-f1-red" /> Drivers
      </h3>

      {/* Current line-up */}
      {current?.length > 0 && (
        <>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-dim">
            {CURRENT_SEASON} line-up
          </p>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {current.map((d) => (
              <Link
                key={d.driverId}
                to={`/drivers/${d.driverId}`}
                className="card-surface group overflow-hidden transition-colors hover:border-white/20"
                style={{ borderTop: `3px solid ${accent}` }}
              >
                <div className="relative">
                  <DriverAvatar
                    driver={d}
                    accent={accent}
                    rounded="rounded-none"
                    initialsClassName="text-4xl"
                    className="aspect-square w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                </div>
                <div className="p-3">
                  <p className="font-display font-bold leading-tight group-hover:text-f1-red">
                    {flag(d.nationality)} {d.familyName}
                  </p>
                  <p className="text-xs text-text-dim">{d.givenName}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* All-time roster */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-dim">
        All-time roster {all ? `· ${all.length}` : ''}
      </p>
      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : (
        <AnimatedList
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6"
          stagger={20}
          y={12}
        >
          {roster.map((d) => {
            const isCurrent = currentIds.has(d.driverId)
            return (
              <Link
                key={d.driverId}
                to={`/drivers/${d.driverId}`}
                className="group flex flex-col items-center text-center"
              >
                <div
                  className="w-full max-w-[84px] rounded-full transition-transform group-hover:scale-105"
                  style={
                    isCurrent
                      ? { boxShadow: `0 0 0 2px ${accent}, 0 0 0 4px #0a0a0f` }
                      : undefined
                  }
                >
                  <DriverAvatar
                    driver={d}
                    accent={accent}
                    rounded="rounded-full"
                    initialsClassName="text-lg"
                    className="aspect-square w-full"
                  />
                </div>
                <span className="mt-2 text-xs font-semibold leading-tight group-hover:text-f1-red">
                  {d.familyName}
                </span>
                {isCurrent && (
                  <span
                    className="mt-0.5 text-[10px] font-bold uppercase"
                    style={{ color: accent }}
                  >
                    Current
                  </span>
                )}
              </Link>
            )
          })}
        </AnimatedList>
      )}
    </section>
  )
}
