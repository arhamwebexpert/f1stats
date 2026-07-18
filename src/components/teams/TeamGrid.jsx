import { useEffect, useRef } from 'react'
import TeamCard from './TeamCard.jsx'
import { motion, stagger } from '../../lib/anim.js'

export default function TeamGrid({ teams }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const cards = el.querySelectorAll('.team-card')
    if (!cards.length) return
    motion(cards, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 500,
      delay: stagger(45),
      ease: 'outQuad',
    })
  }, [teams])

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {teams.map((t) => (
        <TeamCard key={t.constructorId} team={t} />
      ))}
    </div>
  )
}
