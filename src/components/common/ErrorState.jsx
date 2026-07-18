import { AlertTriangle, RotateCw } from 'lucide-react'

export default function ErrorState({
  title = 'Something went off track',
  message = 'We couldn’t load this data. The F1 API may be rate-limiting — try again in a moment.',
  onRetry,
}) {
  return (
    <div className="card-surface accent-top mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-10 text-center">
      <AlertTriangle size={40} className="text-f1-red" />
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm text-text-dim">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          <RotateCw size={16} /> Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'No results', message, icon: Icon }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center text-text-dim">
      {Icon && <Icon size={36} className="opacity-40" />}
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {message && <p className="max-w-sm text-sm">{message}</p>}
    </div>
  )
}
