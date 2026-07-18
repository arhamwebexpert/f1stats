import { useEffect, useRef, useState } from 'react'
import Hyperspeed from '../reactbits/Hyperspeed.jsx'
import { prefersReducedMotion } from '../../lib/anim.js'

// Fullscreen hero background. Lazy-mounts a looping video (public/hero.mp4)
// after first paint so LCP isn't blocked, then fades it in once it can play.
// Plays on mobile too (muted + playsInline satisfy autoplay policies). Falls
// back to the canvas Hyperspeed background for reduced-motion or if the video
// can't load/play (e.g. iOS Low Power Mode blocks autoplay).
export default function VideoHero({ children }) {
  const [mounted, setMounted] = useState(false)
  const [videoOk, setVideoOk] = useState(true)
  const [ready, setReady] = useState(false)
  const videoRef = useRef(null)

  const useFallback = prefersReducedMotion() || !videoOk

  useEffect(() => {
    // Defer mounting the video until after first paint.
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Some mobile browsers won't honor the autoPlay attribute alone — nudge
  // playback explicitly once the element is mounted. If the promise rejects
  // (autoplay blocked), fall back to the animated background.
  function tryPlay() {
    const v = videoRef.current
    if (!v) return
    // React's `muted` attribute doesn't reliably set the DOM property, which
    // mobile browsers require for muted autoplay — force it here.
    v.muted = true
    v.defaultMuted = true
    const p = v.play?.()
    if (p && typeof p.catch === 'function') {
      p.catch(() => setVideoOk(false))
    }
  }

  return (
    <section className="relative h-[100svh] overflow-hidden bg-bg">
      {/* Hyperspeed shows for reduced-motion, and also underneath the video
          while it buffers so there's never a black frame. */}
      {(useFallback || !ready) && (
        <div className="absolute inset-0">
          <Hyperspeed />
        </div>
      )}

      {!useFallback && mounted && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={tryPlay}
          onCanPlay={() => {
            setReady(true)
            tryPlay()
          }}
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
