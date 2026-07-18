import { Link } from 'react-router-dom'
import { Flag } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import Particles from '../components/reactbits/Particles.jsx'
import SplitText from '../components/reactbits/SplitText.jsx'
import ShinyText from '../components/reactbits/ShinyText.jsx'
import Magnet from '../components/reactbits/Magnet.jsx'
import StarBorder from '../components/reactbits/StarBorder.jsx'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 pt-24 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-50">
        <Particles density={55} speed={0.2} />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg" />
      </div>

      <span className="font-display text-8xl font-900 leading-none text-f1-red sm:text-9xl">
        <SplitText text="404" delay={90} className="inline-block" />
      </span>
      <ShinyText className="mt-4 block font-display text-2xl font-bold uppercase tracking-wide">
        Off the track
      </ShinyText>
      <p className="mt-3 max-w-sm text-text-dim">
        This page spun off into the gravel. Let’s get you back on the racing line.
      </p>
      <div className="mt-6">
        <Magnet strength={0.4}>
          <StarBorder speed={4}>
            <Link to="/" className="btn-primary bg-f1-red/90 shadow-none hover:bg-f1-red">
              <Flag size={16} /> Back to the grid
            </Link>
          </StarBorder>
        </Magnet>
      </div>
    </div>
  )
}
