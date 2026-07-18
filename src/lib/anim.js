// Thin wrapper around anime.js v4 that respects prefers-reduced-motion.
// When reduced motion is requested we snap targets to their final state
// instead of animating.

import { animate, stagger } from 'animejs'

export { stagger }

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * animate() drop-in that honors reduced motion.
 * If reduced, we apply the end-values immediately (arrays → last value)
 * and fire onComplete/onUpdate once so counters etc. land on target.
 */
export function motion(targets, params = {}) {
  if (!prefersReducedMotion()) {
    return animate(targets, params)
  }

  // Reduced-motion path: jump to final values.
  const finalParams = { ...params, duration: 0, delay: 0, ease: 'linear' }
  // Resolve array keyframes to their final value so nothing is left mid-flight.
  for (const key of Object.keys(finalParams)) {
    const v = finalParams[key]
    if (Array.isArray(v)) finalParams[key] = v[v.length - 1]
  }
  const inst = animate(targets, finalParams)
  return inst
}

/**
 * Odometer-style number counter. Writes formatted integers into `el`.
 */
export function animateCounter(el, target, { duration = 1400, format } = {}) {
  if (!el) return
  const fmt = format || ((n) => Math.round(n).toLocaleString())
  if (prefersReducedMotion()) {
    el.textContent = fmt(target)
    return
  }
  const obj = { value: 0 }
  animate(obj, {
    value: target,
    duration,
    ease: 'outExpo',
    onUpdate: () => {
      el.textContent = fmt(obj.value)
    },
  })
}
