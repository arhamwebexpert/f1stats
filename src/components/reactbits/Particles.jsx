import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../lib/anim.js'

// React Bits–style Particles: a soft drifting particle field on canvas, with
// optional link-lines between nearby particles. Zero dependencies (no OGL /
// three). DPR-aware, rAF cleaned up on unmount, static field under reduced
// motion. A calmer companion to Hyperspeed for section/hero backdrops.
export default function Particles({
  className = '',
  color = '#e10600',
  density = 60,
  speed = 0.25,
  connect = true,
  linkDistance = 120,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let w, h, dpr
    let particles = []
    const reduced = prefersReducedMotion()

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function seed() {
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 1.6 + 0.6,
      }))
    }

    resize()
    seed()

    function draw() {
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        ctx.beginPath()
        ctx.fillStyle = 'rgba(180,190,220,0.5)'
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (connect) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i]
            const b = particles[j]
            const dx = a.x - b.x
            const dy = a.y - b.y
            const dist = Math.hypot(dx, dy)
            if (dist < linkDistance) {
              const alpha = (1 - dist / linkDistance) * 0.35
              ctx.strokeStyle = hexToRgba(color, alpha)
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(a.x, a.y)
              ctx.lineTo(b.x, b.y)
              ctx.stroke()
            }
          }
        }
      }
    }

    function frame() {
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      }
      draw()
      raf = requestAnimationFrame(frame)
    }

    if (reduced) {
      draw()
    } else {
      frame()
    }

    function onResize() {
      resize()
      seed()
    }
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [color, density, speed, connect, linkDistance])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  )
}

function hexToRgba(hex, alpha) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
