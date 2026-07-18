import { useEffect, useRef } from 'react'
import { animateCounter } from '../../lib/anim.js'
import { useInView } from '../../hooks/useInView.js'

// React Bits–style CountUp: animates 0 → `to` when scrolled into view.
export default function CountUp({
  to,
  duration = 1400,
  prefix = '',
  suffix = '',
  separator = true,
  className = '',
}) {
  const [wrapRef, inView] = useInView({ threshold: 0.3 })
  const numRef = useRef(null)

  useEffect(() => {
    if (!inView) return
    animateCounter(numRef.current, to, {
      duration,
      format: (n) =>
        separator ? Math.round(n).toLocaleString() : String(Math.round(n)),
    })
  }, [inView, to, duration, separator])

  return (
    <span ref={wrapRef} className={className}>
      {prefix}
      <span ref={numRef}>0</span>
      {suffix}
    </span>
  )
}
