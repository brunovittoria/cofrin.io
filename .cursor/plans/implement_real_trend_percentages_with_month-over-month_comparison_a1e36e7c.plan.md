---
name: Implement Real Trend Percentages with Month-over-Month Comparison
overview: ""
todos:
  - id: create-trend-utils
    content: Create trendUtils.ts with calculatePercentageChange and getPreviousMonthRange functions
    status: completed
  - id: add-previous-month-hooks
    content: Add previous month summary hooks to useEntradas, useSaidas, and useLancamentosFuturos
    status: completed
    dependencies:
      - create-trend-utils
  - id: update-financial-card
    content: Update FinancialCard component to support tooltips on trend badges
    status: completed
  - id: update-dashboard
    content: Update Dashboard page to calculate and display real trend percentages
    status: completed
    dependencies:
      - create-trend-utils
      - add-previous-month-hooks
      - update-financial-card
  - id: update-transaction-metrics
    content: Update TransactionMetrics component to calculate and display real trend percentages
    status: completed
    dependencies:
      - create-trend-utils
      - add-previous-month-hooks
  - id: update-transactions-page
    content: Pass dateRange prop to TransactionMetrics component
    status: completed
    dependencies:
      - update-transaction-metrics
---

# Implement Real Trend Percentages with Month-over-Month Comparison

## Overview

Replace hardcoded trend percentages in the Dashboard and add trend percentages to the Transactions page. Both will calculate month-over-month percentage changes comparing the current period to the previous month, with tooltips explaining the calculation.

## Implementation Steps

### 1. Create Utility Functions for Trend Calculation

- **File**: `src/lib/trendUtils.ts` (new file)
- `calculatePercentageChange(current: number, previous: number): { value: string, isPositive: boolean }`
- Formula: `((current - previous) / previous) * 100`
- Handle edge cases: 0→positive = "+100%", 0→0 = "0%"
- Format percentage to 1 decimal place with Brazilian locale (comma as decimal separator)
- `getPreviousMonthRange(currentRange: DateRange): DateRange`
- Calculate previous month's date range based on current range
- Handle month boundaries correctly

### 2. Create Custom Hooks for Previous Month Data

- **File**: `src/hooks/api/useEntradas.ts`
- Add `useEntradasSummaryPreviousMonth(dateRange?: DateRange)` hook
- Fetches summary data for the month before the current dateRange

- **File**: `src/hooks/api/useSaidas.ts`
- Add `useSaidasSummaryPreviousMonth(dateRange?: DateRange)` hook
- Fetches summary data for the month before the current dateRange

- **File**: `src/hooks/api/useLancamentosFuturos.ts`
- Add `useLancamentosFuturosSummaryPreviousMonth(dateRange?: DateRange)` hook
- Fetches summary data for the month before the current dateRange

### 3. Update FinancialCard Component

- **File**: `src/components/FinancialCard.tsx`
- Add optional `tooltipText?: string` prop
- Wrap the trend badge with Tooltip component from `@/components/ui/tooltip`
- Display tooltip explaining: "Comparado ao mês anterior: [previous value] → [current value]"

### 4. Update Dashboard Page

- **File**: `src/pages/authenticated/Index.tsx`
- Import trend utilities and previous month hooks
- Fetch previous month summaries for entradas, saidas, and lancamentos futuros
- Calculate trend percentages for:
- Total de Entradas (current vs previous month entradas)
- Total de Saídas (current vs previous month saidas)
- Saldo Atual (current balance vs previous month balance)
- A Receber (previsto) (current vs previous month aReceber)
- A Pagar (previsto) (current vs previous month aPagar)
- Pass calculated trends and tooltip text to FinancialCard components
- Handle loading states for previous month data

### 5. Update Transactions Page

- **File**: `src/pages/authenticated/transactions/components/TransactionMetrics.tsx`
- Import trend utilities and previous month hooks
- Accept `dateRange` prop (already available from parent)
- Fetch previous month summaries for entradas and saidas
- Calculate trend percentages for:
- Total de Entradas
- Total de Saídas
- Saldo Líquido (balance)
- Update MetricCard to display trend badges with tooltips
- Add tooltip component to explain the percentage

### 6. Update Transactions Page Parent

- **File**: `src/pages/authenticated/transactions/index.tsx`
- Pass `dateRange` prop to TransactionMetrics component

## Technical Details

- Percentage format: Brazilian locale (e.g., "12,5%" not "12.5%")
- Tooltip text: "Comparado ao mês anterior: R$ X,XX → R$ Y,YY (variação de Z,Z%)"
- Handle loading states gracefully (show trend only when previous month data is available)
- Previous month calculation: If current range is January 2026, previous is December 2025

## Files to Modify

1. `src/lib/trendUtils.ts` (new)
2. `src/hooks/api/useEntradas.ts`
3. `src/hooks/api/useSaidas.ts`
4. `src/hooks/api/useLancamentosFuturos.ts`
5. `src/components/FinancialCard.tsx`
6. `src/pages/authenticated/Index.tsx`
7. `src/pages/authenticated/transactions/components/TransactionMetrics.tsx`
8. `src/pages/authenticated/transactions/index.tsx`