-- Update the content column in rss_articles to handle larger content
ALTER TABLE rss_articles ALTER COLUMN content TYPE TEXT;

-- Add an index on the feed_id column for faster queries
CREATE INDEX IF NOT EXISTS rss_articles_feed_id_idx ON rss_articles (feed_id);

-- Add an index on the saved column for faster filtering of saved articles
CREATE INDEX IF NOT EXISTS rss_articles_saved_idx ON rss_articles (saved);

-- Add an index on the read column for faster filtering of unread articles
CREATE INDEX IF NOT EXISTS rss_articles_read_idx ON rss_articles (read);
