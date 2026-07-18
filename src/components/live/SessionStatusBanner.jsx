import { MapPin, CalendarClock, Radio } from 'lucide-react'
import Countdown from './Countdown.jsx'

// Header banner describing the session state: a pulsing LIVE badge, a
// countdown to the next session, or a "most recent" label for a finished one.
export default function SessionStatusBanner({ session, state, nextSession, onCountdownDone }) {
  if (!session && !nextSession) return null

  const s = session || nextSession
  const place = s?.circuit_short_name || s?.location
  const country = s?.country_name

  return (
    <div className="card-surface accent-top relative overflow-hidden p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            {state === 'live' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-f1-red px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Live
              </span>
            ) : state === 'upcoming' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-text-dim">
                <CalendarClock size={13} /> Upcoming
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-text-dim">
                <Radio size={13} /> Most recent
              </span>
            )}
          </div>

          <h2 className="font-display text-2xl font-900 uppercase leading-tight sm:text-3xl">
            {s?.session_name}
          </h2>
          <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-text-dim">
            <MapPin size={14} /> {place}
            {country ? `, ${country}` : ''} · {s?.year}
          </p>
        </div>

        {/* countdown to the next session (or to this one starting) */}
        {(state === 'upcoming' && session) ? (
          <Countdown target={session.date_start} onComplete={onCountdownDone} />
        ) : state === 'finished' && nextSession ? (
          <div className="text-right">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-text-dim">
              Next: {nextSession.session_name} · {nextSession.circuit_short_name}
            </p>
            <Countdown target={nextSession.date_start} onComplete={onCountdownDone} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
