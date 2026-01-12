import { useState, useMemo, useEffect } from "react";
import { DateRange } from "react-day-picker";
import {
  useFutureLaunches,
  useFutureLaunchesSummary,
  useCompleteFutureLaunch,
  useDeleteFutureLaunch,
} from "@/hooks/api/useFutureLaunches";

export const useFutureLaunchesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageCompleted, setCurrentPageCompleted] = useState(1);
  const pageSize = 5;

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
        launch.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        launch.categorias?.nome
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
  }, [searchTerm, dateRange]);

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
