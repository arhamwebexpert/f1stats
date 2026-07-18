import { useRef } from 'react'
import { prefersReducedMotion } from '../../lib/anim.js'

// React Bits–style TiltedCard: 3D tilt toward the cursor with a soft glare.
export default function TiltedCard({
  children,
  className = '',
  max = 10,
  scale = 1.02,
  style,
}) {
  const ref = useRef(null)

  function handleMove(e) {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - py) * max * 2
    const ry = (px - 0.5) * max * 2
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }

  function reset() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d', ...style }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-200 hover:opacity-100"
        style={{
          background:
            'radial-gradient(220px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.10), transparent 60%)',
        }}
      />
      {children}
    </div>
  )
}
