import { Link } from 'react-router-dom'
import SpotlightCard from '../reactbits/SpotlightCard.jsx'
import { flag } from '../../lib/nationality.js'
import { teamColor, teamColorAlpha } from '../../lib/teamColors.js'

export default function TeamCard({ team }) {
  const color = teamColor(team.constructorId)
  return (
    <SpotlightCard
      className="team-card h-full"
      spotlightColor={teamColorAlpha(team.constructorId, 0.22)}
      style={{ opacity: 0 }}
    >
      <Link
        to={`/teams/${team.constructorId}`}
        className="flex h-full flex-col justify-between p-5"
        style={{
          background: `linear-gradient(135deg, ${teamColorAlpha(team.constructorId, 0.22)}, transparent 70%)`,
          borderLeft: `4px solid ${color}`,
        }}
      >
        <div>
          <span className="text-2xl">{flag(team.nationality)}</span>
          <h3 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
            {team.name}
          </h3>
        </div>
        <span className="mt-4 text-xs text-text-dim">{team.nationality}</span>
      </Link>
    </SpotlightCard>
  )
}
