-- Create a table for external content from various sources
CREATE TABLE IF NOT EXISTS external_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  link TEXT,
  published_at TIMESTAMPTZ,
  author TEXT,
  thumbnail_url TEXT,
  categories TEXT[] DEFAULT '{}',
  ai_categories TEXT[] DEFAULT '{}',
  ai_summary TEXT,
  metadata JSONB DEFAULT '{}',
  saved BOOLEAN DEFAULT false,
  read BOOLEAN DEFAULT false,
  transformed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_type, source_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS external_content_user_id_idx ON external_content(user_id);
CREATE INDEX IF NOT EXISTS external_content_source_type_idx ON external_content(source_type);
CREATE INDEX IF NOT EXISTS external_content_published_at_idx ON external_content(published_at);
CREATE INDEX IF NOT EXISTS external_content_saved_idx ON external_content(saved);
CREATE INDEX IF NOT EXISTS external_content_transformed_idx ON external_content(transformed);

-- Add this table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE external_content;

-- Create RLS policies
ALTER TABLE external_content ENABLE ROW LEVEL SECURITY;

-- Policy for users to select their own content
DROP POLICY IF EXISTS "Users can view their own external content" ON external_content;
CREATE POLICY "Users can view their own external content"
  ON external_content FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own content
DROP POLICY IF EXISTS "Users can insert their own external content" ON external_content;
CREATE POLICY "Users can insert their own external content"
  ON external_content FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own content
DROP POLICY IF EXISTS "Users can update their own external content" ON external_content;
CREATE POLICY "Users can update their own external content"
  ON external_content FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy for users to delete their own content
DROP POLICY IF EXISTS "Users can delete their own external content" ON external_content;
CREATE POLICY "Users can delete their own external content"
  ON external_content FOR DELETE
  USING (auth.uid() = user_id);
