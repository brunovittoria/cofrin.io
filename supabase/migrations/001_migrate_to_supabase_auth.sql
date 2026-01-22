-- Migration: Migrate from Clerk to Supabase Auth
-- This migration adds auth_user_id to usuarios and ensures all tables use user_id (UUID)

-- Step 1: Add auth_user_id column to usuarios table
-- Keep clerk_id temporarily for migration purposes
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_usuarios_auth_user_id ON usuarios(auth_user_id);

-- Step 2: Ensure metas table has user_id (UUID) and update if needed
-- If user_id doesn't exist or is not UUID, we'll need to handle it
DO $$
BEGIN
  -- Check if user_id column exists and is UUID type
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'metas' AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    -- Add user_id if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'metas' AND column_name = 'user_id'
    ) THEN
      ALTER TABLE metas ADD COLUMN user_id UUID;
    ELSE
      -- Convert existing user_id to UUID if it's not already
      ALTER TABLE metas ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
    END IF;
    
    -- Add foreign key constraint
    ALTER TABLE metas 
    ADD CONSTRAINT fk_metas_user 
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE;
    
    -- Create index
    CREATE INDEX IF NOT EXISTS idx_metas_user_id ON metas(user_id);
  END IF;
END $$;

-- Step 3: Update meta_checkins table
-- Remove clerk_id and ensure it uses meta_id which references metas (which has user_id)
-- We can derive user ownership through the metas relationship
DO $$
BEGIN
  -- Add user_id if it doesn't exist (for direct access, though we'll use metas.user_id via RLS)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'meta_checkins' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE meta_checkins ADD COLUMN user_id UUID;
    
    -- Populate user_id from metas table
    UPDATE meta_checkins mc
    SET user_id = m.user_id
    FROM metas m
    WHERE mc.meta_id = m.id AND mc.user_id IS NULL;
    
    -- Add foreign key constraint
    ALTER TABLE meta_checkins 
    ADD CONSTRAINT fk_meta_checkins_user 
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE;
    
    -- Create index
    CREATE INDEX IF NOT EXISTS idx_meta_checkins_user_id ON meta_checkins(user_id);
  END IF;
END $$;

-- Step 4: Update lancamentos_futuros table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lancamentos_futuros' AND column_name = 'user_id' AND data_type = 'uuid'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'lancamentos_futuros' AND column_name = 'user_id'
    ) THEN
      ALTER TABLE lancamentos_futuros ADD COLUMN user_id UUID;
    ELSE
      ALTER TABLE lancamentos_futuros ALTER COLUMN user_id TYPE UUID USING user_id::uuid;
    END IF;
    
    ALTER TABLE lancamentos_futuros 
    ADD CONSTRAINT fk_lancamentos_futuros_user 
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_lancamentos_futuros_user_id ON lancamentos_futuros(user_id);
  END IF;
END $$;

-- Step 5: Add user_id to categorias table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'categorias' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE categorias ADD COLUMN user_id UUID;
    
    ALTER TABLE categorias 
    ADD CONSTRAINT fk_categorias_user 
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_categorias_user_id ON categorias(user_id);
  END IF;
END $$;

-- Step 6: Add user_id to saidas (expenses) table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'saidas' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE saidas ADD COLUMN user_id UUID;
    
    ALTER TABLE saidas 
    ADD CONSTRAINT fk_saidas_user 
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_saidas_user_id ON saidas(user_id);
  END IF;
END $$;

-- Step 7: Add user_id to entradas (incomes) table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'entradas' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE entradas ADD COLUMN user_id UUID;
    
    ALTER TABLE entradas 
    ADD CONSTRAINT fk_entradas_user 
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_entradas_user_id ON entradas(user_id);
  END IF;
END $$;

-- Step 8: Add user_id to cartoes (cards) table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cartoes' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE cartoes ADD COLUMN user_id UUID;
    
    ALTER TABLE cartoes 
    ADD CONSTRAINT fk_cartoes_user 
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_cartoes_user_id ON cartoes(user_id);
  END IF;
END $$;

-- Note: clerk_id columns are kept for now to allow gradual migration
-- They will be removed in a later migration after data migration is complete
