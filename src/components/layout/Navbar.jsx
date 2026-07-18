import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Flag, Users, Trophy, Calendar, GitCompareArrows, LayoutGrid, Radio } from 'lucide-react'
import { CURRENT_SEASON } from '../../lib/queryClient.js'
import { useLatestSession, sessionState } from '../../hooks/useOpenF1.js'

const LINKS = [
  { to: '/live', label: 'Live', icon: Radio, match: '/live' },
  { to: '/drivers', label: 'Drivers', icon: Users, match: '/drivers' },
  { to: '/teams', label: 'Teams', icon: LayoutGrid, match: '/teams' },
  { to: `/standings/${CURRENT_SEASON}`, label: 'Standings', icon: Trophy, match: '/standings' },
  { to: '/seasons', label: 'Seasons', icon: Calendar, match: '/seasons' },
  { to: '/compare', label: 'Compare', icon: GitCompareArrows, match: '/compare' },
]

function activeIndex(pathname) {
  return LINKS.findIndex((l) => pathname.startsWith(l.match))
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const listRef = useRef(null)
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false })

  // Pulse the Live link when a session is currently running.
  const { data: latestSession } = useLatestSession()
  const isLive = sessionState(latestSession) === 'live'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Slide the pill under the active desktop link on every route change.
  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const idx = activeIndex(pathname)
    if (idx < 0) {
      setPill((p) => ({ ...p, visible: false }))
      return
    }
    // The pill <span> is the first child; the links follow it.
    const el = list.querySelectorAll('a')[idx]
    if (el) {
      setPill({ left: el.offsetLeft, width: el.offsetWidth, visible: true })
    }
  }, [pathname])

  return (
    <>
      {/* Top bar */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass shadow-lg shadow-black/30' : 'bg-transparent'
        }`}
      >
        <nav className="section-pad flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid h-8 w-8 -skew-x-6 place-items-center bg-f1-red font-display text-lg font-900 text-white">
              <span className="skew-x-6" style={{ fontWeight: 900 }}>F</span>
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              F1 <span className="text-f1-red">STATS</span> HUB
            </span>
          </Link>

          <div ref={listRef} className="relative hidden items-center gap-1 md:flex">
            {/* sliding pill indicator */}
            <span
              aria-hidden="true"
              className="absolute top-1/2 -z-0 h-9 -translate-y-1/2 rounded-lg border border-f1-red/40 bg-f1-red/15 transition-all duration-300 ease-out"
              style={{
                left: pill.left,
                width: pill.width,
                opacity: pill.visible ? 1 : 0,
              }}
            />
            {LINKS.map(({ to, label, match }) => (
              <NavLink
                key={to}
                to={to}
                className={() => {
                  const active = pathname.startsWith(match)
                  return `relative z-10 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors ${
                    active ? 'text-white' : 'text-text-dim hover:text-white'
                  }`
                }}
              >
                <span className="relative">
                  {label}
                  {to === '/live' && isLive && (
                    <span className="absolute -right-2.5 -top-1 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-f1-red" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-f1-red" />
                    </span>
                  )}
                </span>
              </NavLink>
            ))}
          </div>

          <Link to="/drivers" className="hidden md:inline-flex btn-primary py-2">
            <Flag size={15} /> Explore
          </Link>
        </nav>
      </header>

      {/* Mobile bottom tab bar (full-width so all items fit; safe-area aware) */}
      <nav className="mobile-dock fixed inset-x-0 bottom-0 z-50 md:hidden">
        <div className="glass flex items-stretch justify-around border-t border-white/10 px-0.5">
          {LINKS.map(({ to, label, icon: Icon, match }) => {
            const active = pathname.startsWith(match)
            return (
              <NavLink
                key={to}
                to={to}
                className={`relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[9px] font-semibold leading-none transition-colors ${
                  active ? 'text-f1-red' : 'text-text-dim'
                }`}
              >
                <span className="relative">
                  <Icon size={19} />
                  {to === '/live' && isLive && (
                    <span className="absolute -right-1 -top-0.5 h-2 w-2 animate-ping rounded-full bg-f1-red" />
                  )}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-f1-red" />
                  )}
                </span>
                <span className="whitespace-nowrap">{label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}
