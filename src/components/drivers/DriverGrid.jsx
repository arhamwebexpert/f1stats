import { useEffect, useRef } from 'react'
import DriverCard from './DriverCard.jsx'
import { motion, stagger } from '../../lib/anim.js'

// Grid that staggers its cards in whenever the visible set changes.
export default function DriverGrid({ drivers, teamByDriver = {} }) {
  const gridRef = useRef(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return
    const cards = el.querySelectorAll('.driver-card')
    if (!cards.length) return
    motion(cards, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 500,
      delay: stagger(40),
      ease: 'outQuad',
    })
  }, [drivers])

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {drivers.map((d) => (
        <DriverCard
          key={d.driverId}
          driver={d}
          constructorId={teamByDriver[d.driverId]}
        />
      ))}
    </div>
  )
}
