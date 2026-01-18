import { Skeleton } from "@/components/ui/skeleton";

interface PageSkeletonProps {
  hasCards?: boolean;
  cardCount?: number;
  hasChart?: boolean;
  hasTable?: boolean;
  hasMultipleSections?: boolean;
}

export const PageSkeleton = ({
  hasCards = true,
  cardCount = 3,
  hasChart = false,
  hasTable = true,
  hasMultipleSections = false,
}: PageSkeletonProps) => {
  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors sm:p-8">
          {/* Header Skeleton */}
          <div className="flex flex-col gap-6 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-32 rounded-md bg-muted/50" />
              <Skeleton className="h-8 w-64 rounded-md" />
              <Skeleton className="h-4 w-96 rounded-md bg-muted/50" />
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Skeleton className="h-12 w-32 rounded-2xl" />
              <Skeleton className="h-12 w-40 rounded-2xl" />
            </div>
          </div>

          {/* Cards Skeleton */}
          {hasCards && (
            <div className={`mt-8 grid gap-6 md:grid-cols-${cardCount}`}>
              {Array.from({ length: cardCount }).map((_, index) => (
                <Skeleton key={index} className="h-32 rounded-3xl" />
              ))}
            </div>
          )}

          {/* Chart Skeleton */}
          {hasChart && (
            <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <Skeleton className="h-[400px] rounded-3xl" />
              <Skeleton className="h-[400px] rounded-3xl" />
            </div>
          )}

          {/* Table/Content Skeleton */}
          {hasTable && (
            <div className="mt-8 space-y-6">
              <Skeleton className="h-16 w-full rounded-3xl" />
              <Skeleton className="h-[360px] w-full rounded-3xl" />
            </div>
          )}

          {/* Multiple Sections Skeleton (for futuros page) */}
          {hasMultipleSections && (
            <div className="mt-8 space-y-6">
              <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors">
                <Skeleton className="mb-4 h-6 w-64 rounded-md" />
                <Skeleton className="h-[300px] w-full rounded-3xl" />
              </section>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

