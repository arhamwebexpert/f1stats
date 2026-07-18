import { useState } from 'react'
import AnimatedList from '../reactbits/AnimatedList.jsx'
import { teamColor } from '../../lib/teamColors.js'

// Joins session_result rows with driver identities into a timing board.
export default function LiveTimingBoard({ results, drivers, sessionType }) {
  const byNumber = new Map((drivers ?? []).map((d) => [d.driver_number, d]))

  const rows = [...(results ?? [])].sort((a, b) => {
    const pa = a.position ?? 999
    const pb = b.position ?? 999
    return pa - pb
  })

  const isRace = sessionType === 'Race'

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <caption className="sr-only">Session classification</caption>
        <thead>
          <tr className="bg-surface-2 text-left text-xs uppercase tracking-wider text-text-dim">
            <th scope="col" className="w-12 px-4 py-3">Pos</th>
            <th scope="col" className="px-4 py-3">Driver</th>
            <th scope="col" className="px-4 py-3 text-center">Laps</th>
            <th scope="col" className="px-4 py-3 text-right">
              {isRace ? 'Gap' : 'Gap to leader'}
            </th>
            <th scope="col" className="px-4 py-3 text-right">Status</th>
          </tr>
        </thead>
        <AnimatedList as="tbody" stagger={26} y={10}>
          {rows.map((r, i) => {
            const d = byNumber.get(r.driver_number)
            const color = d?.team_colour ? `#${d.team_colour}` : teamColor()
            return (
              <tr
                key={r.driver_number ?? i}
                className="border-t border-border bg-surface hover:bg-surface-2"
              >
                <td className="px-4 py-3 font-display text-lg font-bold">
                  {r.position ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <DriverChip driver={d} number={r.driver_number} color={color} />
                    <div className="leading-tight">
                      <span className="font-semibold">
                        {d?.full_name ?? `#${r.driver_number}`}
                      </span>
                      {d?.team_name && (
                        <span className="block text-xs" style={{ color }}>
                          {d.team_name}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-text-dim">
                  {r.number_of_laps ?? '—'}
                </td>
                <td className="px-4 py-3 text-right font-display tabular-nums">
                  {formatGap(r)}
                </td>
                <td className="px-4 py-3 text-right">
                  <StatusBadge result={r} />
                </td>
              </tr>
            )
          })}
        </AnimatedList>
      </table>
    </div>
  )
}

function DriverChip({ driver, number, color }) {
  const [errored, setErrored] = useState(false)
  if (driver?.headshot_url && !errored) {
    return (
      <img
        src={driver.headshot_url}
        alt=""
        loading="lazy"
        onError={() => setErrored(true)}
        className="h-9 w-9 shrink-0 rounded-full bg-surface-2 object-cover"
        style={{ boxShadow: `0 0 0 2px ${color}` }}
      />
    )
  }
  return (
    <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-xs font-bold"
      style={{ background: `${color}33`, color, boxShadow: `0 0 0 2px ${color}` }}
    >
      {number ?? '?'}
    </span>
  )
}

function StatusBadge({ result }) {
  const map = [
    ['dsq', 'DSQ', 'text-red-400'],
    ['dnf', 'DNF', 'text-orange-400'],
    ['dns', 'DNS', 'text-text-dim'],
  ]
  for (const [key, label, cls] of map) {
    if (result[key]) return <span className={`text-xs font-bold ${cls}`}>{label}</span>
  }
  return <span className="text-xs text-text-dim">—</span>
}

function formatGap(r) {
  if (r.position === 1) return 'Leader'
  const g = r.gap_to_leader
  if (g == null || g === '') return '—'
  if (typeof g === 'string') return g // e.g. "+1 LAP"
  return `+${Number(g).toFixed(3)}s`
}
