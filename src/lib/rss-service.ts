import Parser from "rss-parser";
import { supabase } from "../../supabase/supabase";
import { generateContent } from "./openai";
import axios from "axios";
import { curatedRssFeeds } from "../data/curated-rss-feeds";

// Define custom fields for the RSS parser
type CustomItem = {
  content: string;
  contentSnippet: string;
  guid: string;
  categories: string[];
};

type CustomFeed = {
  feedUrl: string;
  title: string;
  description: string;
};

// Create a new parser instance with custom fields
const parser: Parser<CustomFeed, CustomItem> = new Parser({
  customFields: {
    item: ["content", "content:encoded", "description"],
  },
  defaultRSS: 2.0,
  maxRedirects: 5,
});

/**
 * Fetch and parse an RSS feed using a browser-compatible approach with multiple CORS proxy fallbacks
 */
export async function fetchRssFeed(url: string) {
  // List of CORS proxies to try in order
  const corsProxies = [
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://cors-anywhere.herokuapp.com/${url}`,
    (url: string) =>
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`,
  ];

  let lastError = null;

  // Try each proxy in sequence until one works
  for (const proxyFormatter of corsProxies) {
    try {
      const corsProxyUrl = proxyFormatter(url);

      // Fetch the RSS feed content using axios with a timeout
      const response = await axios.get(corsProxyUrl, { timeout: 10000 });

      // Parse the XML content directly
      const feed = await parser.parseString(response.data);
      return feed;
    } catch (error) {
      console.error(`Error fetching RSS feed using proxy from ${url}:`, error);
      lastError = error;
      // Continue to the next proxy
    }
  }

  // If we get here, all proxies failed
  console.error(`All CORS proxies failed for ${url}:`, lastError);
  throw new Error(
    `Failed to fetch RSS feed: ${lastError?.message || "All CORS proxies failed"}`,
  );
}

/**
 * Validate if a URL is a valid RSS feed
 */
export async function validateRssFeed(url: string): Promise<boolean> {
  try {
    const feed = await fetchRssFeed(url);
    return !!feed && Array.isArray(feed.items);
  } catch (error) {
    return false;
  }
}

/**
 * Add a new RSS feed to the database
 */
export async function addRssFeed(url: string, category?: string) {
  try {
    // First validate the feed
    const feed = await fetchRssFeed(url);

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Add the feed to the database
    const { data, error } = await supabase
      .from("rss_feeds")
      .insert({
        user_id: user.id,
        title: feed.title || "Untitled Feed",
        url: url,
        category: category,
      })
      .select()
      .single();

    if (error) {
      // If the feed already exists, don't treat it as an error
      if (error.code === "23505") {
        // Unique violation
        return { success: true, message: "Feed already exists" };
      }
      throw error;
    }

    // Process the feed items
    await processNewFeedItems(data.id, feed);

    return { success: true, data };
  } catch (error) {
    console.error("Error adding RSS feed:", error);
    return { success: false, error };
  }
}

/**
 * Process new items from a feed and add them to the database
 */
async function processNewFeedItems(
  feedId: string,
  feed: Parser.Output<CustomFeed, CustomItem>,
) {
  try {
    for (const item of feed.items) {
      // Check if the article already exists
      const { data: existingArticle } = await supabase
        .from("rss_articles")
        .select("id")
        .eq("feed_id", feedId)
        .eq("guid", item.guid || item.link)
        .maybeSingle();

      if (existingArticle) {
        continue; // Skip if article already exists
      }

      // Get content from the item - prioritize full content
      const content =
        item.content ||
        item["content:encoded"] ||
        item.contentSnippet ||
        item.description ||
        "";

      // Classify the content using AI if content is not empty
      let aiCategories: string[] = [];
      let aiSummary: string = "";

      if (content && content.length > 10) {
        try {
          const classificationResult = await classifyContent(
            item.title || "",
            content,
          );
          aiCategories = classificationResult.categories;
          aiSummary = classificationResult.summary;
        } catch (error) {
          console.error("Error classifying content:", error);
          // Continue without classification if it fails
        }
      }

      // Add the article to the database
      await supabase.from("rss_articles").insert({
        feed_id: feedId,
        title: item.title || "Untitled",
        description: item.contentSnippet || item.description || "",
        content: content,
        link: item.link || "",
        guid: item.guid || item.link,
        published_at: item.pubDate
          ? new Date(item.pubDate).toISOString()
          : null,
        author: item.creator || item.author || "",
        categories: item.categories || [],
        ai_categories: aiCategories,
        ai_summary: aiSummary,
      });
    }

    // Update the last_fetched_at timestamp
    await supabase
      .from("rss_feeds")
      .update({ last_fetched_at: new Date().toISOString() })
      .eq("id", feedId);

    return { success: true };
  } catch (error) {
    console.error("Error processing feed items:", error);
    return { success: false, error };
  }
}

/**
 * Classify content using OpenAI
 */
async function classifyContent(title: string, content: string) {
  try {
    // Truncate content if it's too long to save tokens
    const truncatedContent =
      content.length > 1500 ? content.substring(0, 1500) + "..." : content;

    const prompt = `
    Please analyze the following article and provide:
    1. A list of 3-5 relevant categories or topics (as a JSON array of strings)
    2. A brief summary in 1-2 sentences (as a string)
    
    Article Title: ${title}
    Article Content: ${truncatedContent}
    
    Respond in the following JSON format only:
    {
      "categories": ["category1", "category2", ...],
      "summary": "Brief summary here"
    }
    `;

    const response = await generateContent(prompt, {
      model: "gpt-3.5-turbo", // Using a cheaper model for classification
      temperature: 0.3,
      maxTokens: 300,
    });

    // Parse the JSON response
    try {
      const parsedResponse = JSON.parse(response || "{}");
      return {
        categories: Array.isArray(parsedResponse.categories)
          ? parsedResponse.categories
          : [],
        summary: parsedResponse.summary || "",
      };
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      return { categories: [], summary: "" };
    }
  } catch (error) {
    console.error("Error classifying content with AI:", error);
    return { categories: [], summary: "" };
  }
}

/**
 * Fetch all feeds for the current user
 */
export async function getUserFeeds() {
  try {
    const { data, error } = await supabase
      .from("rss_feeds")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching user feeds:", error);
    return { success: false, error };
  }
}

/**
 * Fetch articles for a specific feed
 */
export async function getFeedArticles(
  feedId: string,
  options: { limit?: number; offset?: number } = {},
) {
  try {
    const { limit = 20, offset = 0 } = options;

    const { data, error } = await supabase
      .from("rss_articles")
      .select("*")
      .eq("feed_id", feedId)
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching feed articles:", error);
    return { success: false, error };
  }
}

/**
 * Fetch all articles for the current user
 */
export async function getAllUserArticles(
  options: { limit?: number; offset?: number; category?: string } = {},
) {
  try {
    const { limit = 20, offset = 0, category } = options;

    let query = supabase
      .from("rss_articles")
      .select("*, rss_feeds!inner(*)")
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq("rss_feeds.category", category);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching user articles:", error);
    return { success: false, error };
  }
}

/**
 * Mark an article as read
 */
export async function markArticleAsRead(
  articleId: string,
  isRead: boolean = true,
) {
  try {
    const { error } = await supabase
      .from("rss_articles")
      .update({ read: isRead })
      .eq("id", articleId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error marking article as read:", error);
    return { success: false, error };
  }
}

/**
 * Save or unsave an article
 */
export async function saveArticle(articleId: string, isSaved: boolean = true) {
  try {
    const { error } = await supabase
      .from("rss_articles")
      .update({ saved: isSaved })
      .eq("id", articleId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error saving article:", error);
    return { success: false, error };
  }
}

/**
 * Delete a feed and all its articles
 */
export async function deleteFeed(feedId: string) {
  try {
    const { error } = await supabase
      .from("rss_feeds")
      .delete()
      .eq("id", feedId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error deleting feed:", error);
    return { success: false, error };
  }
}

/**
 * Get user feed categories
 */
export async function getUserFeedCategories() {
  try {
    const { data, error } = await supabase
      .from("feed_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching user feed categories:", error);
    return { success: false, error };
  }
}

/**
 * Add a new feed category
 */
export async function addFeedCategory(name: string, color?: string) {
  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("feed_categories")
      .insert({
        user_id: user.id,
        name,
        color,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error adding feed category:", error);
    return { success: false, error };
  }
}

/**
 * Update a feed's category
 */
export async function updateFeedCategory(feedId: string, category: string) {
  try {
    const { error } = await supabase
      .from("rss_feeds")
      .update({ category })
      .eq("id", feedId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error updating feed category:", error);
    return { success: false, error };
  }
}

/**
 * Update a category name
 */
export async function updateCategoryName(
  categoryId: string,
  name: string,
  color?: string,
) {
  try {
    const { data, error } = await supabase
      .from("feed_categories")
      .update({ name, ...(color ? { color } : {}) })
      .eq("id", categoryId)
      .select()
      .single();

    if (error) throw error;

    // Also update all feeds that use this category
    const { data: oldCategory } = await supabase
      .from("feed_categories")
      .select("name")
      .eq("id", categoryId)
      .single();

    if (oldCategory && oldCategory.name !== name) {
      await supabase
        .from("rss_feeds")
        .update({ category: name })
        .eq("category", oldCategory.name);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error updating category name:", error);
    return { success: false, error };
  }
}

/**
 * Refresh all feeds for the current user
 */
export async function refreshAllFeeds() {
  try {
    // Call the Supabase Edge Function to refresh all feeds
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-refresh-all-feeds",
      {
        body: {},
      },
    );

    if (error) {
      console.error("Error calling refresh-all-feeds function:", error);
      return { success: false, error };
    }

    return {
      success: true,
      ...data,
      successCount: data.successfulFeeds,
      failureCount: data.failedFeeds,
    };
  } catch (error) {
    console.error("Error refreshing all feeds:", error);
    return { success: false, error };
  }
}

/**
 * Get curated RSS feeds list
 */
export function getCuratedRssFeeds() {
  try {
    return { success: true, data: curatedRssFeeds };
  } catch (error) {
    console.error("Error getting curated RSS feeds:", error);
    return { success: false, error };
  }
}

/**
 * Get curated RSS feeds by category
 */
export function getCuratedRssFeedsByCategory(category: string) {
  try {
    const categoryFeeds = curatedRssFeeds.find((c) => c.category === category);
    if (!categoryFeeds) {
      return { success: false, error: { message: "Category not found" } };
    }
    return { success: true, data: categoryFeeds.feeds };
  } catch (error) {
    console.error("Error getting curated RSS feeds by category:", error);
    return { success: false, error };
  }
}
