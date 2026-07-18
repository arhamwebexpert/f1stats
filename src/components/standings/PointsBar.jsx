// A horizontal bar that fills to `pct`% behind a standings row. The width
// animation is driven once by StandingsTable via anime.js targeting
// `.points-bar` (see StandingsTable). Reduced-motion users see it pre-filled.
export default function PointsBar({ pct, color = '#e10600' }) {
  return (
    <div
      className="points-bar absolute inset-y-0 left-0 -z-0 rounded-r-md"
      data-pct={pct}
      style={{
        width: 0,
        background: `linear-gradient(90deg, ${color}33, ${color}12)`,
        borderRight: `2px solid ${color}66`,
      }}
    />
  )
}
