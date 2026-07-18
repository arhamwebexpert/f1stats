import { useEffect, useState } from 'react'

// Ticking countdown to an ISO target time. Renders days/hours/mins/secs.
function remaining(targetMs) {
  const diff = Math.max(0, targetMs - Date.now())
  const s = Math.floor(diff / 1000)
  return {
    done: diff === 0,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    mins: Math.floor((s % 3600) / 60),
    secs: s % 60,
  }
}

export default function Countdown({ target, onComplete }) {
  const targetMs = new Date(target).getTime()
  const [t, setT] = useState(() => remaining(targetMs))

  useEffect(() => {
    const id = setInterval(() => {
      const next = remaining(targetMs)
      setT(next)
      if (next.done) {
        clearInterval(id)
        onComplete?.()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [targetMs, onComplete])

  const units = [
    { label: 'Days', value: t.days },
    { label: 'Hrs', value: t.hours },
    { label: 'Min', value: t.mins },
    { label: 'Sec', value: t.secs },
  ]

  return (
    <div className="flex gap-2 sm:gap-3">
      {units.map((u) => (
        <div
          key={u.label}
          className="card-surface flex min-w-[64px] flex-col items-center px-3 py-2"
        >
          <span className="font-display text-2xl font-900 tabular-nums sm:text-3xl">
            {String(u.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  )
}
