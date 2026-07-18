import { RefreshCw, KeyRound, ExternalLink, Timer } from 'lucide-react'
import SectionHeading from '../components/common/SectionHeading.jsx'
import RaceLoader from '../components/reactbits/RaceLoader.jsx'
import ErrorState, { EmptyState } from '../components/common/ErrorState.jsx'
import SessionStatusBanner from '../components/live/SessionStatusBanner.jsx'
import LiveTimingBoard from '../components/live/LiveTimingBoard.jsx'
import {
  useLatestSession,
  useSessionDrivers,
  useSessionResult,
  useNextSession,
  sessionState,
} from '../hooks/useOpenF1.js'
import { OpenF1AuthError } from '../lib/openf1.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function Live() {
  useDocumentTitle('Live Timing', 'Live and most-recent Formula 1 session timing, powered by OpenF1.')

  const { data: session, isLoading, isError, refetch } = useLatestSession()
  const state = sessionState(session)
  const live = state === 'live'
  const sessionKey = session?.session_key

  const drivers = useSessionDrivers(sessionKey)
  const result = useSessionResult(sessionKey, { live })
  const next = useNextSession()

  const authBlocked =
    result.error instanceof OpenF1AuthError || drivers.error instanceof OpenF1AuthError

  if (isLoading) {
    return (
      <div className="section-pad grid min-h-[60vh] place-items-center pt-24">
        <RaceLoader size="lg" label="Contacting race control…" />
      </div>
    )
  }

  if (isError || !session) {
    return (
      <div className="section-pad pt-28">
        <ErrorState
          title="Couldn’t reach OpenF1"
          message="The live timing service is unavailable right now. Try again in a moment."
          onRetry={refetch}
        />
      </div>
    )
  }

  return (
    <div className="section-pad pb-16 pt-24">
      <SectionHeading
        eyebrow="Powered by OpenF1"
        title="Live"
        accent="Timing"
        className="mb-6"
      />

      <div className="mb-6">
        <SessionStatusBanner
          session={session}
          state={state}
          nextSession={next.data}
          onCountdownDone={() => {
            refetch()
            result.refetch()
          }}
        />
      </div>

      {authBlocked ? (
        <NeedsKeyCard nextSession={next.data} />
      ) : result.isLoading || drivers.isLoading ? (
        <div className="grid place-items-center py-16">
          <RaceLoader label="Reading the timing screens…" />
        </div>
      ) : result.data?.length ? (
        <>
          <LiveTimingBoard
            results={result.data}
            drivers={drivers.data}
            sessionType={session.session_type}
          />
          {live && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-text-dim">
              <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
              Auto-refreshing every 12 seconds
            </p>
          )}
        </>
      ) : (
        <EmptyState
          icon={Timer}
          title="No timing yet"
          message="Classification will appear once the session is underway."
        />
      )}
    </div>
  )
}

// Shown when a session is live but the free API tier is blocked (no key).
function NeedsKeyCard({ nextSession }) {
  return (
    <div className="card-surface accent-top mx-auto max-w-2xl p-6 text-center">
      <KeyRound size={36} className="mx-auto text-f1-red" />
      <h3 className="mt-3 font-display text-xl font-bold">Live session in progress</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-dim">
        OpenF1 restricts real-time data to authenticated users while a session is
        running. Add your own OpenF1 API key as{' '}
        <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">VITE_OPENF1_KEY</code>{' '}
        in a <code className="rounded bg-surface-2 px-1.5 py-0.5 text-xs">.env</code> file
        to unlock live timing here. Between sessions the board works without a key.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <a href="https://openf1.org/" target="_blank" rel="noreferrer" className="btn-ghost">
          <KeyRound size={15} /> Get an OpenF1 key
        </a>
        <a
          href="https://f1tv.formula1.com/"
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          <ExternalLink size={15} /> Watch on F1 TV
        </a>
      </div>
      {nextSession && (
        <p className="mt-4 text-xs text-text-dim">
          Next up: {nextSession.session_name} · {nextSession.circuit_short_name}
        </p>
      )}
    </div>
  )
}
