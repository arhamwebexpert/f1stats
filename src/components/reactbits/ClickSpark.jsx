import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/anim.js'

// React Bits–style ClickSpark: a full-screen, click-through canvas that emits
// a short radial burst of sparks wherever the user clicks. Mounted once at the
// app root. rAF is only running while sparks are alive, and is cancelled on
// unmount. Disabled entirely under reduced motion.
export default function ClickSpark({
  color = '#e10600',
  count = 8,
  size = 14,
  duration = 420,
}) {
  const canvasRef = useRef(null)
  const sparksRef = useRef([])
  const rafRef = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w, h, dpr

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    function tick(now) {
      ctx.clearRect(0, 0, w, h)
      const alive = []
      for (const s of sparksRef.current) {
        const t = (now - s.start) / duration
        if (t >= 1) continue
        const ease = 1 - Math.pow(1 - t, 3)
        const dist = s.radius * ease
        const x = s.x + Math.cos(s.angle) * dist
        const y = s.y + Math.sin(s.angle) * dist
        const len = size * (1 - t)
        ctx.strokeStyle = color
        ctx.globalAlpha = 1 - t
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + Math.cos(s.angle) * len, y + Math.sin(s.angle) * len)
        ctx.stroke()
        alive.push(s)
      }
      ctx.globalAlpha = 1
      sparksRef.current = alive
      if (alive.length) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = 0
      }
    }

    function onClick(e) {
      const now = performance.now()
      for (let i = 0; i < count; i++) {
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (Math.PI * 2 * i) / count + Math.random() * 0.3,
          radius: 18 + Math.random() * 16,
          start: now,
        })
      }
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('pointerdown', onClick)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onClick)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [color, count, size, duration])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] h-full w-full"
    />
  )
}
