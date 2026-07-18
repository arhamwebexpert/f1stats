import RaceLoader from '../reactbits/RaceLoader.jsx'

// Centered full-viewport loader for route-level Suspense fallbacks.
export default function PageLoader({ label = 'Lights out…' }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <RaceLoader size="lg" label={label} />
    </div>
  )
}
