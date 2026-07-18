import SplitText from '../reactbits/SplitText.jsx'
import ShinyText from '../reactbits/ShinyText.jsx'

// Standardized animated page/section heading: a shiny eyebrow kicker above a
// SplitText title (with an optional red accent word), and an optional action
// slot on the right. Used across every page so headings animate consistently.
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  action,
  size = 'lg',
  className = '',
}) {
  const titleClass =
    size === 'sm'
      ? 'text-2xl font-900 uppercase sm:text-3xl'
      : 'text-3xl font-900 uppercase sm:text-4xl'

  return (
    <header className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && (
          <ShinyText className="mb-1 block text-xs font-semibold uppercase tracking-[0.25em]">
            {eyebrow}
          </ShinyText>
        )}
        <h1 className={`font-display ${titleClass}`}>
          <SplitText text={title} delay={22} className="inline-block" />
          {accent && (
            <>
              {' '}
              <SplitText
                text={accent}
                delay={22}
                startDelay={title.length * 22}
                className="inline-block text-f1-red"
              />
            </>
          )}
        </h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
