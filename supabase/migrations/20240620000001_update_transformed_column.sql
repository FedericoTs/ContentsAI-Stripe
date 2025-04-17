-- Set default value for transformed column to null instead of false
ALTER TABLE rss_articles ALTER COLUMN transformed DROP DEFAULT;

-- Update existing records where transformed is false to be null
UPDATE rss_articles SET transformed = NULL WHERE transformed = false;
