# Supabase Migrations - Execution Order

## ⚠️ IMPORTANT: Run migrations in this exact order!

### Migration Execution Order

Run these migrations **one at a time** in the Supabase SQL Editor, in this exact order:

---

### 1️⃣ First: Schema Migration
**File:** `001_migrate_to_supabase_auth.sql`

**What it does:**
- Adds `auth_user_id` column to `usuarios` table
- Ensures all tables have `user_id` (UUID) columns
- Creates foreign key constraints
- Creates indexes for performance

**Status:** ✅ Run this first

---

### 2️⃣ Second: Enable Row Level Security
**File:** `002_enable_rls.sql`

**What it does:**
- Enables RLS on all user-facing tables

**⚠️ WARNING:** After running this, all tables will be locked down until policies are created!

**Status:** ✅ Run this second (immediately before step 3)

---

### 3️⃣ Third: Create RLS Policies
**File:** `003_create_rls_policies.sql`

**What it does:**
- Creates SELECT, INSERT, UPDATE, DELETE policies for all tables
- Uses `auth.uid()` to identify the current authenticated user
- Ensures users can only access their own data

**Status:** ✅ Run this third (immediately after step 2)

---

### 4️⃣ Fourth: Data Migration (Optional - Only if you have existing Clerk users)
**File:** `004_migrate_existing_users.sql`

**What it does:**
- Provides helper functions for data migration
- Migrates existing data from `clerk_id` to `user_id`
- Syncs `user_id` values across related tables

**⚠️ IMPORTANT:** 
- Only run this if you have existing users/data from Clerk
- Users must first sign up/sign in with Supabase Auth to get `auth_user_id` set
- The script will populate `user_id` in all tables based on existing `clerk_id` relationships

**Status:** ⚠️ Run this fourth (only if needed)

---

### 5️⃣ Fifth: Remove Clerk ID Columns (Cleanup)
**File:** `005_remove_clerk_id_columns.sql`

**What it does:**
- Removes `clerk_id` columns from all tables
- Drops indexes on `clerk_id` columns
- Cleans up old Clerk authentication references

**⚠️ IMPORTANT:** 
- Only run this AFTER:
  - All users have `auth_user_id` set in `usuarios` table
  - All data has `user_id` populated
  - The application is working correctly with Supabase Auth
  - You've verified no code references `clerk_id` anymore

**Status:** ⚠️ Run this fifth (cleanup step - optional but recommended)

---

## 📋 How to Run Migrations

### Using Supabase Dashboard SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. For each migration file in order:
   - Open the file from your project
   - Copy **ALL** SQL content
   - Paste into SQL Editor
   - Click **Run** or press `Cmd/Ctrl + Enter`
   - ✅ Wait for "Success" confirmation
   - ⚠️ **DO NOT** proceed to next migration until current one succeeds
   - Move to next migration file

### Quick Checklist

- [ ] Run `001_migrate_to_supabase_auth.sql` → Wait for success
- [ ] Run `002_enable_rls.sql` → Wait for success  
- [ ] Run `003_create_rls_policies.sql` → Wait for success
- [ ] (Optional) Run `004_migrate_existing_users.sql` → Wait for success
- [ ] (Optional) Run `005_remove_clerk_id_columns.sql` → Wait for success

---

## ✅ Verification After Migrations

After running all migrations, verify:

1. **Check columns exist:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'usuarios' AND column_name = 'auth_user_id';
   ```

2. **Check RLS is enabled:**
   - Go to Table Editor → Select any table → Check "RLS" tab shows "Enabled"

3. **Check policies exist:**
   - Go to Table Editor → Select any table → Check "Policies" tab shows policies

4. **Verify clerk_id is removed:**
   ```sql
   SELECT table_name FROM information_schema.columns 
   WHERE column_name = 'clerk_id' AND table_schema = 'public';
   -- Should return no rows
   ```

5. **Test authentication:**
   - Sign up a new user
   - Verify they can only see their own data
   - Verify unauthenticated requests are blocked

---

## 🚨 Troubleshooting

### Error: "column already exists"
- ✅ Safe to ignore - migration uses `IF NOT EXISTS`
- Migration will skip existing columns

### Error: "relation does not exist"
- ❌ Check you're on the correct database
- ❌ Verify tables exist before running migrations

### RLS blocking all queries
- ✅ Make sure you ran step 3 (`003_create_rls_policies.sql`)
- ✅ Check policies are created in Table Editor
- ✅ Verify you're authenticated when testing

### Existing data has NULL user_id
- ✅ This is expected for existing records
- ✅ Run step 4 (`004_migrate_existing_users.sql`) to populate
- ✅ Or wait for users to sign in (new records will have user_id automatically)

### Error when removing clerk_id: "column is referenced"
- ❌ Check if there are any foreign key constraints referencing clerk_id
- ❌ Check if there are any views or functions using clerk_id
- ✅ The migration uses `IF EXISTS` so it's safe to run multiple times

---

## 🔄 Rollback (If Needed)

If you need to temporarily disable RLS:

```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

To drop a policy:

```sql
DROP POLICY "policy_name" ON table_name;
```

**⚠️ Always backup your database before running migrations in production!**
