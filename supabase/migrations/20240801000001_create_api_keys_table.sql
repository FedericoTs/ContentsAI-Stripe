-- Create API keys table for storing service credentials
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  api_key TEXT NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, service)
);

-- Enable row-level security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only view their own API keys
DROP POLICY IF EXISTS "Users can view their own API keys" ON api_keys;
CREATE POLICY "Users can view their own API keys"
  ON api_keys FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own API keys
DROP POLICY IF EXISTS "Users can insert their own API keys" ON api_keys;
CREATE POLICY "Users can insert their own API keys"
  ON api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own API keys
DROP POLICY IF EXISTS "Users can update their own API keys" ON api_keys;
CREATE POLICY "Users can update their own API keys"
  ON api_keys FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own API keys
DROP POLICY IF EXISTS "Users can delete their own API keys" ON api_keys;
CREATE POLICY "Users can delete their own API keys"
  ON api_keys FOR DELETE
  USING (auth.uid() = user_id);
