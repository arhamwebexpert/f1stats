import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useDriverSeasonResults } from '../../hooks/useDriverResults.js'
import { TableSkeleton } from '../common/LoadingSkeleton.jsx'

// Expandable per-season race-by-race results for a driver.
export default function SeasonResultsAccordion({ driverId, season }) {
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useDriverSeasonResults(driverId, open ? season : null)

  return (
    <div className="card-surface">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-display font-bold hover:bg-surface-2"
      >
        <span>{season} — race results</span>
        <ChevronDown
          size={18}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-border p-4">
          {isLoading ? (
            <TableSkeleton rows={6} />
          ) : !data?.length ? (
            <p className="text-sm text-text-dim">No results for this season.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-text-dim">
                  <th className="py-2">Rd</th>
                  <th className="py-2">Grand Prix</th>
                  <th className="py-2 text-center">Grid</th>
                  <th className="py-2 text-center">Finish</th>
                  <th className="py-2 text-right">Pts</th>
                </tr>
              </thead>
              <tbody>
                {data.map((race) => {
                  const r = race.Results?.[0]
                  return (
                    <tr key={race.round} className="border-t border-border/60">
                      <td className="py-2 text-text-dim">{race.round}</td>
                      <td className="py-2">{race.raceName}</td>
                      <td className="py-2 text-center text-text-dim">{r?.grid ?? '—'}</td>
                      <td className="py-2 text-center font-semibold">
                        {r?.positionText ?? '—'}
                      </td>
                      <td className="py-2 text-right">{r?.points ?? '0'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
