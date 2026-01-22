-- Migration: Create RLS policies for all tables using auth.uid()

-- Helper function to get user_id from auth.uid()
-- This function returns the usuarios.id for the current authenticated user
CREATE OR REPLACE FUNCTION get_user_id_from_auth()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM usuarios WHERE auth_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- POLICIES FOR usuarios TABLE
-- ============================================

-- Users can view their own record
CREATE POLICY "Users can view own profile"
  ON usuarios FOR SELECT
  USING (auth_user_id = auth.uid());

-- Users can insert their own record (during registration)
CREATE POLICY "Users can insert own profile"
  ON usuarios FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());

-- Users can update their own record
CREATE POLICY "Users can update own profile"
  ON usuarios FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Users cannot delete their own record (handled by CASCADE from auth.users)
-- No DELETE policy needed

-- ============================================
-- POLICIES FOR categorias TABLE
-- ============================================

CREATE POLICY "Users can view own categories"
  ON categorias FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own categories"
  ON categorias FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own categories"
  ON categorias FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own categories"
  ON categorias FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- ============================================
-- POLICIES FOR saidas (expenses) TABLE
-- ============================================

CREATE POLICY "Users can view own expenses"
  ON saidas FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own expenses"
  ON saidas FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own expenses"
  ON saidas FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own expenses"
  ON saidas FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- ============================================
-- POLICIES FOR entradas (incomes) TABLE
-- ============================================

CREATE POLICY "Users can view own incomes"
  ON entradas FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own incomes"
  ON entradas FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own incomes"
  ON entradas FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own incomes"
  ON entradas FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- ============================================
-- POLICIES FOR cartoes (cards) TABLE
-- ============================================

CREATE POLICY "Users can view own cards"
  ON cartoes FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own cards"
  ON cartoes FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own cards"
  ON cartoes FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own cards"
  ON cartoes FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- ============================================
-- POLICIES FOR metas (goals) TABLE
-- ============================================

CREATE POLICY "Users can view own goals"
  ON metas FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own goals"
  ON metas FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own goals"
  ON metas FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own goals"
  ON metas FOR DELETE
  USING (user_id = get_user_id_from_auth());

-- ============================================
-- POLICIES FOR meta_checkins TABLE
-- ============================================

-- Users can view check-ins for their own goals
CREATE POLICY "Users can view own check-ins"
  ON meta_checkins FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM metas 
      WHERE metas.id = meta_checkins.meta_id 
      AND metas.user_id = get_user_id_from_auth()
    )
  );

-- Users can insert check-ins for their own goals
CREATE POLICY "Users can insert own check-ins"
  ON meta_checkins FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM metas 
      WHERE metas.id = meta_checkins.meta_id 
      AND metas.user_id = get_user_id_from_auth()
    )
    AND user_id = get_user_id_from_auth()
  );

-- Users can update check-ins for their own goals
CREATE POLICY "Users can update own check-ins"
  ON meta_checkins FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM metas 
      WHERE metas.id = meta_checkins.meta_id 
      AND metas.user_id = get_user_id_from_auth()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM metas 
      WHERE metas.id = meta_checkins.meta_id 
      AND metas.user_id = get_user_id_from_auth()
    )
    AND user_id = get_user_id_from_auth()
  );

-- Users can delete check-ins for their own goals
CREATE POLICY "Users can delete own check-ins"
  ON meta_checkins FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM metas 
      WHERE metas.id = meta_checkins.meta_id 
      AND metas.user_id = get_user_id_from_auth()
    )
  );

-- ============================================
-- POLICIES FOR lancamentos_futuros TABLE
-- ============================================

CREATE POLICY "Users can view own future launches"
  ON lancamentos_futuros FOR SELECT
  USING (user_id = get_user_id_from_auth());

CREATE POLICY "Users can insert own future launches"
  ON lancamentos_futuros FOR INSERT
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can update own future launches"
  ON lancamentos_futuros FOR UPDATE
  USING (user_id = get_user_id_from_auth())
  WITH CHECK (user_id = get_user_id_from_auth());

CREATE POLICY "Users can delete own future launches"
  ON lancamentos_futuros FOR DELETE
  USING (user_id = get_user_id_from_auth());
