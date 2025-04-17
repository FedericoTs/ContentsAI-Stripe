import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";
import { load } from "https://esm.sh/cheerio@1.0.0-rc.12";
import { extract } from "https://esm.sh/@extractus/article-extractor@7.3.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { articleId, url } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SERVICE_ROLE_KEY") || "",
    );

    // Try to extract the full article content using article-extractor
    let fullContent = null;
    try {
      const article = await extract(url);
      if (article && article.content) {
        fullContent = article.content;
      }
    } catch (extractError) {
      console.error(`Error extracting content from ${url}:`, extractError);
      // Continue with fallback methods
    }

    // If article-extractor failed, try a simple fetch and parse with cheerio
    if (!fullContent) {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = load(html);

        // Remove scripts, styles, and other non-content elements
        $(
          "script, style, nav, header, footer, iframe, .ads, .comments, .sidebar",
        ).remove();

        // Try to find the main content
        const mainContent = $(
          "article, .article, .post, .content, main, #content, #main",
        );

        if (mainContent.length > 0) {
          fullContent = mainContent.html();
        } else {
          // Fallback to body content
          fullContent = $("body").html();
        }
      } catch (fetchError) {
        console.error(`Error fetching and parsing ${url}:`, fetchError);
      }
    }

    // If we have articleId and fullContent, update the database
    if (articleId && fullContent) {
      const { error } = await supabaseAdmin
        .from("rss_articles")
        .update({
          content: fullContent,
          full_content_fetched: true,
          last_updated_at: new Date().toISOString(),
        })
        .eq("id", articleId);

      if (error) {
        throw error;
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Article content updated successfully",
          contentLength: fullContent.length,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // If we only have fullContent (no articleId), just return it
    if (fullContent) {
      return new Response(
        JSON.stringify({
          success: true,
          content: fullContent,
          contentLength: fullContent.length,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // If we couldn't get the content
    return new Response(
      JSON.stringify({
        success: false,
        message: "Could not extract article content",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in fetch-full-article function:", error);

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
