-- Migration: Rename Tables and Columns from Portuguese to English
-- 
-- This migration renames all database tables, columns, and views from Portuguese to English.
-- IMPORTANT: This must be run in a transaction or during a maintenance window.
--
-- Execution order:
-- 1. Drop views (they depend on tables)
-- 2. Drop RLS policies (they depend on tables)
-- 3. Rename tables (foreign keys will auto-update)
-- 4. Rename columns (indexes will auto-update)
-- 5. Update helper functions
-- 6. Recreate views with new names
-- 7. Recreate RLS policies with new names

BEGIN;

-- ============================================
-- STEP 1: DROP VIEWS
-- ============================================

DROP VIEW IF EXISTS vw_entradas_saidas_mensal;
DROP VIEW IF EXISTS vw_saidas_por_categoria;
DROP VIEW IF EXISTS vw_saldo_diario;

-- ============================================
-- STEP 2: DROP RLS POLICIES
-- ============================================

-- Drop policies for usuarios
DROP POLICY IF EXISTS "Users can view own profile" ON usuarios;
DROP POLICY IF EXISTS "Users can insert own profile" ON usuarios;
DROP POLICY IF EXISTS "Users can update own profile" ON usuarios;

-- Drop policies for categorias
DROP POLICY IF EXISTS "Users can view own categories" ON categorias;
DROP POLICY IF EXISTS "Users can insert own categories" ON categorias;
DROP POLICY IF EXISTS "Users can update own categories" ON categorias;
DROP POLICY IF EXISTS "Users can delete own categories" ON categorias;

-- Drop policies for saidas
DROP POLICY IF EXISTS "Users can view own expenses" ON saidas;
DROP POLICY IF EXISTS "Users can insert own expenses" ON saidas;
DROP POLICY IF EXISTS "Users can update own expenses" ON saidas;
DROP POLICY IF EXISTS "Users can delete own expenses" ON saidas;

-- Drop policies for entradas
DROP POLICY IF EXISTS "Users can view own incomes" ON entradas;
DROP POLICY IF EXISTS "Users can insert own incomes" ON entradas;
DROP POLICY IF EXISTS "Users can update own incomes" ON entradas;
DROP POLICY IF EXISTS "Users can delete own incomes" ON entradas;

-- Drop policies for cartoes
DROP POLICY IF EXISTS "Users can view own cards" ON cartoes;
DROP POLICY IF EXISTS "Users can insert own cards" ON cartoes;
DROP POLICY IF EXISTS "Users can update own cards" ON cartoes;
DROP POLICY IF EXISTS "Users can delete own cards" ON cartoes;

-- Drop policies for metas
DROP POLICY IF EXISTS "Users can view own goals" ON metas;
DROP POLICY IF EXISTS "Users can insert own goals" ON metas;
DROP POLICY IF EXISTS "Users can update own goals" ON metas;
DROP POLICY IF EXISTS "Users can delete own goals" ON metas;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON metas;

-- Drop policies for meta_checkins
DROP POLICY IF EXISTS "Users can view own check-ins" ON meta_checkins;
DROP POLICY IF EXISTS "Users can insert own check-ins" ON meta_checkins;
DROP POLICY IF EXISTS "Users can update own check-ins" ON meta_checkins;
DROP POLICY IF EXISTS "Users can delete own check-ins" ON meta_checkins;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON meta_checkins;

-- Drop policies for lancamentos_futuros
DROP POLICY IF EXISTS "Users can view own future launches" ON lancamentos_futuros;
DROP POLICY IF EXISTS "Users can insert own future launches" ON lancamentos_futuros;
DROP POLICY IF EXISTS "Users can update own future launches" ON lancamentos_futuros;
DROP POLICY IF EXISTS "Users can delete own future launches" ON lancamentos_futuros;
DROP POLICY IF EXISTS "Allow public read access" ON lancamentos_futuros;
DROP POLICY IF EXISTS "Allow public write access" ON lancamentos_futuros;

-- Drop policies for whatsapp_conversas
DROP POLICY IF EXISTS "Users can view own whatsapp conversations" ON whatsapp_conversas;
DROP POLICY IF EXISTS "Users can insert own whatsapp conversations" ON whatsapp_conversas;
DROP POLICY IF EXISTS "Users can update own whatsapp conversations" ON whatsapp_conversas;
DROP POLICY IF EXISTS "Users can delete own whatsapp conversations" ON whatsapp_conversas;

