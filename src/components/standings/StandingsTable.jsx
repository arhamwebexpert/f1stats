import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PointsBar from './PointsBar.jsx'
import CountUp from '../reactbits/CountUp.jsx'
import { motion, stagger, prefersReducedMotion } from '../../lib/anim.js'
import { teamColor } from '../../lib/teamColors.js'
import { flag } from '../../lib/nationality.js'

// Renders either driver or constructor standings. `type` = 'drivers' | 'teams'.
export default function StandingsTable({ rows, type = 'drivers' }) {
  const bodyRef = useRef(null)
  const leader = Math.max(1, ...rows.map((r) => Number(r.points) || 0))

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    const bars = el.querySelectorAll('.points-bar')
    if (prefersReducedMotion()) {
      bars.forEach((b) => (b.style.width = `${b.dataset.pct}%`))
    } else {
      motion(bars, {
        width: (b) => `${b.dataset.pct}%`,
        duration: 900,
        delay: stagger(55),
        ease: 'outExpo',
      })
    }
    const rowsEls = el.querySelectorAll('.standings-row')
    motion(rowsEls, {
      opacity: [0, 1],
      translateX: [-16, 0],
      duration: 420,
      delay: stagger(45),
      ease: 'outQuad',
    })
  }, [rows, type])

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          {type === 'drivers' ? 'Driver' : 'Constructor'} championship standings
        </caption>
        <thead>
          <tr className="bg-surface-2 text-left text-xs uppercase tracking-wider text-text-dim">
            <th scope="col" className="w-14 px-4 py-3">Pos</th>
            <th scope="col" className="px-4 py-3">
              {type === 'drivers' ? 'Driver' : 'Constructor'}
            </th>
            <th scope="col" className="hidden px-4 py-3 sm:table-cell">
              {type === 'drivers' ? 'Team' : 'Nationality'}
            </th>
            <th scope="col" className="px-4 py-3 text-right">Pts</th>
            <th scope="col" className="w-14 px-4 py-3 text-right">Wins</th>
          </tr>
        </thead>
        <tbody ref={bodyRef}>
          {rows.map((row, i) => {
            const pct = (Number(row.points) / leader) * 100
            const isP1 = i === 0
            const meta = normalize(row, type)
            return (
              <tr
                key={meta.id || i}
                className={`standings-row relative border-t border-border ${
                  isP1 ? 'gold-shimmer' : 'bg-surface hover:bg-surface-2'
                }`}
                style={{ opacity: 0 }}
              >
                <td className="relative px-4 py-3">
                  <PointsBar pct={pct} color={meta.color} />
                  <span
                    className={`relative z-10 font-display text-lg font-bold ${
                      isP1 ? 'text-yellow-300' : ''
                    }`}
                  >
                    {row.position}
                  </span>
                </td>
                <td className="relative z-10 px-4 py-3">
                  {meta.link ? (
                    <Link to={meta.link} className="font-semibold hover:text-f1-red">
                      {meta.flag} {meta.name}
                    </Link>
                  ) : (
                    <span className="font-semibold">
                      {meta.flag} {meta.name}
                    </span>
                  )}
                </td>
                <td className="relative z-10 hidden px-4 py-3 text-text-dim sm:table-cell">
                  {meta.sub && (
                    <span
                      className="inline-flex items-center gap-1.5"
                      style={{ color: meta.color }}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: meta.color }}
                      />
                      {meta.sub}
                    </span>
                  )}
                </td>
                <td className="relative z-10 px-4 py-3 text-right font-display text-base font-bold">
                  <CountUp to={Number(row.points) || 0} duration={1100} />
                </td>
                <td className="relative z-10 px-4 py-3 text-right text-text-dim">
                  {row.wins}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function normalize(row, type) {
  if (type === 'drivers') {
    const d = row.Driver
    const c = row.Constructors?.[row.Constructors.length - 1]
    return {
      id: d?.driverId,
      name: `${d?.givenName ?? ''} ${d?.familyName ?? ''}`.trim(),
      flag: flag(d?.nationality),
      sub: c?.name,
      color: teamColor(c?.constructorId),
      link: d ? `/drivers/${d.driverId}` : null,
    }
  }
  const c = row.Constructor
  return {
    id: c?.constructorId,
    name: c?.name,
    flag: flag(c?.nationality),
    sub: c?.nationality,
    color: teamColor(c?.constructorId),
    link: c ? `/teams/${c.constructorId}` : null,
  }
}
