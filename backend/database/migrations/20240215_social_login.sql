-- Migration to support Social Login
ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_uid VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50);

-- Make password_hash nullable for social-only users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
