// Shimmering skeleton primitives shaped like the final content.

export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="card-surface accent-top p-4">
      <Skeleton className="mb-4 h-8 w-16" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function GridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 10 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
