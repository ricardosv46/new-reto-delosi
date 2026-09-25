import { Skeleton } from '@/shared/presentation/components/Skeleton';

export function CatalogSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="aspect-[4/3] w-full rounded-[28px] sm:aspect-[21/9]" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div className="space-y-2">
          <Skeleton className="mb-3 h-3 w-20" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-3 rounded-3xl bg-card p-4">
              <Skeleton className="h-[170px] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-8 flex-1 rounded-full" />
                <Skeleton className="h-8 flex-1 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
