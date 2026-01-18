import { DateRange } from "react-day-picker";

export type TrendResult = {
  value: string;
  isPositive: boolean;
};

/**
 * Calculates the percentage change between current and previous values.
 * @param current - The current period value
 * @param previous - The previous period value
 * @returns An object with the formatted percentage string and whether it's positive
 */
export const calculatePercentageChange = (
  current: number,
  previous: number
): TrendResult => {
  // Edge case: both are 0
  if (previous === 0 && current === 0) {
    return { value: "0%", isPositive: true };
  }

  // Edge case: previous is 0 but current is positive
  if (previous === 0 && current > 0) {
    return { value: "+100%", isPositive: true };
  }

  // Edge case: previous is 0 but current is negative
  if (previous === 0 && current < 0) {
    return { value: "-100%", isPositive: false };
  }

  // Standard calculation: ((current - previous) / previous) * 100
  const percentageChange = ((current - previous) / Math.abs(previous)) * 100;
  const isPositive = percentageChange >= 0;

  // Format to 1 decimal place with Brazilian locale (comma as decimal separator)
  const formattedValue = Math.abs(percentageChange).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const prefix = isPositive ? "+" : "-";
  return {
    value: `${prefix}${formattedValue}%`,
    isPositive,
  };
};

/**
 * Calculates the previous month's date range based on the current range.
 * @param currentRange - The current date range
 * @returns The previous month's date range
 */
export const getPreviousMonthRange = (
  currentRange?: DateRange
): DateRange | undefined => {
  if (!currentRange?.from) {
    return undefined;
  }

  const currentFrom = currentRange.from;

  // Get the previous month
  const previousMonth = new Date(
    currentFrom.getFullYear(),
    currentFrom.getMonth() - 1,
    1
  );

  // Get the first day of the previous month
  const previousFrom = new Date(
    previousMonth.getFullYear(),
    previousMonth.getMonth(),
    1
  );

  // Get the last day of the previous month
  const previousTo = new Date(
    previousMonth.getFullYear(),
    previousMonth.getMonth() + 1,
    0
  );

  return { from: previousFrom, to: previousTo };
};

/**
 * Generates a tooltip text explaining the trend comparison.
 * @param current - The current period value
 * @param previous - The previous period value
 * @param trend - The calculated trend result
 * @returns A tooltip string explaining the comparison
 */
export const generateTrendTooltip = (
  current: number,
  previous: number
): string => {
  const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

  return `Comparado ao mês anterior: ${formatCurrency(previous)} → ${formatCurrency(current)}`;
};
