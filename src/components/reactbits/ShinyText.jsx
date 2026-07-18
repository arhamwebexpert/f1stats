// React Bits–style ShinyText: a sheen sweeps across the text on a loop.
// Pure CSS (masked gradient) — the reduced-motion block in index.css freezes
// the animation globally, so no JS guard is needed.
export default function ShinyText({
  children,
  text,
  speed = 4,
  className = '',
  as: Tag = 'span',
}) {
  return (
    <Tag
      className={`shiny-text ${className}`}
      style={{ '--shine-speed': `${speed}s` }}
    >
      {children ?? text}
    </Tag>
  )
}
