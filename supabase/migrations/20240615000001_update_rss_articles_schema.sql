-- Add a column to track if an article has been transformed
ALTER TABLE rss_articles ADD COLUMN IF NOT EXISTS transformed BOOLEAN DEFAULT false;

-- Add a column to track if full content has been fetched
ALTER TABLE rss_articles ADD COLUMN IF NOT EXISTS full_content_fetched BOOLEAN DEFAULT false;

-- Add a column to track when the article was last updated
ALTER TABLE rss_articles ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMPTZ;

-- Add an index on the published_at column for faster cleanup queries
CREATE INDEX IF NOT EXISTS rss_articles_published_at_idx ON rss_articles (published_at);

-- Add a combined index for the cleanup query
CREATE INDEX IF NOT EXISTS rss_articles_cleanup_idx ON rss_articles (published_at, saved, transformed);
