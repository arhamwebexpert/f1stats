import { useEffect, useLayoutEffect, useRef } from 'react'
import { motion, stagger as animStagger, prefersReducedMotion } from '../../lib/anim.js'
import { useInView } from '../../hooks/useInView.js'

// React Bits–style AnimatedList: staggers its direct children in (fade + rise)
// when scrolled into view. Works for any parent/child pair — pass `as="tbody"`
// to stagger table rows. Children start hidden (set in a layout effect, so no
// flash) and are revealed once; reduced motion skips straight to visible.
export default function AnimatedList({
  children,
  as: Tag = 'div',
  y = 16,
  duration = 450,
  stagger = 45,
  className = '',
}) {
  const [inViewRef, inView] = useInView({ threshold: 0.1 })
  const elRef = useRef(null)

  // Hide children before first paint so nothing flashes before the reveal.
  useLayoutEffect(() => {
    const el = elRef.current
    if (!el || prefersReducedMotion()) return
    for (const child of el.children) {
      child.style.opacity = '0'
    }
  }, [])

  useEffect(() => {
    if (!inView) return
    const el = elRef.current
    if (!el || !el.children.length) return
    motion(el.children, {
      opacity: [0, 1],
      translateY: [y, 0],
      duration,
      delay: animStagger(stagger),
      ease: 'outQuad',
    })
  }, [inView, y, duration, stagger, children])

  const setRefs = (node) => {
    elRef.current = node
    inViewRef.current = node
  }

  return (
    <Tag ref={setRefs} className={className}>
      {children}
    </Tag>
  )
}
