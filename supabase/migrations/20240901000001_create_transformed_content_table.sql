-- Create transformed_content table to store content transformations
CREATE TABLE IF NOT EXISTS transformed_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_content_id UUID NOT NULL REFERENCES external_content(id) ON DELETE CASCADE,
  transformation_type TEXT NOT NULL,
  result_data JSONB NOT NULL,
  settings JSONB,
  title TEXT,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS transformed_content_original_content_id_idx ON transformed_content(original_content_id);
CREATE INDEX IF NOT EXISTS transformed_content_user_id_idx ON transformed_content(user_id);
CREATE INDEX IF NOT EXISTS transformed_content_transformation_type_idx ON transformed_content(transformation_type);

-- Enable row-level security
ALTER TABLE transformed_content ENABLE ROW LEVEL SECURITY;

-- Create policies for transformed_content table
DROP POLICY IF EXISTS "Users can view their own transformed content" ON transformed_content;
CREATE POLICY "Users can view their own transformed content"
  ON transformed_content FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own transformed content" ON transformed_content;
CREATE POLICY "Users can insert their own transformed content"
  ON transformed_content FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own transformed content" ON transformed_content;
CREATE POLICY "Users can update their own transformed content"
  ON transformed_content FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own transformed content" ON transformed_content;
CREATE POLICY "Users can delete their own transformed content"
  ON transformed_content FOR DELETE
  USING (auth.uid() = user_id);

-- Add transformed column to external_content table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'external_content' AND column_name = 'transformed') THEN
    ALTER TABLE external_content ADD COLUMN transformed BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Enable realtime for transformed_content (only if not already added)
DO $ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'transformed_content'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE transformed_content;
  END IF;
END $;
