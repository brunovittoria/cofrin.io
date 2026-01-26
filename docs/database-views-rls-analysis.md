# Database Views and Tables - RLS Analysis

## Summary

Analysis of database views and tables to determine their usage and RLS status.

---

## Findings

### 🔴 Critical Security Issues Found

All three views and the `whatsapp_conversas` table have **NO RLS protection** and are **exposing data across all users**.

---

## 1. `vw_entradas_saidas_mensal` (VIEW)

### Purpose
Aggregates monthly income (`entradas`) and expenses (`saidas`) by month.

### View Definition
```sql
WITH e AS (
  SELECT date_trunc('month', entradas.data) AS mes,
    sum(entradas.valor) AS total_entradas
  FROM entradas
  GROUP BY date_trunc('month', entradas.data)
), s AS (
  SELECT date_trunc('month', saidas.data) AS mes,
    sum(saidas.valor) AS total_saidas
  FROM saidas
  GROUP BY date_trunc('month', saidas.data)
)
SELECT 
  COALESCE(e.mes, s.mes) AS mes,
  COALESCE(e.total_entradas, 0) AS total_entradas,
  COALESCE(s.total_saidas, 0) AS total_saidas
FROM e FULL JOIN s ON e.mes = s.mes
ORDER BY COALESCE(e.mes, s.mes);
```

### Usage in Codebase
- **File**: `apps/web/src/hooks/api/useChartData.ts`
- **Hook**: `useIncomeExpenseData()`
- **Component**: `IncomeExpenseChart` (used in Dashboard)