-- ============================================
-- STEP 3: RENAME TABLES
-- ============================================

ALTER TABLE usuarios RENAME TO users;
ALTER TABLE categorias RENAME TO categories;
ALTER TABLE saidas RENAME TO expenses;
ALTER TABLE entradas RENAME TO incomes;
ALTER TABLE cartoes RENAME TO cards;
ALTER TABLE metas RENAME TO goals;
ALTER TABLE meta_checkins RENAME TO goal_checkins;
ALTER TABLE lancamentos_futuros RENAME TO future_transactions;
ALTER TABLE whatsapp_conversas RENAME TO whatsapp_conversations;

-- ============================================
-- STEP 4: RENAME COLUMNS
-- ============================================

-- users table (usuarios)
ALTER TABLE users RENAME COLUMN nome TO name;

-- categories table (categorias)
ALTER TABLE categories RENAME COLUMN nome TO name;
ALTER TABLE categories RENAME COLUMN tipo TO type;
ALTER TABLE categories RENAME COLUMN descricao TO description;
ALTER TABLE categories RENAME COLUMN cor_hex TO hex_color;

-- expenses table (saidas)
ALTER TABLE expenses RENAME COLUMN data TO date;
ALTER TABLE expenses RENAME COLUMN valor TO amount;
ALTER TABLE expenses RENAME COLUMN descricao TO description;
ALTER TABLE expenses RENAME COLUMN categoria_id TO category_id;

-- incomes table (entradas)
ALTER TABLE incomes RENAME COLUMN data TO date;
ALTER TABLE incomes RENAME COLUMN valor TO amount;
ALTER TABLE incomes RENAME COLUMN descricao TO description;
ALTER TABLE incomes RENAME COLUMN categoria_id TO category_id;

-- cards table (cartoes)
ALTER TABLE cards RENAME COLUMN nome_exibicao TO display_name;
ALTER TABLE cards RENAME COLUMN apelido TO nickname;
ALTER TABLE cards RENAME COLUMN bandeira TO flag;
ALTER TABLE cards RENAME COLUMN final_cartao TO card_last_four;
ALTER TABLE cards RENAME COLUMN limite_total TO total_limit;
ALTER TABLE cards RENAME COLUMN valor_utilizado TO used_amount;
ALTER TABLE cards RENAME COLUMN valor_disponivel TO available_amount;
ALTER TABLE cards RENAME COLUMN uso_percentual TO usage_percentage;
ALTER TABLE cards RENAME COLUMN criado_em TO created_at;
ALTER TABLE cards RENAME COLUMN emissor TO issuer;
ALTER TABLE cards RENAME COLUMN is_principal TO is_primary;

-- goals table (metas)
ALTER TABLE goals RENAME COLUMN titulo TO title;
ALTER TABLE goals RENAME COLUMN tipo TO type;
ALTER TABLE goals RENAME COLUMN descricao TO description;
ALTER TABLE goals RENAME COLUMN valor_alvo TO target_amount;
ALTER TABLE goals RENAME COLUMN valor_atual TO current_amount;
ALTER TABLE goals RENAME COLUMN prazo TO deadline;
ALTER TABLE goals RENAME COLUMN categoria_id TO category_id;
ALTER TABLE goals RENAME COLUMN cartao_id TO card_id;
ALTER TABLE goals RENAME COLUMN reflexao_porque TO reflection_why;
ALTER TABLE goals RENAME COLUMN reflexao_mudanca TO reflection_change;
ALTER TABLE goals RENAME COLUMN reflexao_sentimento TO reflection_feeling;

-- goal_checkins table (meta_checkins)
ALTER TABLE goal_checkins RENAME COLUMN meta_id TO goal_id;
ALTER TABLE goal_checkins RENAME COLUMN data TO date;
ALTER TABLE goal_checkins RENAME COLUMN humor TO mood;
ALTER TABLE goal_checkins RENAME COLUMN obstaculos TO obstacles;
ALTER TABLE goal_checkins RENAME COLUMN valor_adicionado TO added_value;
ALTER TABLE goal_checkins RENAME COLUMN nota TO note;

