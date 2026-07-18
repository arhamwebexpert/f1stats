// React Bits–style GradientText: an animated sweeping gradient over text.
export default function GradientText({
  children,
  className = '',
  colors = ['#e10600', '#ff5c52', '#ffffff', '#ff5c52', '#e10600'],
  animationSpeed = 6,
  as: Tag = 'span',
}) {
  const gradient = `linear-gradient(90deg, ${colors.join(', ')})`
  return (
    <Tag
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: gradient,
        backgroundSize: '300% 100%',
        WebkitBackgroundClip: 'text',
        animation: `gradientSweep ${animationSpeed}s linear infinite`,
      }}
    >
      {children}
      <style>{`
        @keyframes gradientSweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </Tag>
  )
}
