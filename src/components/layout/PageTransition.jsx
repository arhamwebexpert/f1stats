import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, prefersReducedMotion } from '../../lib/anim.js'

// Broadcast-style route wipe: a skewed red panel sweeps across on navigation.
// Also gently fades the page content in on each route change.
export default function PageTransition({ children }) {
  const location = useLocation()
  const panelRef = useRef(null)
  const contentRef = useRef(null)
  const first = useRef(true)

  useEffect(() => {
    const content = contentRef.current
    if (content) {
      motion(content, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 420,
        ease: 'outQuad',
      })
    }

    // Skip the wipe on the very first paint (avoids a flash on load).
    if (first.current) {
      first.current = false
      return
    }
    const panel = panelRef.current
    if (!panel || prefersReducedMotion()) return

    motion(panel, {
      translateX: ['-120%', '0%'],
      duration: 260,
      ease: 'outQuad',
      onComplete: () => {
        motion(panel, {
          translateX: ['0%', '120%'],
          duration: 260,
          delay: 60,
          ease: 'inQuad',
        })
      },
    })
  }, [location.pathname])

  return (
    <>
      <div
        ref={panelRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 left-0 z-[60] w-[140%] -skew-x-12 bg-f1-red"
        style={{ transform: 'translateX(-120%)' }}
      />
      <div ref={contentRef}>{children}</div>
    </>
  )
}
