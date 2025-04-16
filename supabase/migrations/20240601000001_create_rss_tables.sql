-- Create RSS feeds table
CREATE TABLE IF NOT EXISTS rss_feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, url)
);

-- Create RSS articles table
CREATE TABLE IF NOT EXISTS rss_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  feed_id UUID NOT NULL REFERENCES rss_feeds(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  link TEXT NOT NULL,
  guid TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  author TEXT,
  categories TEXT[],
  ai_categories TEXT[],
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  saved BOOLEAN DEFAULT FALSE,
  UNIQUE(feed_id, guid)
);

-- Create user feed categories table for predefined categories
CREATE TABLE IF NOT EXISTS feed_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Enable Row Level Security
ALTER TABLE rss_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE rss_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can only see their own feeds" ON rss_feeds;
CREATE POLICY "Users can only see their own feeds"
  ON rss_feeds
  FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can only see their own articles" ON rss_articles;
CREATE POLICY "Users can only see their own articles"
  ON rss_articles
  FOR ALL
  USING (feed_id IN (SELECT id FROM rss_feeds WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can only see their own categories" ON feed_categories;
CREATE POLICY "Users can only see their own categories"
  ON feed_categories
  FOR ALL
  USING (auth.uid() = user_id);

-- Enable realtime for these tables
alter publication supabase_realtime add table rss_feeds;
alter publication supabase_realtime add table rss_articles;
alter publication supabase_realtime add table feed_categories;
