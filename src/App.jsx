import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import PageTransition from './components/layout/PageTransition.jsx'
import PageLoader from './components/common/PageLoader.jsx'
import ClickSpark from './components/reactbits/ClickSpark.jsx'
import { queryClient, CURRENT_SEASON } from './lib/queryClient.js'
import { apiGet } from './lib/api.js'

// Route-level code splitting.
const Home = lazy(() => import('./pages/Home.jsx'))
const Drivers = lazy(() => import('./pages/Drivers.jsx'))
const DriverDetail = lazy(() => import('./pages/DriverDetail.jsx'))
const Teams = lazy(() => import('./pages/Teams.jsx'))
const TeamDetail = lazy(() => import('./pages/TeamDetail.jsx'))
const Standings = lazy(() => import('./pages/Standings.jsx'))
const Seasons = lazy(() => import('./pages/Seasons.jsx'))
const RaceDetail = lazy(() => import('./pages/RaceDetail.jsx'))
const HeadToHead = lazy(() => import('./pages/HeadToHead.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  // Preload current-season driver standings — the most-visited data set.
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['driverStandings', String(CURRENT_SEASON)],
      queryFn: async () => {
        const data = await apiGet(`/${CURRENT_SEASON}/driverstandings?limit=100`)
        const list = data.StandingsTable?.StandingsLists?.[0]
        return {
          season: list?.season ?? String(CURRENT_SEASON),
          round: list?.round,
          standings: list?.DriverStandings ?? [],
        }
      },
    })
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <ClickSpark />
      <Navbar />
      <ScrollToTop />
      <main className="flex-1">
        <PageTransition>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/drivers/:driverId" element={<DriverDetail />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:constructorId" element={<TeamDetail />} />
              <Route
                path="/standings"
                element={<Navigate to={`/standings/${CURRENT_SEASON}`} replace />}
              />
              <Route path="/standings/:season" element={<Standings />} />
              <Route path="/seasons" element={<Seasons />} />
              <Route path="/seasons/:year/:round" element={<RaceDetail />} />
              <Route path="/compare" element={<HeadToHead />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}
