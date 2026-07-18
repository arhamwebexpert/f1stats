import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

// Season-on-X, points-on-Y line. Recharts animates the line draw itself
// (animationDuration), giving the left-to-right reveal.
export default function PointsProgression({ data, color = '#e10600' }) {
  if (!data?.length) return null

  const chartData = data.map((d) => ({
    season: d.season,
    points: d.points,
    team: d.team,
  }))

  return (
    <div className="card-surface accent-top p-4">
      <h3 className="mb-4 font-display text-lg font-bold">Points Progression</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#26263a" />
          <XAxis
            dataKey="season"
            stroke="#9a9aa8"
            tick={{ fontSize: 12 }}
            minTickGap={16}
          />
          <YAxis stroke="#9a9aa8" tick={{ fontSize: 12 }} width={44} />
          <Tooltip
            contentStyle={{
              background: '#141420',
              border: '1px solid #26263a',
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: '#f5f5f7', fontWeight: 700 }}
            formatter={(v, _n, p) => [`${v} pts`, p.payload.team]}
          />
          <Line
            type="monotone"
            dataKey="points"
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 3, fill: color }}
            activeDot={{ r: 5 }}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
