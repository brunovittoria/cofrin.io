import { DateRange } from "react-day-picker";

/**
 * Calculates the percentage change between current and previous values
 * @param current - Current period value
 * @param previous - Previous period value
 * @returns Object with formatted percentage string and whether the change is positive
 */
export const calculatePercentageChange = (
  current: number,
  previous: number
): { value: string; isPositive: boolean } => {
  // Handle edge cases
  if (previous === 0 && current === 0) {
    return { value: "0%", isPositive: true };
  }

  if (previous === 0 && current > 0) {
    return { value: "+100%", isPositive: true };
  }

  if (previous === 0 && current < 0) {
    return { value: "-100%", isPositive: false };
  }

  // Standard calculation: ((current - previous) / previous) * 100
  const change = ((current - previous) / previous) * 100;
  const isPositive = change >= 0;
  const formattedValue = Math.abs(change).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return {
    value: `${isPositive ? "+" : "-"}${formattedValue}%`,
    isPositive,
  };
};

/**
 * Calculates the previous month's date range based on the current date range
 * @param currentRange - Current date range
 * @returns Previous month's date range
 */
export const getPreviousMonthRange = (
  currentRange: DateRange | undefined
): DateRange | undefined => {
  if (!currentRange?.from) {
    return undefined;
  }

  const fromDate = new Date(currentRange.from);
  const toDate = currentRange.to ? new Date(currentRange.to) : new Date(currentRange.from);

  // Calculate previous month
  const previousFrom = new Date(fromDate);
  previousFrom.setMonth(previousFrom.getMonth() - 1);
  previousFrom.setDate(1); // First day of previous month

  const previousTo = new Date(previousFrom);
  previousTo.setMonth(previousTo.getMonth() + 1);
  previousTo.setDate(0); // Last day of previous month

  return {
    from: previousFrom,
    to: previousTo,
  };
};
