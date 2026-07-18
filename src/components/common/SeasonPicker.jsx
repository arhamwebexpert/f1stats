import { ChevronDown } from 'lucide-react'
import { useSeasons } from '../../hooks/useSeasons.js'

// Dropdown of every F1 season (newest first). Falls back to a generated
// range if the seasons endpoint hasn't resolved yet.
export default function SeasonPicker({ value, onChange, className = '' }) {
  const { data: seasons } = useSeasons()
  const list = seasons?.length
    ? [...seasons].reverse()
    : fallbackSeasons()

  return (
    <div className={`relative inline-block ${className}`}>
      <label htmlFor="season-picker" className="sr-only">
        Select season
      </label>
      <select
        id="season-picker"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-border bg-surface py-2.5 pl-4 pr-10 font-display text-lg font-bold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-f1-red"
      >
        {list.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-dim"
      />
    </div>
  )
}

function fallbackSeasons() {
  const now = new Date().getFullYear()
  const out = []
  for (let y = now; y >= 1950; y--) out.push(String(y))
  return out
}
