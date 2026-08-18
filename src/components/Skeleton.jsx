export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-line/80 dark:bg-line ${className}`}
      aria-hidden
    />
  )
}

export function RestaurantCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function FoodCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function PageSkeleton({ cards = 6, food = false }) {
  const Card = food ? FoodCardSkeleton : RestaurantCardSkeleton
  return (
    <div className="container-app py-8 sm:py-10">
      <Skeleton className="mb-3 h-9 w-56" />
      <Skeleton className="mb-8 h-4 w-72 max-w-full" />
      <div className="card-grid card-grid-3">
        {Array.from({ length: cards }).map((_, i) => (
          <Card key={i} />
        ))}
      </div>
    </div>
  )
}
