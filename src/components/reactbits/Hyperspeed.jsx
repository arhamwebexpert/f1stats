import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/anim.js'

// Lightweight canvas "hyperspeed" — streaking light trails rushing toward the
// viewer. A zero-dependency stand-in for the React Bits WebGL version; doubles
// as the video fallback background and the Head-to-Head backdrop.
export default function Hyperspeed({
  className = '',
  color = '#e10600',
  density = 220,
  speed = 1,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let w, h, cx, cy
    let stars = []
    const reduced = prefersReducedMotion()

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = w / 2
      cy = h / 2
    }

    function spawn() {
      return {
        x: (Math.random() - 0.5) * w,
        y: (Math.random() - 0.5) * h,
        z: Math.random() * w,
        pz: 0,
      }
    }

    resize()
    stars = Array.from({ length: density }, spawn)

    function frame() {
      ctx.fillStyle = 'rgba(10,10,15,0.35)'
      ctx.fillRect(0, 0, w, h)

      for (const s of stars) {
        s.pz = s.z
        s.z -= 6 * speed
        if (s.z < 1) {
          s.x = (Math.random() - 0.5) * w
          s.y = (Math.random() - 0.5) * h
          s.z = w
          s.pz = s.z
        }
        const sx = cx + (s.x / s.z) * w
        const sy = cy + (s.y / s.z) * w
        const px = cx + (s.x / s.pz) * w
        const py = cy + (s.y / s.pz) * w
        const size = Math.max(0.4, (1 - s.z / w) * 2.4)

        ctx.strokeStyle = Math.random() > 0.82 ? color : 'rgba(180,190,220,0.55)'
        ctx.lineWidth = size
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(sx, sy)
        ctx.stroke()
      }
      raf = requestAnimationFrame(frame)
    }

    if (reduced) {
      // Draw a single static field so there's still texture behind content.
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, w, h)
      for (let i = 0; i < density; i++) {
        ctx.fillStyle = 'rgba(180,190,220,0.35)'
        ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5)
      }
    } else {
      frame()
    }

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [color, density, speed])

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full ${className}`}
      aria-hidden="true"
    />
  )
}
