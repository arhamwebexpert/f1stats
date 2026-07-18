import { Search, X } from 'lucide-react'

// Sticky filter controls for the drivers grid.
export default function DriverFilterBar({
  search,
  onSearch,
  nationality,
  onNationality,
  nationalities,
  decade,
  onDecade,
  decades,
  championsOnly,
  onChampionsOnly,
  resultCount,
}) {
  return (
    <div className="sticky top-16 z-30 -mx-4 mb-6 border-y border-border bg-bg/85 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-xl sm:border">
      <div className="flex flex-wrap items-center gap-3">
        {/* search */}
        <div className="relative flex-1 basis-64">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-dim"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search drivers…"
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-9 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-f1-red"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-text-dim hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* nationality */}
        <select
          value={nationality}
          onChange={(e) => onNationality(e.target.value)}
          aria-label="Filter by nationality"
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-f1-red"
        >
          <option value="">All nationalities</option>
          {nationalities.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        {/* champions toggle */}
        <label className="flex cursor-pointer select-none items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={championsOnly}
            onChange={(e) => onChampionsOnly(e.target.checked)}
            className="peer sr-only"
          />
          <span className="relative h-5 w-9 rounded-full bg-border transition-colors peer-checked:bg-f1-red">
            <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
          </span>
          Champions
        </label>
      </div>

      {/* decade chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => onDecade('')}
          className={`skew-chip rounded ${
            decade === '' ? 'bg-f1-red text-white' : 'bg-surface-2 text-text-dim'
          }`}
        >
          <span>All eras</span>
        </button>
        {decades.map((d) => (
          <button
            key={d}
            onClick={() => onDecade(String(d))}
            className={`skew-chip rounded ${
              decade === String(d)
                ? 'bg-f1-red text-white'
                : 'bg-surface-2 text-text-dim hover:text-white'
            }`}
          >
            <span>{d}s</span>
          </button>
        ))}
        <span className="ml-auto text-xs text-text-dim">
          {resultCount} driver{resultCount === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )
}
