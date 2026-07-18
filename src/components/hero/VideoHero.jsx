import { useEffect, useState } from 'react'
import Hyperspeed from '../reactbits/Hyperspeed.jsx'
import { prefersReducedMotion } from '../../lib/anim.js'

// Fullscreen hero background. Lazy-mounts a looping video (public/hero.mp4)
// after first paint so LCP isn't blocked, then fades it in once it can play.
// On mobile or reduced-motion, falls back to the canvas Hyperspeed background
// (zero video bytes). If the video fails to load, it also falls back.
export default function VideoHero({ children }) {
  const [mounted, setMounted] = useState(false)
  const [videoOk, setVideoOk] = useState(true)
  const [ready, setReady] = useState(false)

  const isMobile =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  const useFallback = isMobile || prefersReducedMotion() || !videoOk

  useEffect(() => {
    // Defer mounting the video until after first paint.
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section className="relative h-[100svh] overflow-hidden bg-bg">
      {/* Hyperspeed shows on mobile/reduced-motion, and also underneath the
          video while it buffers so there's never a black frame. */}
      {(useFallback || !ready) && (
        <div className="absolute inset-0">
          <Hyperspeed />
        </div>
      )}

      {!useFallback && mounted && (
        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setReady(true)}
          onError={() => setVideoOk(false)}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* legibility gradient + subtle grain */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-bg" />
      <div className="noise absolute inset-0" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        {children}
      </div>
    </section>
  )
}