-- future_transactions table (lancamentos_futuros)
ALTER TABLE future_transactions RENAME COLUMN data TO date;
ALTER TABLE future_transactions RENAME COLUMN tipo TO type;
ALTER TABLE future_transactions RENAME COLUMN descricao TO description;
ALTER TABLE future_transactions RENAME COLUMN valor TO amount;
ALTER TABLE future_transactions RENAME COLUMN categoria_id TO category_id;

-- ============================================
-- STEP 5: UPDATE HELPER FUNCTIONS
-- ============================================

-- Update get_user_id_from_auth() to reference users table
CREATE OR REPLACE FUNCTION get_user_id_from_auth()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM users WHERE auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Update sync_meta_checkins_user_id() to reference new table names
-- Drop function first to allow changing return type if needed
DROP FUNCTION IF EXISTS sync_meta_checkins_user_id() CASCADE;

CREATE FUNCTION sync_meta_checkins_user_id()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE goal_checkins gc
  SET user_id = g.user_id
  FROM goals g
  WHERE gc.goal_id = g.id 
    AND (gc.user_id IS NULL OR gc.user_id != g.user_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Update update_metas_updated_at() to reference goals table
CREATE OR REPLACE FUNCTION update_metas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update update_lancamentos_futuros_updated_at() to reference future_transactions table
CREATE OR REPLACE FUNCTION update_lancamentos_futuros_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- STEP 6: RECREATE VIEWS WITH NEW NAMES
-- ============================================

-- View: vw_monthly_income_expense (formerly vw_entradas_saidas_mensal)
CREATE OR REPLACE VIEW vw_monthly_income_expense AS
WITH e AS (
  SELECT 
    date_trunc('month', incomes.date::timestamp with time zone) AS month,
    sum(incomes.amount) AS total_incomes
  FROM incomes
  WHERE incomes.user_id = get_user_id_from_auth()
  GROUP BY date_trunc('month', incomes.date::timestamp with time zone)
), s AS (
  SELECT 
    date_trunc('month', expenses.date::timestamp with time zone) AS month,
    sum(expenses.amount) AS total_expenses
  FROM expenses
  WHERE expenses.user_id = get_user_id_from_auth()
  GROUP BY date_trunc('month', expenses.date::timestamp with time zone)
)
SELECT 
  COALESCE(e.month, s.month) AS month,
  COALESCE(e.total_incomes, 0::numeric) AS total_incomes,
  COALESCE(s.total_expenses, 0::numeric) AS total_expenses
FROM e
FULL JOIN s ON e.month = s.month
ORDER BY COALESCE(e.month, s.month);

-- View: vw_expenses_by_category (formerly vw_saidas_por_categoria)
CREATE OR REPLACE VIEW vw_expenses_by_category AS
SELECT 
  c.id AS category_id,
  COALESCE(c.name, 'Sem categoria'::text) AS category,
  sum(s.amount) AS total_expenses
FROM expenses s
LEFT JOIN categories c ON c.id = s.category_id
WHERE s.user_id = get_user_id_from_auth()
GROUP BY c.id, c.name
ORDER BY sum(s.amount) DESC;

-- View: vw_daily_balance (formerly vw_saldo_diario)
CREATE OR REPLACE VIEW vw_daily_balance AS
WITH user_incomes AS (
  SELECT min(incomes.date) AS min_date, max(incomes.date) AS max_date
  FROM incomes
  WHERE incomes.user_id = get_user_id_from_auth()
), user_expenses AS (
  SELECT min(expenses.date) AS min_date, max(expenses.date) AS max_date
  FROM expenses
  WHERE expenses.user_id = get_user_id_from_auth()
), days AS (
  SELECT generate_series(
    LEAST(
      COALESCE((SELECT min_date FROM user_incomes), CURRENT_DATE),
      COALESCE((SELECT min_date FROM user_expenses), CURRENT_DATE)
    )::timestamp with time zone,
    GREATEST(
      COALESCE((SELECT max_date FROM user_incomes), CURRENT_DATE),
      COALESCE((SELECT max_date FROM user_expenses), CURRENT_DATE)
    )::timestamp with time zone,
    '1 day'::interval
  )::date AS day
), e AS (
  SELECT 
    incomes.date AS day,
    sum(incomes.amount) AS incomes_day
  FROM incomes
  WHERE incomes.user_id = get_user_id_from_auth()
  GROUP BY incomes.date
), s AS (
  SELECT 
    expenses.date AS day,
    sum(expenses.amount) AS expenses_day
  FROM expenses
  WHERE expenses.user_id = get_user_id_from_auth()
  GROUP BY expenses.date
), base AS (
  SELECT 
    d.day,
    COALESCE(e.incomes_day, 0::numeric) AS incomes_day,
    COALESCE(s.expenses_day, 0::numeric) AS expenses_day,
    (COALESCE(e.incomes_day, 0::numeric) - COALESCE(s.expenses_day, 0::numeric)) AS balance_day
  FROM days d
  LEFT JOIN e ON e.day = d.day
  LEFT JOIN s ON s.day = d.day
)
SELECT 
  day,
  incomes_day,
  expenses_day,
  sum(balance_day) OVER (ORDER BY day) AS accumulated_balance
FROM base
ORDER BY day;

-- ============================================
-- STEP 7: RECREATE RLS POLICIES WITH NEW NAMES
-- ============================================

-- Policies for users table (usuarios)
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Policies for categories table (categorias)
CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- Policies for expenses table (saidas)
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- Policies for incomes table (entradas)
CREATE POLICY "Users can view own incomes"
  ON incomes FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own incomes"
  ON incomes FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own incomes"
  ON incomes FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own incomes"
  ON incomes FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- Policies for cards table (cartoes)
CREATE POLICY "Users can view own cards"
  ON cards FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own cards"
  ON cards FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own cards"
  ON cards FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own cards"
  ON cards FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- Policies for goals table (metas)
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own goals"
  ON goals FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- Policies for goal_checkins table (meta_checkins)
CREATE POLICY "Users can view own check-ins"
  ON goal_checkins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM goals 
      WHERE goals.id = goal_checkins.goal_id 
      AND goals.user_id = get_user_id_from_auth()
    )
  );

