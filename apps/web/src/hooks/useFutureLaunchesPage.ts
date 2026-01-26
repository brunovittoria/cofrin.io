import { useState, useMemo, useEffect } from "react";
import {
  useFutureLaunches,
  useFutureLaunchesSummary,
  useCompleteFutureLaunch,
  useDeleteFutureLaunch,
} from "@/hooks/api/useFutureLaunches";
import { useFiltersStore, usePaginationStore } from "@/stores/ui-store";

export const useFutureLaunchesPage = () => {
  const searchTerm = useFiltersStore((state) => state.futureLaunchesSearchTerm);
  const setSearchTerm = useFiltersStore((state) => state.setFutureLaunchesSearchTerm);
  const dateRange = useFiltersStore((state) => state.futureLaunchesDateRange);
  const setDateRange = useFiltersStore((state) => state.setFutureLaunchesDateRange);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const currentPagePending = usePaginationStore((state) => state.futureLaunchesPendingPage);
  const setCurrentPagePending = usePaginationStore((state) => state.setFutureLaunchesPendingPage);
  const currentPageCompleted = usePaginationStore((state) => state.futureLaunchesCompletedPage);
  const setCurrentPageCompleted = usePaginationStore((state) => state.setFutureLaunchesCompletedPage);
  const pageSize = usePaginationStore((state) => state.futureLaunchesPageSize);

  const {
    data: pendingLaunches = [],
    isLoading: loadingPending,
    refetch: refetchPending,
  } = useFutureLaunches(dateRange, "pendente");

  const {
    data: completedLaunches = [],
    isLoading: loadingCompleted,
    refetch: refetchCompleted,
  } = useFutureLaunches(dateRange, "efetivado");

  const { data: summary, refetch: refetchSummary } =
    useFutureLaunchesSummary(dateRange);

  const completeLaunch = useCompleteFutureLaunch();
  const deleteLaunch = useDeleteFutureLaunch();

  const filteredPending = useMemo(() => {
    return pendingLaunches.filter(
      (launch) =>
        launch.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        launch.categories?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [pendingLaunches, searchTerm]);

  const totalPagesPending = useMemo(() => {
    return Math.ceil(filteredPending.length / pageSize);
  }, [filteredPending.length, pageSize]);

  const paginatedPending = useMemo(() => {
    const startIndex = (currentPagePending - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPending.slice(startIndex, endIndex);
  }, [filteredPending, currentPagePending, pageSize]);

  const totalPagesCompleted = useMemo(() => {
    return Math.ceil(completedLaunches.length / pageSize);
  }, [completedLaunches.length, pageSize]);

  const paginatedCompleted = useMemo(() => {
    const startIndex = (currentPageCompleted - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return completedLaunches.slice(startIndex, endIndex);
  }, [completedLaunches, currentPageCompleted, pageSize]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPagePending(1);
  }, [searchTerm, dateRange, setCurrentPagePending]);

  useEffect(() => {
    setCurrentPageCompleted(1);
  }, [dateRange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refetchPending(),
      refetchCompleted(),
      refetchSummary(),
    ]);
    setIsRefreshing(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    pendingLaunches,
    filteredPending,
    paginatedPending,
    completedLaunches,
    paginatedCompleted,
    summary,
    completeLaunch,
    deleteLaunch,
    loadingPending: loadingPending || isRefreshing,
    loadingCompleted: loadingCompleted || isRefreshing,
    handleRefresh,
    currentPagePending,
    setCurrentPagePending,
    totalPagesPending,
    currentPageCompleted,
    setCurrentPageCompleted,
    totalPagesCompleted,
  };
};
