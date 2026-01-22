-- Migration: Migrate existing Clerk users to Supabase Auth
-- This script helps migrate existing users from Clerk to Supabase Auth
-- 
-- IMPORTANT: This is a MANUAL migration script. You need to:
-- 1. For each user in your usuarios table with a clerk_id:
--    - Create a Supabase Auth user (via signup or admin API)
--    - Update the auth_user_id in usuarios table
--    - Update all related tables to use the correct user_id
--
-- 2. This script provides helper functions and examples, but actual user creation
--    must be done through Supabase Auth (signup flow or admin API)

-- Helper function to sync user_id in meta_checkins from metas table
-- This ensures meta_checkins.user_id matches the parent meta's user_id
CREATE OR REPLACE FUNCTION sync_meta_checkins_user_id()
RETURNS void AS $$
BEGIN
  UPDATE meta_checkins mc
  SET user_id = m.user_id
  FROM metas m
  WHERE mc.meta_id = m.id 
    AND (mc.user_id IS NULL OR mc.user_id != m.user_id);
END;
$$ LANGUAGE plpgsql;

-- Run the sync function
SELECT sync_meta_checkins_user_id();

-- ============================================
-- DATA MIGRATION SCRIPTS
-- ============================================
-- Run these AFTER users have signed up/signed in with Supabase Auth
-- and have auth_user_id set in the usuarios table
--
-- These scripts will populate user_id in all tables based on existing clerk_id relationships

-- Migrate metas table: Link user_id from usuarios based on clerk_id
-- (Only for records that have clerk_id but no user_id)
UPDATE metas m
SET user_id = u.id
FROM usuarios u
WHERE m.clerk_id = u.clerk_id
  AND m.user_id IS NULL
  AND u.auth_user_id IS NOT NULL;

-- Migrate meta_checkins: Get user_id from parent metas
UPDATE meta_checkins mc
SET user_id = m.user_id
FROM metas m
WHERE mc.meta_id = m.id
  AND mc.user_id IS NULL
  AND m.user_id IS NOT NULL;

-- Migrate lancamentos_futuros: Link user_id from usuarios based on clerk_id
UPDATE lancamentos_futuros lf
SET user_id = u.id
FROM usuarios u
WHERE lf.clerk_id = u.clerk_id
  AND lf.user_id IS NULL
  AND u.auth_user_id IS NOT NULL;

-- Migrate categorias: Link user_id from usuarios based on related metas
-- (Categories are linked through metas that use them)
UPDATE categorias c
SET user_id = m.user_id
FROM metas m
WHERE m.categoria_id = c.id
  AND c.user_id IS NULL
  AND m.user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM categorias c2 
    WHERE c2.id = c.id 
    AND c2.user_id IS NOT NULL
  );

-- Migrate saidas (expenses): Link user_id from usuarios based on related categorias
UPDATE saidas s
SET user_id = c.user_id
FROM categorias c
WHERE s.categoria_id = c.id
  AND s.user_id IS NULL
  AND c.user_id IS NOT NULL;

-- Migrate entradas (incomes): Link user_id from usuarios based on related categorias
UPDATE entradas e
SET user_id = c.user_id
FROM categorias c
WHERE e.categoria_id = c.id
  AND e.user_id IS NULL
  AND c.user_id IS NOT NULL;

-- Migrate cartoes (cards): Link user_id from usuarios based on related metas
UPDATE cartoes ca
SET user_id = m.user_id
FROM metas m
WHERE m.cartao_id = ca.id
  AND ca.user_id IS NULL
  AND m.user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM cartoes ca2 
    WHERE ca2.id = ca.id 
    AND ca2.user_id IS NOT NULL
  );

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to check if migration was successful

-- Check usuarios with auth_user_id but no user_id in related tables
-- SELECT 
--   u.id as usuario_id,
--   u.clerk_id,
--   u.auth_user_id,
--   COUNT(DISTINCT m.id) as metas_count,
--   COUNT(DISTINCT lf.id) as lancamentos_count
-- FROM usuarios u
-- LEFT JOIN metas m ON m.user_id = u.id
-- LEFT JOIN lancamentos_futuros lf ON lf.user_id = u.id
-- WHERE u.auth_user_id IS NOT NULL
-- GROUP BY u.id, u.clerk_id, u.auth_user_id;

-- Check for NULL user_id values (should be minimal after migration)
-- SELECT 
--   'metas' as table_name,
--   COUNT(*) as null_user_id_count
-- FROM metas WHERE user_id IS NULL
-- UNION ALL
-- SELECT 
--   'meta_checkins',
--   COUNT(*)
-- FROM meta_checkins WHERE user_id IS NULL
-- UNION ALL
-- SELECT 
--   'lancamentos_futuros',
--   COUNT(*)
-- FROM lancamentos_futuros WHERE user_id IS NULL;

-- ============================================
-- CLEANUP (Optional - Run after verifying migration)
-- ============================================
-- After verifying that all data is migrated correctly, you can optionally:
-- 1. Remove clerk_id columns (in a future migration)
-- 2. Drop the sync function if no longer needed:
--    DROP FUNCTION IF EXISTS sync_meta_checkins_user_id();
