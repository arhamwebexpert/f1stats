import { useEffect, useRef } from 'react'
import { motion } from '../../lib/anim.js'
import { useInView } from '../../hooks/useInView.js'

// React Bits–style ScrollReveal: reveals its content (fade + rise) when it
// scrolls into view. Reduced motion snaps to the final state via the shared
// `motion` helper. For staggering many children, use AnimatedList instead.
export default function ScrollReveal({
  children,
  y = 24,
  duration = 550,
  delay = 0,
  className = '',
  as: Tag = 'div',
}) {
  const [inViewRef, inView] = useInView({ threshold: 0.15 })
  const elRef = useRef(null)

  useEffect(() => {
    if (!inView) return
    const el = elRef.current
    if (!el) return
    motion(el, {
      opacity: [0, 1],
      translateY: [y, 0],
      duration,
      delay,
      ease: 'outQuad',
    })
  }, [inView, y, duration, delay])

  const setRefs = (node) => {
    elRef.current = node
    inViewRef.current = node
  }

  return (
    <Tag ref={setRefs} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  )
}
