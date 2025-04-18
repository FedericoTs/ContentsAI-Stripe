-- Add plan fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_updated_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_plan_id ON users(plan_id);
