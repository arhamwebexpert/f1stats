import { useRef } from 'react'
import { prefersReducedMotion } from '../../lib/anim.js'

// React Bits–style Magnet: the wrapped element is pulled toward the cursor
// while hovering within `padding` px, and springs back on leave. Transform
// only; a no-op under reduced motion.
export default function Magnet({
  children,
  strength = 0.35,
  padding = 40,
  className = '',
  wrapperClassName = '',
}) {
  const ref = useRef(null)

  function handleMove(e) {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const within =
      Math.abs(dx) < rect.width / 2 + padding &&
      Math.abs(dy) < rect.height / 2 + padding
    if (within) {
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
    } else {
      el.style.transform = 'translate(0, 0)'
    }
  }

  function reset() {
    const el = ref.current
    if (el) el.style.transform = 'translate(0, 0)'
  }

  return (
    <span
      className={`inline-block ${wrapperClassName}`}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      <span
        ref={ref}
        className={`inline-block transition-transform duration-300 ease-out will-change-transform ${className}`}
      >
        {children}
      </span>
    </span>
  )
}
