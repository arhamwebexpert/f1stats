import { useEffect, useRef } from 'react'
import { motion, stagger } from '../../lib/anim.js'

// React Bits–style SplitText: splits text into characters and staggers each
// one upward on mount (or when it scrolls into view).
export default function SplitText({
  text,
  className = '',
  delay = 30,
  duration = 700,
  as: Tag = 'span',
  startDelay = 0,
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const chars = el.querySelectorAll('[data-char]')
    motion(chars, {
      opacity: [0, 1],
      translateY: [40, 0],
      rotateZ: [6, 0],
      duration,
      delay: stagger(delay, { start: startDelay }),
      ease: 'outExpo',
    })
  }, [text, delay, duration, startDelay])

  const words = String(text).split(' ')

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((ch, ci) => (
            <span
              key={ci}
              data-char
              className="inline-block will-change-transform"
              style={{ opacity: 0 }}
            >
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span data-char>{' '}</span>}
        </span>
      ))}
    </Tag>
  )
}