CREATE POLICY "Users can insert own check-ins"
  ON goal_checkins FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM goals 
      WHERE goals.id = goal_checkins.goal_id 
      AND goals.user_id = get_user_id_from_auth()
    )
    AND user_id = get_user_id_from_auth()
  );

CREATE POLICY "Users can update own check-ins"
  ON goal_checkins FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM goals 
      WHERE goals.id = goal_checkins.goal_id 
      AND goals.user_id = get_user_id_from_auth()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM goals 
      WHERE goals.id = goal_checkins.goal_id 
      AND goals.user_id = get_user_id_from_auth()
    )
    AND user_id = get_user_id_from_auth()
  );

CREATE POLICY "Users can delete own check-ins"
  ON goal_checkins FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM goals 
      WHERE goals.id = goal_checkins.goal_id 
      AND goals.user_id = get_user_id_from_auth()
    )
  );

-- Policies for future_transactions table (lancamentos_futuros)
CREATE POLICY "Users can view own future launches"
  ON future_transactions FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own future launches"
  ON future_transactions FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own future launches"
  ON future_transactions FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own future launches"
  ON future_transactions FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- Policies for whatsapp_conversations table (whatsapp_conversas)
CREATE POLICY "Users can view own whatsapp conversations"
  ON whatsapp_conversations FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own whatsapp conversations"
  ON whatsapp_conversations FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own whatsapp conversations"
  ON whatsapp_conversations FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own whatsapp conversations"
  ON whatsapp_conversations FOR DELETE
  USING (user_id = get_user_id_from_auth());

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- After running this migration, verify:
-- 
-- 1. Tables renamed:
--    SELECT table_name FROM information_schema.tables 
--    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
--    ORDER BY table_name;
--
-- 2. Views renamed:
--    SELECT viewname FROM pg_views WHERE schemaname = 'public';
--
-- 3. RLS policies exist:
--    SELECT tablename, policyname FROM pg_policies 
--    WHERE schemaname = 'public' ORDER BY tablename, policyname;
--
-- 4. Function updated:
--    SELECT routine_definition FROM information_schema.routines 
--    WHERE routine_name = 'get_user_id_from_auth';
--
-- 5. Test queries (run as authenticated user):
--    SELECT * FROM vw_monthly_income_expense LIMIT 5;
--    SELECT * FROM vw_expenses_by_category LIMIT 5;
--    SELECT * FROM vw_daily_balance LIMIT 5;
