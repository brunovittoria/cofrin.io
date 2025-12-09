import { DateRange } from "react-day-picker";
import { RefreshButton } from "@/components/RefreshButton";
import { MonthPicker } from "@/components/MonthPicker";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ChevronDown } from "lucide-react";

interface LoadingSkeletonProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const LoadingSkeleton = ({
  dateRange,
  onDateRangeChange,
}: LoadingSkeletonProps) => {
  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors sm:p-8">
          {/* Header */}
          <header className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
                Transações
              </h1>
              <p className="text-sm text-[#6B7280]">
                Gerencie todas as suas receitas e despesas em um só lugar
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <RefreshButton onRefresh={() => {}} />
              <MonthPicker
                dateRange={dateRange}
                onSelect={onDateRangeChange}
              />
              <Button
                className="group relative flex h-10 items-center justify-center gap-2 rounded-2xl border border-[#CBD5F5] bg-[#E8F2FF] px-5 py-2.5 text-sm font-semibold text-[#0A84FF] shadow-[0_18px_32px_-24px_rgba(15,23,42,0.18)] transition-all"
                disabled
              >
                <Plus className="h-4 w-4" />
                <span>Nova Transação</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Metrics Skeleton */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="surface-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar Skeleton */}
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-10 w-72 rounded-xl" />
            <Skeleton className="h-10 w-full md:w-96 rounded-xl" />
          </div>

          {/* Table Skeleton */}
          <div className="mt-6 surface-card p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-64" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

