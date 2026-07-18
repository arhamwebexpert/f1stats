import { Link } from 'react-router-dom'
import TiltedCard from '../reactbits/TiltedCard.jsx'
import DriverAvatar from './DriverAvatar.jsx'
import { flag } from '../../lib/nationality.js'
import { teamColor } from '../../lib/teamColors.js'

// A single driver tile with a Wikipedia portrait banner. `constructorId`
// (optional) draws a team-colour accent.
export default function DriverCard({ driver, constructorId }) {
  const number = driver.permanentNumber
  const accent = constructorId ? teamColor(constructorId) : '#26263a'

  return (
    <TiltedCard className="driver-card h-full" style={{ opacity: 0 }}>
      <Link
        to={`/drivers/${driver.driverId}`}
        className="card-surface group flex h-full flex-col overflow-hidden transition-colors hover:border-white/20"
        style={{ borderLeft: `4px solid ${accent}` }}
      >
        {/* portrait banner */}
        <div className="relative">
          <DriverAvatar
            driver={driver}
            accent={accent}
            rounded="rounded-none"
            initialsClassName="text-5xl"
            className="aspect-[4/3] w-full"
          />
          {/* fade into the card + flag / number overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/25 to-transparent" />
          <span className="absolute left-3 top-2 text-2xl drop-shadow-lg">
            {flag(driver.nationality)}
          </span>
          {number && (
            <span
              className="pointer-events-none absolute -bottom-1 right-2 select-none font-display leading-none text-white/15"
              style={{ fontSize: '3.5rem', fontWeight: 900 }}
            >
              {number}
            </span>
          )}
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-between p-4">
          <h3 className="font-display text-lg font-bold leading-tight">
            {driver.givenName}
            <br />
            <span className="text-xl uppercase">{driver.familyName}</span>
          </h3>
          <div className="mt-3 flex items-center justify-between text-xs text-text-dim">
            <span>{driver.nationality}</span>
            {number && (
              <span
                className="font-display text-sm font-bold"
                style={{ color: accent === '#26263a' ? '#9a9aa8' : accent }}
              >
                #{number}
              </span>
            )}
          </div>
        </div>
      </Link>
    </TiltedCard>
  )
}
