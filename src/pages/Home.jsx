import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Flag, Trophy } from 'lucide-react'
import VideoHero from '../components/hero/VideoHero.jsx'
import HeroStats from '../components/hero/HeroStats.jsx'
import SplitText from '../components/reactbits/SplitText.jsx'
import GradientText from '../components/reactbits/GradientText.jsx'
import SpotlightCard from '../components/reactbits/SpotlightCard.jsx'
import Magnet from '../components/reactbits/Magnet.jsx'
import StarBorder from '../components/reactbits/StarBorder.jsx'
import Particles from '../components/reactbits/Particles.jsx'
import { useDriverStandings, useConstructorStandings } from '../hooks/useStandings.js'
import { useInView } from '../hooks/useInView.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { motion, stagger } from '../lib/anim.js'
import { CURRENT_SEASON } from '../lib/queryClient.js'
import { teamColor } from '../lib/teamColors.js'
import { flag } from '../lib/nationality.js'

export default function Home() {
  useDocumentTitle(
    'Every Lap. Every Legend.',
    'Explore Formula 1 drivers, teams, standings and history from 1950 to today.',
  )
  const navRef = useRef(null)

  useEffect(() => {
    // Navbar-like fade of the CTA cluster after the headline.
    const el = navRef.current
    if (!el) return
    motion(el, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 500,
      delay: 700,
      ease: 'outQuad',
    })
  }, [])

  return (
    <>
      <VideoHero>
        <SplitText
          as="h1"
          text="EVERY LAP. EVERY LEGEND."
          delay={30}
          className="max-w-4xl font-display text-4xl font-900 uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
        />
        <p className="mt-5 text-lg text-text-dim sm:text-xl">
          <GradientText className="font-display font-bold uppercase tracking-wide">
            Seventy-five years of Formula 1, one hub.
          </GradientText>
        </p>

        <HeroStats />

        <div ref={navRef} className="mt-8 flex flex-wrap items-center justify-center gap-4" style={{ opacity: 0 }}>
          <Magnet strength={0.4}>
            <StarBorder speed={4}>
              <Link to="/drivers" className="btn-primary bg-f1-red/90 shadow-none hover:bg-f1-red">
                <Flag size={16} /> Explore Drivers
              </Link>
            </StarBorder>
          </Magnet>
          <Magnet strength={0.4}>
            <Link to={`/standings/${CURRENT_SEASON}`} className="btn-ghost">
              <Trophy size={16} /> {CURRENT_SEASON} Standings
            </Link>
          </Magnet>
        </div>

        <a
          href="#glance"
          aria-label="Scroll to current season"
          className="absolute bottom-8 text-text-dim"
        >
          <ChevronDown size={28} className="animate-bounceCue" />
        </a>
      </VideoHero>

      <GlanceStrip />
    </>
  )
}

function GlanceStrip() {
  const { data: drivers } = useDriverStandings(CURRENT_SEASON)
  const { data: teams } = useConstructorStandings(CURRENT_SEASON)
  const [ref, inView] = useInView({ threshold: 0.15 })
  const gridRef = useRef(null)

  useEffect(() => {
    if (!inView) return
    const el = gridRef.current
    if (!el) return
    motion(el.querySelectorAll('.glance-card'), {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 550,
      delay: stagger(70),
      ease: 'outQuad',
    })
  }, [inView, drivers, teams])

  const topDrivers = drivers?.standings?.slice(0, 3) ?? []
  const topTeams = teams?.standings?.slice(0, 3) ?? []

  return (
    <section id="glance" ref={ref} className="relative overflow-hidden py-16">
      {/* subtle particle backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40">
        <Particles density={40} speed={0.18} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      </div>

      <div className="section-pad">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-900 uppercase sm:text-3xl">
            <SplitText text={`${CURRENT_SEASON} `} delay={22} className="inline-block" />
            <SplitText
              text="at a Glance"
              delay={22}
              startDelay={120}
              className="inline-block text-f1-red"
            />
          </h2>
          <Link
            to={`/standings/${CURRENT_SEASON}`}
            className="text-sm font-semibold text-text-dim hover:text-white"
          >
            Full standings →
          </Link>
        </div>

        <div ref={gridRef} className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-dim">
            Drivers
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {topDrivers.map((s, i) => {
              const d = s.Driver
              const c = s.Constructors?.[0]
              return (
                <SpotlightCard key={d.driverId} className="glance-card" style={{ opacity: 0 }}>
                  <Link to={`/drivers/${d.driverId}`} className="block p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl font-900 text-text-dim">
                        P{i + 1}
                      </span>
                      <span className="text-xl">{flag(d.nationality)}</span>
                    </div>
                    <p className="mt-2 font-bold leading-tight">
                      {d.givenName} {d.familyName}
                    </p>
                    <p className="text-xs" style={{ color: teamColor(c?.constructorId) }}>
                      {c?.name}
                    </p>
                    <p className="mt-2 font-display text-lg font-bold">{s.points} pts</p>
                  </Link>
                </SpotlightCard>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-text-dim">
            Constructors
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {topTeams.map((s, i) => {
              const c = s.Constructor
              return (
                <SpotlightCard
                  key={c.constructorId}
                  className="glance-card"
                  spotlightColor={`${teamColor(c.constructorId)}30`}
                  style={{ opacity: 0 }}
                >
                  <Link to={`/teams/${c.constructorId}`} className="block p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-2xl font-900 text-text-dim">
                        P{i + 1}
                      </span>
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: teamColor(c.constructorId) }}
                      />
                    </div>
                    <p className="mt-2 font-bold uppercase leading-tight">{c.name}</p>
                    <p className="mt-2 font-display text-lg font-bold">{s.points} pts</p>
                  </Link>
                </SpotlightCard>
              )
            })}
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
