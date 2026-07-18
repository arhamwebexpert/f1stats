import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, GitCompareArrows } from 'lucide-react'
import Particles from '../components/reactbits/Particles.jsx'
import SplitText from '../components/reactbits/SplitText.jsx'
import ShinyText from '../components/reactbits/ShinyText.jsx'
import StatCounter from '../components/common/StatCounter.jsx'
import HeadToHeadRadar from '../components/charts/HeadToHeadRadar.jsx'
import { useDrivers } from '../hooks/useDrivers.js'
import { useDriverProfile } from '../hooks/useDriverProfile.js'
import RaceLoader from '../components/reactbits/RaceLoader.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { flag } from '../lib/nationality.js'

const COLOR_A = '#e10600'
const COLOR_B = '#3671C6'

export default function HeadToHead() {
  useDocumentTitle('Head-to-Head', 'Compare any two Formula 1 drivers side by side.')
  const [params, setParams] = useSearchParams()
  const { data: drivers } = useDrivers()

  const d1 = params.get('d1') || ''
  const d2 = params.get('d2') || ''

  const setDriver = (slot, id) => {
    const next = new URLSearchParams(params)
    if (id) next.set(slot, id)
    else next.delete(slot)
    setParams(next, { replace: true })
  }

  const driverA = drivers?.find((d) => d.driverId === d1)
  const driverB = drivers?.find((d) => d.driverId === d2)

  return (
    <div className="relative min-h-screen pb-16 pt-24">
      {/* backdrop — a linked particle field evoking the head-to-head grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
        <Particles density={70} speed={0.22} connect linkDistance={130} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/50 via-bg/80 to-bg" />
      </div>

      <div className="section-pad">
        <header className="mb-8 text-center">
          <ShinyText className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em]">
            Driver vs Driver
          </ShinyText>
          <h1 className="font-display text-3xl font-900 uppercase sm:text-5xl">
            <SplitText text="Head " delay={26} className="inline-block" />
            <SplitText text="to" delay={26} startDelay={120} className="inline-block text-f1-red" />
            <SplitText text=" Head" delay={26} startDelay={180} className="inline-block" />
          </h1>
          <p className="mt-1 text-text-dim">
            Pick two drivers and watch their careers race each other.
          </p>
        </header>

        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          <DriverPicker
            drivers={drivers}
            selectedId={d1}
            otherId={d2}
            onSelect={(id) => setDriver('d1', id)}
            color={COLOR_A}
            slotLabel="Driver 1"
          />
          <DriverPicker
            drivers={drivers}
            selectedId={d2}
            otherId={d1}
            onSelect={(id) => setDriver('d2', id)}
            color={COLOR_B}
            slotLabel="Driver 2"
          />
        </div>

        {driverA && driverB ? (
          <Comparison driverA={driverA} driverB={driverB} />
        ) : (
          <div className="mt-16 flex flex-col items-center gap-3 text-center text-text-dim">
            <GitCompareArrows size={40} className="opacity-40" />
            <p>Select two drivers above to compare their careers.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function DriverPicker({ drivers, selectedId, otherId, onSelect, color, slotLabel }) {
  const [query, setQuery] = useState('')
  const selected = drivers?.find((d) => d.driverId === selectedId)

  const matches = useMemo(() => {
    if (!drivers || !query.trim()) return []
    const q = query.toLowerCase()
    return drivers
      .filter((d) => `${d.givenName} ${d.familyName}`.toLowerCase().includes(q))
      .filter((d) => d.driverId !== otherId)
      .slice(0, 8)
  }, [drivers, query, otherId])

  if (selected) {
    return (
      <div
        className="card-surface flex items-center justify-between p-5"
        style={{ borderTop: `3px solid ${color}` }}
      >
        <div>
          <p className="text-xs uppercase tracking-wide text-text-dim">{slotLabel}</p>
          <p className="mt-1 font-display text-2xl font-bold uppercase">
            {flag(selected.nationality)} {selected.familyName}
          </p>
          <p className="text-sm text-text-dim">{selected.givenName}</p>
        </div>
        <button
          onClick={() => onSelect('')}
          aria-label="Clear driver"
          className="rounded-lg border border-border p-2 text-text-dim hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="card-surface p-4" style={{ borderTop: `3px solid ${color}` }}>
      <p className="mb-2 text-xs uppercase tracking-wide text-text-dim">{slotLabel}</p>
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-dim"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a driver…"
          className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-f1-red"
        />
      </div>
      {matches.length > 0 && (
        <ul className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-border">
          {matches.map((d) => (
            <li key={d.driverId}>
              <button
                onClick={() => {
                  onSelect(d.driverId)
                  setQuery('')
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-2"
              >
                <span>{flag(d.nationality)}</span>
                <span className="font-semibold">
                  {d.givenName} {d.familyName}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Comparison({ driverA, driverB }) {
  // One bulk-results pass per driver gives every comparison metric.
  const profileA = useDriverProfile(driverA.driverId)
  const profileB = useDriverProfile(driverB.driverId)

  const mergedA = profileA.data?.stats
  const mergedB = profileB.data?.stats

  const rows = [
    { key: 'wins', label: 'Wins' },
    { key: 'podiums', label: 'Podiums' },
    { key: 'poles', label: 'Poles' },
    { key: 'points', label: 'Points' },
    { key: 'races', label: 'Races' },
  ]

  const loadingA = profileA.isLoading
  const loadingB = profileB.isLoading

  if (loadingA || loadingB) {
    return (
      <div className="mt-16 grid place-items-center">
        <RaceLoader label="Lining up the grid…" />
      </div>
    )
  }

  return (
    <div className="mt-12">
      {/* Racing stat counters */}
      <div className="grid gap-3">
        {rows.map((r) => {
          const av = mergedA?.[r.key] ?? 0
          const bv = mergedB?.[r.key] ?? 0
          const aWins = av >= bv
          return (
            <div key={r.key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className={`text-right ${aWins ? '' : 'opacity-60'}`}>
                <StatCounterInline value={av} color={COLOR_A} loading={loadingA} align="right" />
              </div>
              <span className="w-24 text-center text-xs font-semibold uppercase tracking-wider text-text-dim">
                {r.label}
              </span>
              <div className={`text-left ${!aWins ? '' : 'opacity-60'}`}>
                <StatCounterInline value={bv} color={COLOR_B} loading={loadingB} align="left" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Radar */}
      {mergedA && mergedB && (
        <div className="mt-10">
          <HeadToHeadRadar
            a={{ name: driverA.familyName, stats: mergedA }}
            b={{ name: driverB.familyName, stats: mergedB }}
            colorA={COLOR_A}
            colorB={COLOR_B}
          />
        </div>
      )}
    </div>
  )
}

// Compact reuse of the odometer without the tile chrome.
function StatCounterInline({ value, color, loading, align }) {
  return (
    <div className={align === 'right' ? 'flex justify-end' : 'flex justify-start'}>
      <StatCounter
        value={value}
        label=""
        accent={color}
        loading={loading}
      />
    </div>
  )
}
