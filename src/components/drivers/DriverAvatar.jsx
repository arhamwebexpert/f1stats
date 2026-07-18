import { useState } from 'react'
import { useDriverPhoto } from '../../hooks/useDriverPhoto.js'
import { useInView } from '../../hooks/useInView.js'

// Driver portrait with graceful fallback. Lazily fetches the Wikipedia photo
// only once the avatar scrolls into view (so grids don't fire dozens of
// requests up front). If there's no photo — older/obscure drivers — it renders
// the driver's initials on a team-colour gradient instead.
export default function DriverAvatar({
  driver,
  accent = '#26263a',
  className = '',
  rounded = 'rounded-xl',
  initialsClassName = 'text-xl',
  eager = false,
}) {
  const [wrapRef, inView] = useInView({ threshold: 0, once: true })
  const { data: photo } = useDriverPhoto(driver?.url, eager || inView)
  const [errored, setErrored] = useState(false)

  const initials =
    `${driver?.givenName?.[0] ?? ''}${driver?.familyName?.[0] ?? ''}`.toUpperCase()
  const showPhoto = photo && !errored

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{
        background: showPhoto
          ? '#0a0a0f'
          : `linear-gradient(150deg, ${accent}, #0a0a0f 85%)`,
      }}
    >
      {showPhoto ? (
        <img
          src={photo}
          alt={`${driver.givenName} ${driver.familyName}`}
          loading="lazy"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className={`font-display font-900 text-white/85 ${initialsClassName}`}>
            {initials || '—'}
          </span>
        </div>
      )}
    </div>
  )
}
