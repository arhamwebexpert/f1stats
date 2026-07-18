import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts'

// Compares two drivers across normalized metrics (0–100, scaled to the
// stronger of the two on each axis).
export default function HeadToHeadRadar({ a, b, colorA = '#e10600', colorB = '#3671C6' }) {
  if (!a || !b) return null

  const metrics = [
    { key: 'wins', label: 'Wins' },
    { key: 'podiums', label: 'Podiums' },
    { key: 'poles', label: 'Poles' },
    { key: 'points', label: 'Points' },
    { key: 'ppr', label: 'Pts / Race' },
  ]

  const ppr = (s) => (s.races ? s.points / s.races : 0)
  const av = { ...a.stats, ppr: ppr(a.stats) }
  const bv = { ...b.stats, ppr: ppr(b.stats) }

  const data = metrics.map((m) => {
    const max = Math.max(av[m.key] || 0, bv[m.key] || 0, 1)
    return {
      metric: m.label,
      [a.name]: Math.round(((av[m.key] || 0) / max) * 100),
      [b.name]: Math.round(((bv[m.key] || 0) / max) * 100),
    }
  })

  return (
    <div className="card-surface accent-top p-4">
      <h3 className="mb-2 font-display text-lg font-bold">Head-to-Head Profile</h3>
      <p className="mb-3 text-xs text-text-dim">
        Each axis normalized to the stronger driver (100 = leads that metric).
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#26263a" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: '#9a9aa8', fontSize: 12 }} />
          <Radar name={a.name} dataKey={a.name} stroke={colorA} fill={colorA} fillOpacity={0.35} />
          <Radar name={b.name} dataKey={b.name} stroke={colorB} fill={colorB} fillOpacity={0.35} />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Tooltip
            contentStyle={{
              background: '#141420',
              border: '1px solid #26263a',
              borderRadius: 8,
              fontSize: 13,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
