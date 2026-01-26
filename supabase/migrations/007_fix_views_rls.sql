-- Migration: Fix Views to Filter by User (RLS Compliance)
-- 
-- This migration recreates the three views to filter data by user_id
-- using the get_user_id_from_auth() function to ensure RLS compliance.
--
-- IMPORTANT: Views cannot use RLS directly, but they can filter by calling
-- functions that use auth.uid() to get the current user's ID.

-- ============================================
-- 1. Fix vw_entradas_saidas_mensal
-- ============================================
-- This view aggregates monthly income and expenses
-- Now filters by user_id to show only current user's data

DROP VIEW IF EXISTS vw_entradas_saidas_mensal;

CREATE OR REPLACE VIEW vw_entradas_saidas_mensal AS
WITH e AS (
  SELECT 
    date_trunc('month', incomes.date::timestamp with time zone) AS mes,
    sum(incomes.amount) AS total_entradas
  FROM incomes
  WHERE incomes.user_id = get_user_id_from_auth()
  GROUP BY date_trunc('month', incomes.date::timestamp with time zone)
), s AS (
  SELECT 
    date_trunc('month', expenses.date::timestamp with time zone) AS mes,
    sum(expenses.amount) AS total_saidas
  FROM expenses
  WHERE expenses.user_id = get_user_id_from_auth()
  GROUP BY date_trunc('month', expenses.date::timestamp with time zone)
)
SELECT 
  COALESCE(e.mes, s.mes) AS mes,
  COALESCE(e.total_entradas, 0::numeric) AS total_entradas,
  COALESCE(s.total_saidas, 0::numeric) AS total_saidas
FROM e
FULL JOIN s ON e.mes = s.mes
ORDER BY COALESCE(e.mes, s.mes);

-- ============================================
-- 2. Fix vw_saidas_por_categoria
-- ============================================
-- This view aggregates expenses by category
-- Now filters by user_id to show only current user's data

DROP VIEW IF EXISTS vw_saidas_por_categoria;

CREATE OR REPLACE VIEW vw_saidas_por_categoria AS
SELECT 
  c.id AS categoria_id,
  COALESCE(c.name, 'Sem categoria'::text) AS categoria,
  sum(s.amount) AS total_saidas
FROM expenses s
LEFT JOIN categories c ON c.id = s.category_id
WHERE s.user_id = get_user_id_from_auth()
GROUP BY c.id, c.name
ORDER BY sum(s.amount) DESC;

-- ============================================
-- 3. Fix vw_saldo_diario
-- ============================================
-- This view calculates daily balance (cumulative)
-- Now filters by user_id to show only current user's data

DROP VIEW IF EXISTS vw_saldo_diario;

CREATE OR REPLACE VIEW vw_saldo_diario AS
WITH user_entradas AS (
  SELECT min(incomes.date) AS min_data, max(incomes.date) AS max_data
  FROM incomes
  WHERE incomes.user_id = get_user_id_from_auth()
), user_saidas AS (
  SELECT min(expenses.date) AS min_data, max(expenses.date) AS max_data
  FROM expenses
  WHERE expenses.user_id = get_user_id_from_auth()
), dias AS (
  SELECT generate_series(
    LEAST(
      COALESCE((SELECT min_data FROM user_entradas), CURRENT_DATE),
      COALESCE((SELECT min_data FROM user_saidas), CURRENT_DATE)
    )::timestamp with time zone,
    GREATEST(
      COALESCE((SELECT max_data FROM user_entradas), CURRENT_DATE),
      COALESCE((SELECT max_data FROM user_saidas), CURRENT_DATE)
    )::timestamp with time zone,
    '1 day'::interval
  )::date AS dia
), e AS (
  SELECT 
    incomes.date AS dia,
    sum(incomes.amount) AS entradas_dia
  FROM incomes
  WHERE incomes.user_id = get_user_id_from_auth()
  GROUP BY incomes.date
), s AS (
  SELECT 
    expenses.date AS dia,
    sum(expenses.amount) AS saidas_dia
  FROM expenses
  WHERE expenses.user_id = get_user_id_from_auth()
  GROUP BY expenses.date
), base AS (
  SELECT 
    d.dia,
    COALESCE(e.entradas_dia, 0::numeric) AS entradas_dia,
    COALESCE(s.saidas_dia, 0::numeric) AS saidas_dia,
    (COALESCE(e.entradas_dia, 0::numeric) - COALESCE(s.saidas_dia, 0::numeric)) AS saldo_dia
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

-- ============================================
-- 4. Fix whatsapp_conversas TABLE
-- ============================================
-- This table stores WhatsApp conversation data
-- Now adds user_id column, enables RLS, and creates policies

-- Step 1: Add user_id column
ALTER TABLE whatsapp_conversations
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Step 2: Create index for performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_user_id 
ON whatsapp_conversations(user_id);

-- Step 3: Enable RLS
ALTER TABLE whatsapp_conversations ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
-- Users can view their own conversations
CREATE POLICY "Users can view own whatsapp conversations"
  ON whatsapp_conversations FOR SELECT
  USING (user_id = get_user_id_from_auth());

-- Users can insert their own conversations
CREATE POLICY "Users can insert own whatsapp conversations"
  ON whatsapp_conversations FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

-- Users can update their own conversations
CREATE POLICY "Users can update own whatsapp conversations"
  ON whatsapp_conversations FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

-- Users can delete their own conversations
CREATE POLICY "Users can delete own whatsapp conversations"
  ON whatsapp_conversations FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- ============================================
-- NOTE: Existing Data Migration
-- ============================================
-- The whatsapp_conversations table has 1,344 existing rows with user_id = NULL.
-- You need to populate user_id for existing records based on your business logic.
-- 
-- Example migration (customize based on your needs):
-- UPDATE whatsapp_conversations
-- SET user_id = (
--   SELECT id FROM users 
--   WHERE -- your logic to match session_id or message data to user
-- )
-- WHERE user_id IS NULL;
--
-- After populating user_id, you may want to make it NOT NULL:
-- ALTER TABLE whatsapp_conversas ALTER COLUMN user_id SET NOT NULL;

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this migration, test that:
-- 1. Views return only the current user's data
-- 2. Different users see different results
-- 3. Unauthenticated users see empty results (or get_user_id_from_auth() returns NULL)
-- 4. whatsapp_conversas table has user_id column and RLS enabled
-- 5. Users can only access their own whatsapp conversations

-- Test queries (run as authenticated user):
-- SELECT * FROM vw_entradas_saidas_mensal LIMIT 5;
-- SELECT * FROM vw_saidas_por_categoria LIMIT 5;
-- SELECT * FROM vw_saldo_diario LIMIT 5;
-- SELECT COUNT(*) FROM whatsapp_conversations; -- Should only show current user's records
