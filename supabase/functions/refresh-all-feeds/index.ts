import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";
import Parser from "https://esm.sh/rss-parser@3.13.0";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.3.0";

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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SERVICE_ROLE_KEY") || "",
    );

    // Create an OpenAI client
    const openai = new OpenAIApi(
      new Configuration({
        apiKey: Deno.env.get("OPENAI_API_KEY"),
      }),
    );

    // Create a new parser instance with custom fields
    const parser: Parser<CustomFeed, CustomItem> = new Parser({
      customFields: {
        item: ["content", "content:encoded", "description"],
      },
    });

    // Get all feeds from the database
    const { data: feeds, error: feedsError } = await supabaseAdmin
      .from("rss_feeds")
      .select("*");

    if (feedsError) {
      throw feedsError;
    }

    if (!feeds || feeds.length === 0) {
      return new Response(JSON.stringify({ message: "No feeds to refresh" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Process each feed
    const results = await Promise.all(
      feeds.map(async (feed) => {
        try {
          // Fetch and parse the feed
          const parsedFeed = await parser.parseURL(feed.url);

          // Process each item in the feed
          const itemResults = await Promise.all(
            parsedFeed.items.map(async (item) => {
              try {
                // Check if the article already exists
                const { data: existingArticle } = await supabaseAdmin
                  .from("rss_articles")
                  .select("id")
                  .eq("feed_id", feed.id)
                  .eq("guid", item.guid || item.link)
                  .maybeSingle();

                if (existingArticle) {
                  return { articleId: existingArticle.id, status: "skipped" };
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
                    // Truncate content if it's too long to save tokens
                    const truncatedContent =
                      content.length > 1500
                        ? content.substring(0, 1500) + "..."
                        : content;

                    const prompt = `
                    Please analyze the following article and provide:
                    1. A list of 3-5 relevant categories or topics (as a JSON array of strings)
                    2. A brief summary in 1-2 sentences (as a string)
                    
                    Article Title: ${item.title || ""}
                    Article Content: ${truncatedContent}
                    
                    Respond in the following JSON format only:
                    {
                      "categories": ["category1", "category2", ...],
                      "summary": "Brief summary here"
                    }
                    `;

                    const aiResponse = await openai.createCompletion({
                      model: "text-davinci-003",
                      prompt,
                      max_tokens: 300,
                      temperature: 0.3,
                    });

                    // Parse the JSON response
                    try {
                      const parsedResponse = JSON.parse(
                        aiResponse.data.choices[0].text?.trim() || "{}",
                      );
                      aiCategories = Array.isArray(parsedResponse.categories)
                        ? parsedResponse.categories
                        : [];
                      aiSummary = parsedResponse.summary || "";
                    } catch (parseError) {
                      console.error("Error parsing AI response:", parseError);
                    }
                  } catch (aiError) {
                    console.error(
                      "Error classifying content with AI:",
                      aiError,
                    );
                  }
                }

                // Add the article to the database
                const { data: newArticle, error: articleError } =
                  await supabaseAdmin
                    .from("rss_articles")
                    .insert({
                      feed_id: feed.id,
                      title: item.title || "Untitled",
                      description:
                        item.contentSnippet || item.description || "",
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
                    })
                    .select()
                    .single();

                if (articleError) throw articleError;

                return { articleId: newArticle.id, status: "added" };
              } catch (itemError) {
                console.error(
                  `Error processing item in feed ${feed.id}:`,
                  itemError,
                );
                return { error: String(itemError), status: "error" };
              }
            }),
          );

          // Update the last_fetched_at timestamp
          await supabaseAdmin
            .from("rss_feeds")
            .update({ last_fetched_at: new Date().toISOString() })
            .eq("id", feed.id);

          return {
            feedId: feed.id,
            feedTitle: feed.title,
            success: true,
            itemsProcessed: itemResults.length,
            itemsAdded: itemResults.filter((r) => r.status === "added").length,
            itemsSkipped: itemResults.filter((r) => r.status === "skipped")
              .length,
            itemsWithErrors: itemResults.filter((r) => r.status === "error")
              .length,
          };
        } catch (feedError) {
          console.error(`Error refreshing feed ${feed.id}:`, feedError);
          return {
            feedId: feed.id,
            feedTitle: feed.title,
            success: false,
            error: String(feedError),
          };
        }
      }),
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "RSS feeds refreshed",
        totalFeeds: feeds.length,
        successfulFeeds: results.filter((r) => r.success).length,
        failedFeeds: results.filter((r) => !r.success).length,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in refresh-all-feeds function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
