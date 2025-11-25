import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "./PageHeader";
import { DateRange } from "react-day-picker";

interface LoadingSkeletonProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const LoadingSkeleton = ({
  dateRange,
  onDateRangeChange,
}: LoadingSkeletonProps) => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="muted-card p-6 sm:p-8">
          <PageHeader
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-32 rounded-3xl bg-white" />
            ))}
          </div>
          <div className="mt-6 space-y-6">
            <Skeleton className="h-16 rounded-3xl bg-white" />
            <Skeleton className="h-[360px] rounded-3xl bg-white" />
          </div>
        </section>
      </div>
    </div>
  );
};

