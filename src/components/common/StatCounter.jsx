import { useEffect, useRef } from 'react'
import { animateCounter } from '../../lib/anim.js'
import { useInView } from '../../hooks/useInView.js'

// anime.js odometer stat, shown as a labelled tile. Animates when in view.
export default function StatCounter({
  value,
  label,
  icon: Icon,
  duration = 1400,
  accent = '#e10600',
  loading = false,
}) {
  const [wrapRef, inView] = useInView({ threshold: 0.3 })
  const numRef = useRef(null)

  useEffect(() => {
    if (!inView || loading || value == null) return
    animateCounter(numRef.current, value, { duration })
  }, [inView, value, duration, loading])

  return (
    <div
      ref={wrapRef}
      className="card-surface accent-top flex flex-col items-center justify-center gap-1 px-3 py-5 text-center"
    >
      {Icon && (
        <Icon size={18} className="mb-1 opacity-70" style={{ color: accent }} />
      )}
      {loading ? (
        <div className="skeleton h-9 w-16" />
      ) : (
        <span
          ref={numRef}
          className="font-display text-3xl font-900 leading-none sm:text-4xl"
          style={{ fontWeight: 900 }}
        >
          0
        </span>
      )}
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-text-dim">
        {label}
      </span>
    </div>
  )
}
