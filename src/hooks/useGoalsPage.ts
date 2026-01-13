import { useState, useMemo } from "react";
import { useGoals, useGoalsSummary, useDeleteGoal, GoalStatus } from "@/hooks/api/useGoals";

export const useGoalsPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<GoalStatus | "all">("all");
  const pageSize = 6;

  const {
    data: goals = [],
    isLoading: isLoadingGoals,
    refetch: refetchGoals,
  } = useGoals();

  const {
    data: summary,
    isLoading: isLoadingSummary,
    refetch: refetchSummary,
  } = useGoalsSummary();

  const deleteGoal = useDeleteGoal();

  // Filter goals by status
  const filteredGoals = useMemo(() => {
    if (statusFilter === "all") return goals;
    return goals.filter((goal) => goal.status === statusFilter);
  }, [goals, statusFilter]);

  // Pagination
  const totalPages = useMemo(() => {
    return Math.ceil(filteredGoals.length / pageSize);
  }, [filteredGoals.length, pageSize]);

  const paginatedGoals = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredGoals.slice(startIndex, endIndex);
  }, [filteredGoals, currentPage, pageSize]);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: GoalStatus | "all") => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchGoals(), refetchSummary()]);
    setIsRefreshing(false);
  };

  return {
    goals: filteredGoals,
    paginatedGoals,
    summary: summary || { total: 0, active: 0, completed: 0, paused: 0, totalProgress: 0 },
    deleteGoal,
    isLoading: isLoadingGoals || isLoadingSummary || isRefreshing,
    handleRefresh,
    currentPage,
    setCurrentPage,
    totalPages,
    statusFilter,
    setStatusFilter: handleFilterChange,
  };
};