### Current Status
- ❌ **RLS**: NOT enabled (views don't support RLS directly)
- ❌ **User Filtering**: NO `user_id` filtering in the view
- 🔴 **Security Issue**: View aggregates data from **ALL users**, not just the authenticated user

### Impact
Users can see aggregated income/expense data from **all users** in the system, not just their own.

---

## 2. `vw_saidas_por_categoria` (VIEW)

### Purpose
Aggregates expenses (`saidas`) grouped by category.

### View Definition
```sql
SELECT 
  c.id AS categoria_id,
  COALESCE(c.nome, 'Sem categoria') AS categoria,
  sum(s.valor) AS total_saidas
FROM saidas s
LEFT JOIN categorias c ON c.id = s.categoria_id
GROUP BY c.id, c.nome
ORDER BY sum(s.valor) DESC;
```

### Usage in Codebase
- **File**: `apps/web/src/hooks/api/useChartData.ts`
- **Hook**: `useCategoryData()` (only when no date filter is applied)
- **Component**: `CategoryChart` (used in Dashboard)
- **Note**: When date filters are applied, the code queries `saidas` table directly instead

### Current Status
- ❌ **RLS**: NOT enabled (views don't support RLS directly)
- ❌ **User Filtering**: NO `user_id` filtering in the view
- 🔴 **Security Issue**: View aggregates expenses from **ALL users**, not just the authenticated user

### Impact
Users can see expense totals by category from **all users** in the system.

---

## 3. `vw_saldo_diario` (VIEW)

### Purpose
Calculates daily balance (cumulative) by generating a series of days and calculating running balance.

### View Definition
```sql
WITH dias AS (
  SELECT generate_series(
    LEAST(
      COALESCE((SELECT min(entradas.data) FROM entradas), CURRENT_DATE),
      COALESCE((SELECT min(saidas.data) FROM saidas), CURRENT_DATE)
    )::timestamp,
    GREATEST(
      COALESCE((SELECT max(entradas.data) FROM entradas), CURRENT_DATE),
      COALESCE((SELECT max(saidas.data) FROM saidas), CURRENT_DATE)
    )::timestamp,
    '1 day'::interval
  )::date AS dia
), e AS (
  SELECT entradas.data AS dia,
    sum(entradas.valor) AS entradas_dia
  FROM entradas
  GROUP BY entradas.data
), s AS (
  SELECT saidas.data AS dia,
    sum(saidas.valor) AS saidas_dia
  FROM saidas
  GROUP BY saidas.data
), base AS (
  SELECT 
    d.dia,
    COALESCE(e.entradas_dia, 0) AS entradas_dia,
    COALESCE(s.saidas_dia, 0) AS saidas_dia,
    (COALESCE(e.entradas_dia, 0) - COALESCE(s.saidas_dia, 0)) AS saldo_dia
  FROM dias d
  LEFT JOIN e ON e.dia = d.dia
  LEFT JOIN s ON s.dia = d.dia
)
SELECT 
  dia,
  entradas_dia,
  saidas_dia,
  sum(saldo_dia) OVER (ORDER BY dia) AS saldo_acumulado
FROM base
ORDER BY dia;
```

### Usage in Codebase
- **File**: `apps/web/src/hooks/api/useChartData.ts`
- **Hook**: `useBalanceData()`
- **Component**: `BalanceChart` (used in Dashboard)

### Current Status
- ❌ **RLS**: NOT enabled (views don't support RLS directly)
- ❌ **User Filtering**: NO `user_id` filtering in the view
- 🔴 **Security Issue**: View calculates balance from **ALL users'** transactions, not just the authenticated user

### Impact
Users can see daily balance calculations that include transactions from **all users** in the system.

---

## 4. `whatsapp_conversas` (TABLE)

### Purpose
Stores WhatsApp conversation data.

### Table Structure
| Column | Type | Description |
|--------|------|-------------|
| `id` | integer | Primary key (auto-increment) |
| `session_id` | varchar | WhatsApp session identifier |
| `message` | jsonb | Message data in JSON format |

### Usage in Codebase
- ❌ **NOT USED**: No references found in the codebase
- This table appears to be **unused/orphaned**

### Current Status
- ❌ **RLS**: NOT enabled
- ❌ **User Filtering**: NO `user_id` column exists
- 🔴 **Security Issue**: Table has no access control - completely open to all users
- ⚠️ **Data**: Contains 1,344 rows

### Impact
- If this table is used in the future, it would expose all conversation data to all users
- Currently unused, but represents a security risk if accessed

---

## Security Recommendations

### 🔴 HIGH PRIORITY: Fix Views

All three views need to be recreated with `user_id` filtering to respect RLS.

#### Option 1: Recreate Views with User Filtering (Recommended)

Views should filter by `user_id` using the `get_user_id_from_auth()` function:

```sql
-- Example for vw_entradas_saidas_mensal
CREATE OR REPLACE VIEW vw_entradas_saidas_mensal AS
WITH e AS (
  SELECT 
    date_trunc('month', entradas.data) AS mes,
    sum(entradas.valor) AS total_entradas
  FROM entradas
  WHERE entradas.user_id = get_user_id_from_auth()
  GROUP BY date_trunc('month', entradas.data)
), s AS (
  SELECT 
    date_trunc('month', saidas.data) AS mes,
    sum(saidas.valor) AS total_saidas
  FROM saidas
  WHERE saidas.user_id = get_user_id_from_auth()
  GROUP BY date_trunc('month', saidas.data)
)
SELECT 
  COALESCE(e.mes, s.mes) AS mes,
  COALESCE(e.total_entradas, 0) AS total_entradas,
  COALESCE(s.total_saidas, 0) AS total_saidas
FROM e FULL JOIN s ON e.mes = s.mes
ORDER BY COALESCE(e.mes, s.mes);
```

**Note**: Views cannot use RLS directly, but they can filter by calling functions that use `auth.uid()`.

#### Option 2: Use Security Definer Functions

Create functions with `SECURITY DEFINER` that use RLS:

```sql
CREATE OR REPLACE FUNCTION get_monthly_income_expense()
RETURNS TABLE (
  mes timestamp with time zone,
  total_entradas numeric,
  total_saidas numeric
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH e AS (
    SELECT date_trunc('month', entradas.data) AS mes,
      sum(entradas.valor) AS total_entradas
    FROM entradas
    WHERE entradas.user_id = get_user_id_from_auth()
    GROUP BY date_trunc('month', entradas.data)
  ), s AS (
    SELECT date_trunc('month', saidas.data) AS mes,
      sum(saidas.valor) AS total_saidas
    FROM saidas
    WHERE saidas.user_id = get_user_id_from_auth()
    GROUP BY date_trunc('month', saidas.data)
  )
  SELECT 
    COALESCE(e.mes, s.mes) AS mes,
    COALESCE(e.total_entradas, 0) AS total_entradas,
    COALESCE(s.total_saidas, 0) AS total_saidas
  FROM e FULL JOIN s ON e.mes = s.mes
  ORDER BY COALESCE(e.mes, s.mes);
END;
$$;
```

#### Option 3: Remove Views, Query Tables Directly

The codebase already does this for `useCategoryData()` when date filters are applied. Consider removing views entirely and querying `entradas` and `saidas` tables directly with proper RLS filtering.

### 🔴 HIGH PRIORITY: Fix `whatsapp_conversas` Table

#### If Table is Needed:
1. Add `user_id` column (UUID, FK to `usuarios.id`)
2. Enable RLS
3. Create RLS policies
4. Migrate existing data to link to users (if applicable)

#### If Table is Not Needed:
1. **Delete the table** to remove security risk
2. Or at minimum, enable RLS and create a restrictive policy (e.g., deny all access)

---

## Migration Plan

### Step 1: Fix Views and `whatsapp_conversas` Table (Create Migration) ✅

Created `supabase/migrations/007_fix_views_rls.sql`:

1. ✅ Drop existing views
2. ✅ Recreate views with `user_id` filtering using `get_user_id_from_auth()`
3. ✅ Add `user_id` column to `whatsapp_conversas` table
4. ✅ Enable RLS on `whatsapp_conversas`
5. ✅ Create RLS policies for `whatsapp_conversas`
6. ⚠️ **Action Required**: Populate `user_id` for existing `whatsapp_conversas` records

### Step 2: Populate Existing `whatsapp_conversas` Data ⚠️

**Action Required**: After running the migration, populate `user_id` for existing records.

The migration adds the `user_id` column but leaves it NULL for existing 1,344 rows. You need to:

1. Determine how to match existing conversations to users (e.g., via `session_id`, `message` JSON data, or other logic)
2. Run an UPDATE query to populate `user_id`:

```sql
-- Example (customize based on your business logic):
UPDATE whatsapp_conversas
SET user_id = (
  SELECT id FROM usuarios 
  WHERE -- your matching logic here
)
WHERE user_id IS NULL;
```

3. After populating, optionally make `user_id` NOT NULL:

```sql
ALTER TABLE whatsapp_conversas ALTER COLUMN user_id SET NOT NULL;
```

### Step 3: Update Application Code

- Verify that views work correctly with RLS
- Test that users only see their own data
- Consider removing view usage in favor of direct table queries (better RLS support)

---

## Testing Checklist

After implementing fixes:

- [ ] User A can only see their own monthly income/expense data
- [ ] User B can only see their own monthly income/expense data
- [ ] User A cannot see User B's category expense totals
- [ ] User A cannot see User B's daily balance
- [ ] Views return empty results for unauthenticated users
- [ ] `whatsapp_conversas` has RLS enabled and policies created
- [ ] Existing `whatsapp_conversas` records have `user_id` populated
- [ ] Users can only access their own WhatsApp conversations

---

## Current Risk Level

🔴 **CRITICAL**: All views and the `whatsapp_conversas` table expose data across users. This violates data privacy and security best practices. Immediate action required.
