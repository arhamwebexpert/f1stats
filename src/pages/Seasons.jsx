import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, CalendarDays, Trophy } from 'lucide-react'
import { useSeasons, useRaceCalendar } from '../hooks/useSeasons.js'
import SectionHeading from '../components/common/SectionHeading.jsx'
import ScrollReveal from '../components/reactbits/ScrollReveal.jsx'
import AnimatedList from '../components/reactbits/AnimatedList.jsx'
import SpotlightCard from '../components/reactbits/SpotlightCard.jsx'
import RaceLoader from '../components/reactbits/RaceLoader.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { CURRENT_SEASON } from '../lib/queryClient.js'
import { flag } from '../lib/nationality.js'

export default function Seasons() {
  useDocumentTitle('Seasons', 'Browse every Formula 1 season and race calendar since 1950.')
  const { data: seasons } = useSeasons()
  const [selected, setSelected] = useState(String(CURRENT_SEASON))

  // group seasons by decade
  const byDecade = useMemo(() => {
    const groups = {}
    ;(seasons ?? []).forEach((s) => {
      const d = Math.floor(Number(s) / 10) * 10
      ;(groups[d] ||= []).push(s)
    })
    return groups
  }, [seasons])

  const decades = Object.keys(byDecade).sort((a, b) => b - a)

  return (
    <div className="section-pad pb-16 pt-24">
      <SectionHeading
        eyebrow="1950 → today"
        title="Season"
        accent="Archive"
        className="mb-6"
      />
      <p className="-mt-4 mb-6 text-text-dim">
        Every championship from 1950 to today — pick a year to see the calendar.
      </p>

      {/* decade-grouped year chips */}
      <div className="space-y-4">
        {decades.map((d) => (
          <ScrollReveal key={d} y={14} className="flex flex-wrap items-center gap-2">
            <span className="w-14 shrink-0 font-display text-sm font-bold text-text-dim">
              {d}s
            </span>
            {byDecade[d].map((y) => (
              <button
                key={y}
                onClick={() => setSelected(y)}
                className={`skew-chip rounded transition-colors ${
                  selected === y
                    ? 'bg-f1-red text-white'
                    : 'bg-surface-2 text-text-dim hover:text-white'
                }`}
              >
                <span>{y}</span>
              </button>
            ))}
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-10">
        <RaceCalendar season={selected} />
      </div>
    </div>
  )
}

function RaceCalendar({ season }) {
  const { data: races, isLoading } = useRaceCalendar(season)

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-900 uppercase">
        <span className="text-f1-red">{season}</span> Calendar
      </h2>
      {isLoading ? (
        <div className="grid place-items-center py-16">
          <RaceLoader label="Loading the calendar…" />
        </div>
      ) : !races?.length ? (
        <p className="text-text-dim">No race data for this season.</p>
      ) : (
        <AnimatedList
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          stagger={40}
        >
          {races.map((race) => (
            <SpotlightCard key={race.round} className="accent-top">
              <Link
                to={`/seasons/${season}/${race.round}`}
                className="group block p-4"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-3xl font-900 text-white/10">
                    R{race.round}
                  </span>
                  {race.date && (
                    <span className="inline-flex items-center gap-1 text-xs text-text-dim">
                      <CalendarDays size={12} /> {formatDate(race.date)}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-bold leading-tight group-hover:text-f1-red">
                  {race.raceName}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-text-dim">
                  <MapPin size={12} />
                  {race.Circuit?.circuitName}
                  {race.Circuit?.Location?.country && (
                    <> · {flag(demonym(race.Circuit.Location.country))}</>
                  )}
                </p>
              </Link>
            </SpotlightCard>
          ))}
        </AnimatedList>
      )}
    </div>
  )
}

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// Circuit locations give a country name, not a demonym; a tiny map covers
// the flags shown on calendar cards (falls back to the checkered flag).
function demonym(country) {
  const MAP = {
    UK: 'British',
    USA: 'American',
    UAE: 'Emirati',
    Italy: 'Italian',
    Spain: 'Spanish',
    Monaco: 'Monegasque',
    France: 'French',
    Germany: 'German',
    Brazil: 'Brazilian',
    Japan: 'Japanese',
    Australia: 'Australian',
    Austria: 'Austrian',
    Belgium: 'Belgian',
    Canada: 'Canadian',
    Mexico: 'Mexican',
    Netherlands: 'Dutch',
    Hungary: 'Hungarian',
    Bahrain: 'Bahraini',
    Singapore: 'Singaporean',
    China: 'Chinese',
    Portugal: 'Portuguese',
    Turkey: 'Turkish',
    Russia: 'Russian',
    'Saudi Arabia': 'Saudi',
    Qatar: 'Qatari',
    Azerbaijan: 'Azerbaijani',
    'United States': 'American',
  }
  return MAP[country] || country
}
