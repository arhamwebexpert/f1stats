// React Bits–style StarBorder: a light travels around a rounded border. Two
// offset radial glints orbit opposite edges via CSS keyframes; the inner slot
// holds the real content. Pure CSS — reduced motion freezes the glints.
export default function StarBorder({
  children,
  color = '#e10600',
  speed = 5,
  className = '',
  innerClassName = '',
  as: Tag = 'div',
}) {
  return (
    <Tag
      className={`star-border ${className}`}
      style={{ '--star-color': color, '--star-speed': `${speed}s` }}
    >
      <span className="star-border-glow star-border-bottom" aria-hidden="true" />
      <span className="star-border-glow star-border-top" aria-hidden="true" />
      <div className={`star-border-inner ${innerClassName}`}>{children}</div>
    </Tag>
  )
}
