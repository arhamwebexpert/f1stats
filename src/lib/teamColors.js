// constructorId → brand hex. Current grid uses official-ish colors.
// Historical / defunct teams fall back to a neutral slate.

export const TEAM_COLORS = {
  ferrari: '#E8002D',
  mclaren: '#FF8000',
  red_bull: '#3671C6',
  mercedes: '#27F4D2',
  aston_martin: '#229971',
  alpine: '#FF87BC',
  williams: '#64C4FF',
  rb: '#6692FF',
  alphatauri: '#6692FF',
  toro_rosso: '#469BFF',
  sauber: '#52E252',
  alfa: '#C92D4B',
  haas: '#B6BABD',
  racing_point: '#F596C8',
  force_india: '#F596C8',
  renault: '#FFF500',
  lotus_f1: '#FFB800',
  benetton: '#1E9B4E',
  jordan: '#FFD700',
  brawn: '#B4E44C',
  tyrrell: '#0B0B8F',
  lotus: '#00843D',
  brabham: '#004225',
  jaguar: '#0A6E43',
}

const NEUTRAL = '#5b6172'

export function teamColor(constructorId) {
  if (!constructorId) return NEUTRAL
  return TEAM_COLORS[constructorId] || NEUTRAL
}

/** Returns a translucent version of a team color for backgrounds. */
export function teamColorAlpha(constructorId, alpha = 0.15) {
  const hex = teamColor(constructorId)
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
