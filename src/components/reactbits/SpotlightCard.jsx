import { useRef } from 'react'

// React Bits–style SpotlightCard: a radial highlight follows the cursor.
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(225, 6, 0, 0.18)',
  style,
}) {
  const ref = useRef(null)

  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`group relative overflow-hidden rounded-xl border border-border bg-surface ${className}`}
      style={style}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), ${spotlightColor}, transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
