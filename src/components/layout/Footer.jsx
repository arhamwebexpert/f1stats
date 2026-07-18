import { Link } from 'react-router-dom'
import { Github, Flag } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      <div className="section-pad flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 -skew-x-6 place-items-center bg-f1-red font-display text-white">
              <span className="skew-x-6" style={{ fontWeight: 900 }}>F</span>
            </span>
            <span className="font-display font-bold">F1 STATS HUB</span>
          </Link>
          <p className="mt-2 max-w-md text-sm text-text-dim">
            Every lap, every legend — Formula 1 statistics from 1950 to today.
            Data courtesy of the Jolpica (Ergast-compatible) &amp; OpenF1 APIs.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-dim">
          <a
            href="https://github.com/jolpica/jolpica-f1"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-white"
          >
            <Github size={16} /> Data source
          </a>
          <span className="inline-flex items-center gap-1.5">
            <Flag size={16} className="text-f1-red" /> Unofficial fan project
          </span>
        </div>
      </div>
      <div className="section-pad pb-24 pt-2 text-xs text-text-dim sm:pb-6">
        © {new Date().getFullYear()} F1 Stats Hub. Not affiliated with Formula 1,
        the FIA, or any team.
      </div>
    </footer>
  )
}
