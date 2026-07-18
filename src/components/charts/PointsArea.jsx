import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

// Points-by-season area chart used on the team detail page.
export default function PointsArea({ data, color = '#e10600', title = 'Points by Season' }) {
  if (!data?.length) return null
  const id = `grad-${color.replace('#', '')}`
  return (
    <div className="card-surface accent-top p-4">
      <h3 className="mb-4 font-display text-lg font-bold">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.55} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#26263a" />
          <XAxis dataKey="season" stroke="#9a9aa8" tick={{ fontSize: 12 }} minTickGap={16} />
          <YAxis stroke="#9a9aa8" tick={{ fontSize: 12 }} width={44} />
          <Tooltip
            contentStyle={{
              background: '#141420',
              border: '1px solid #26263a',
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ color: '#f5f5f7', fontWeight: 700 }}
            formatter={(v) => [`${v} pts`, 'Points']}
          />
          <Area
            type="monotone"
            dataKey="points"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${id})`}
            animationDuration={1100}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
