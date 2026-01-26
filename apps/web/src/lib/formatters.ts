export const formatCurrency = (value: number) =>
  "R$ " + value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

/**
 * Parses a date-only string (YYYY-MM-DD) as a local date without timezone conversion.
 * This prevents the common issue where "2025-11-18" becomes "2025-11-17" in timezones behind UTC.
 */
export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Formats a date-only string (YYYY-MM-DD) to Brazilian format (DD/MM/YYYY)
 * without timezone conversion.
 */
export const formatLocalDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return "";
  }
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

/**
 * Converts a Date object to YYYY-MM-DD format in local timezone
 */
export const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
