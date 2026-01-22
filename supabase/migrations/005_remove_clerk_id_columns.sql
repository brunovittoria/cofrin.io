-- Migration: Remove clerk_id columns from all tables
-- This migration removes the old Clerk authentication columns since we've migrated to Supabase Auth
-- 
-- IMPORTANT: Only run this after verifying that:
-- 1. All users have auth_user_id set in usuarios table
-- 2. All data has user_id populated
-- 3. The application is working correctly with Supabase Auth
-- 4. You've confirmed no code references clerk_id anymore

-- Drop indexes on clerk_id columns (if they exist)
DROP INDEX IF EXISTS idx_metas_clerk_id;
DROP INDEX IF EXISTS idx_meta_checkins_clerk_id;

-- Remove clerk_id from usuarios table
ALTER TABLE usuarios 
DROP COLUMN IF EXISTS clerk_id;

-- Remove clerk_id from metas table
ALTER TABLE metas 
DROP COLUMN IF EXISTS clerk_id;

-- Remove clerk_id from meta_checkins table
ALTER TABLE meta_checkins 
DROP COLUMN IF EXISTS clerk_id;

-- Remove clerk_id from lancamentos_futuros table
ALTER TABLE lancamentos_futuros 
DROP COLUMN IF EXISTS clerk_id;

-- Verification query (run this after migration to confirm):
-- SELECT table_name FROM information_schema.columns 
-- WHERE column_name = 'clerk_id' AND table_schema = 'public';
-- Should return no rows
