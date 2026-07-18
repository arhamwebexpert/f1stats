import CountUp from '../reactbits/CountUp.jsx'

const PILLS = [
  { to: 75, suffix: '+', label: 'Seasons' },
  { to: 860, suffix: '+', label: 'Drivers' },
  { to: 1100, suffix: '+', label: 'Races' },
]

// Three stat pills under the hero headline.
export default function HeroStats() {
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {PILLS.map((p) => (
        <div
          key={p.label}
          className="glass flex min-w-[110px] flex-col items-center rounded-xl border border-white/10 px-5 py-3"
        >
          <CountUp
            to={p.to}
            suffix={p.suffix}
            className="font-display text-2xl font-900 text-white sm:text-3xl"
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-dim">
            {p.label}
          </span>
        </div>
      ))}
    </div>
  )
}
