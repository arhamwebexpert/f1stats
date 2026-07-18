import { useEffect, useRef } from 'react'
import { motion, stagger, prefersReducedMotion } from '../../lib/anim.js'

// React Bits–style loader themed on the F1 start-light gantry: five lights
// illuminate left-to-right, hold, then "go" green and reset — looping. Built
// on anime.js; snaps to a static lit state under prefers-reduced-motion.
export default function RaceLoader({ label = 'Loading', size = 'md' }) {
  const ref = useRef(null)
  const dims = size === 'sm' ? 14 : size === 'lg' ? 26 : 20
  const gap = size === 'sm' ? 6 : size === 'lg' ? 12 : 8

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const lights = el.querySelectorAll('[data-light]')

    if (prefersReducedMotion()) {
      lights.forEach((l) => {
        l.style.opacity = '1'
        l.style.background = 'var(--f1-red)'
      })
      return
    }

    let cancelled = false

    function run() {
      if (cancelled) return
      // 1) lights come on one by one (red)
      motion(lights, {
        opacity: [0.15, 1],
        scale: [0.8, 1],
        boxShadow: ['0 0 0px rgba(225,6,0,0)', '0 0 14px rgba(225,6,0,0.8)'],
        backgroundColor: '#e10600',
        duration: 320,
        delay: stagger(180),
        ease: 'outQuad',
        onComplete: () => {
          if (cancelled) return
          // 2) hold, then GO — flash green and fade out together
          motion(lights, {
            backgroundColor: '#22c55e',
            boxShadow: '0 0 16px rgba(34,197,94,0.9)',
            duration: 220,
            delay: 380,
            ease: 'outQuad',
            onComplete: () => {
              if (cancelled) return
              motion(lights, {
                opacity: 0.15,
                scale: 0.8,
                duration: 260,
                ease: 'inQuad',
                onComplete: () => setTimeout(run, 260),
              })
            },
          })
        },
      })
    }

    run()
    return () => {
      cancelled = true
    }
  }, [size])

  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <div
        ref={ref}
        className="flex items-center rounded-lg bg-black/40 p-2 ring-1 ring-white/10"
        style={{ gap }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            data-light
            className="rounded-full"
            style={{
              width: dims,
              height: dims,
              opacity: 0.15,
              background: '#e10600',
            }}
          />
        ))}
      </div>
      {label && (
        <span className="text-xs font-semibold uppercase tracking-widest text-text-dim">
          {label}
        </span>
      )}
    </div>
  )
}
