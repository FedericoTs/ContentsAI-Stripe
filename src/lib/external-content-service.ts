import { supabase } from "../../supabase/supabase";
import axios from "axios";
import { generateContent } from "./openai";
import { User } from "@supabase/supabase-js";

// Define content source types
export type ContentSourceType =
  | "linkedin"
  | "facebook"
  | "wordpress"
  | "youtube"
  | "manual";

// Define common content interface
export interface ExternalContent {
  id: string;
  source_type: ContentSourceType;
  source_id: string;
  title: string;
  description: string;
  content: string;
  link: string;
  published_at: string | null;
  author: string;
  thumbnail_url?: string;
  categories?: string[];
  ai_categories?: string[];
  ai_summary?: string;
  metadata?: Record<string, any>;
  saved?: boolean;
}

/**
 * Fetch content from LinkedIn
 */
export async function fetchLinkedinContent(
  accessToken?: string,
  options: { limit?: number } = {},
) {
  try {
    const { limit = 20 } = options;

    // If access token is not provided, try to get it from the database
    const actualAccessToken =
      accessToken || (await getStoredApiKey("linkedin"));

    if (!actualAccessToken) {
      return {
        success: false,
        error:
          "LinkedIn access token not found. Please set it in the API Access Manager.",
      };
    }

    // This would use the LinkedIn API in a real implementation
    // For now, we'll simulate the API call
    console.log(
      `Fetching LinkedIn content with token: ${actualAccessToken.substring(0, 5)}...`,
    );

    // In a real implementation, you would use the LinkedIn API
    // const response = await axios.get('https://api.linkedin.com/v2/ugcPosts', {
    //   headers: { Authorization: `Bearer ${actualAccessToken}` },
    //   params: { count: limit }
    // });

    // For now, return a mock response
    return {
      success: true,
      message:
        "LinkedIn API integration requires a LinkedIn Developer account and approved application.",
      data: [],
    };
  } catch (error) {
    console.error("Error fetching LinkedIn content:", error);
    return { success: false, error };
  }
}

/**
 * Fetch content from Facebook
 */
export async function fetchFacebookContent(
  accessToken?: string,
  options: { limit?: number } = {},
) {
  try {
    const { limit = 20 } = options;

    // If access token is not provided, try to get it from the database
    const actualAccessToken =
      accessToken || (await getStoredApiKey("facebook"));

    if (!actualAccessToken) {
      return {
        success: false,
        error:
          "Facebook access token not found. Please set it in the API Access Manager.",
      };
    }

    // This would use the Facebook Graph API in a real implementation
    // For now, we'll simulate the API call
    console.log(
      `Fetching Facebook content with token: ${actualAccessToken.substring(0, 5)}...`,
    );

    // In a real implementation, you would use the Facebook Graph API
    // const response = await axios.get('https://graph.facebook.com/v18.0/me/posts', {
    //   params: { access_token: actualAccessToken, limit: limit, fields: 'id,message,created_time,permalink_url,full_picture' }
    // });

    // For now, return a mock response
    return {
      success: true,
      message:
        "Facebook API integration requires a Facebook Developer account and approved application.",
      data: [],
    };
  } catch (error) {
    console.error("Error fetching Facebook content:", error);
    return { success: false, error };
  }
}

/**
 * Fetch content from WordPress
 */
export async function fetchWordpressContent(
  siteUrl: string,
  options: { limit?: number } = {},
) {
  try {
    const { limit = 20 } = options;

    // WordPress sites typically have a REST API endpoint at /wp-json/wp/v2/posts
    const apiUrl = `${siteUrl.replace(/\/$/, "")}/wp-json/wp/v2/posts`;

    // Fetch posts from the WordPress site
    const response = await axios.get(apiUrl, {
      params: { per_page: limit },
    });

    // Transform WordPress posts to our common format
    const posts = response.data.map((post: any) => ({
      id: post.id.toString(),
      source_type: "wordpress" as ContentSourceType,
      source_id: post.id.toString(),
      title: post.title.rendered || "Untitled",
      description: post.excerpt.rendered || "",
      content: post.content.rendered || "",
      link: post.link || "",
      published_at: post.date || null,
      author: post.author_name || "Unknown",
      thumbnail_url: post.featured_media_url || undefined,
      categories: post.categories || [],
    }));

    return { success: true, data: posts };
  } catch (error) {
    console.error("Error fetching WordPress content:", error);
    return { success: false, error };
  }
}

/**
 * Get stored API key for a service
 */
async function getStoredApiKey(service: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("api_keys")
      .select("api_key")
      .eq("service", service)
      .maybeSingle();

    if (error) throw error;
    return data?.api_key || null;
  } catch (error) {
    console.error(`Error fetching ${service} API key:`, error);
    return null;
  }
}

/**
 * Fetch content from YouTube
 */
export async function fetchYoutubeContent(
  apiKey?: string,
  channelId?: string,
  options: { limit?: number } = {},
) {
  try {
    const { limit = 20 } = options;

    // If API key is not provided, try to get it from the database
    const actualApiKey = apiKey || (await getStoredApiKey("youtube"));

    if (!actualApiKey) {
      return {
        success: false,
        error:
          "YouTube API key not found. Please set it in the API Access Manager.",
      };
    }

    if (!channelId) {
      return {
        success: false,
        error: "YouTube channel ID is required.",
      };
    }

    // Fetch videos from the YouTube Data API
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: actualApiKey,
          channelId: channelId,
          part: "snippet",
          order: "date",
          maxResults: limit,
          type: "video",
        },
      },
    );

    // Transform YouTube videos to our common format
    const videos = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      source_type: "youtube" as ContentSourceType,
      source_id: item.id.videoId,
      title: item.snippet.title || "Untitled",
      description: item.snippet.description || "",
      content: item.snippet.description || "", // YouTube doesn't provide full content
      link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      published_at: item.snippet.publishedAt || null,
      author: item.snippet.channelTitle || "Unknown",
      thumbnail_url:
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.default?.url,
      categories: [],
      metadata: {
        videoId: item.id.videoId,
        channelId: item.snippet.channelId,
      },
    }));

    return { success: true, data: videos };
  } catch (error) {
    console.error("Error fetching YouTube content:", error);
    return { success: false, error };
  }
}

/**
 * Save external content to the database
 */
export async function saveExternalContent(
  content: ExternalContent,
  userId?: string,
) {
  try {
    // Classify the content using AI if content is not empty
    if (content.content && content.content.length > 10) {
      try {
        const classificationResult = await classifyContent(
          content.title || "",
          content.content,
        );
        content.ai_categories = classificationResult.categories;
        content.ai_summary = classificationResult.summary;
      } catch (error) {
        console.error("Error classifying content:", error);
        // Continue without classification if it fails
      }
    }

    // Save to the database
    const { data, error } = await supabase
      .from("external_content")
      .upsert(
        {
          source_type: content.source_type,
          source_id: content.source_id,
          title: content.title,
          description: content.description,
          content: content.content,
          link: content.link,
          published_at: content.published_at,
          author: content.author,
          thumbnail_url: content.thumbnail_url,
          categories: content.categories || [],
          ai_categories: content.ai_categories || [],
          ai_summary: content.ai_summary || "",
          metadata: content.metadata || {},
          saved: true, // Mark as saved by default
          last_updated_at: new Date().toISOString(),
          user_id: userId || (await supabase.auth.getUser()).data.user?.id,
        },
        { onConflict: "source_type,source_id" },
      )
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error saving external content:", error);
    return { success: false, error };
  }
}

/**
 * Get all external content for the current user
 */
export async function getAllExternalContent(
  options: {
    limit?: number;
    offset?: number;
    source_type?: ContentSourceType;
    userId?: string;
  } = {},
) {
  try {
    const { limit = 20, offset = 0, source_type, userId } = options;

    let query = supabase
      .from("external_content")
      .select("*")
      .order("published_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (source_type) {
      query = query.eq("source_type", source_type);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching external content:", error);
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
    Please analyze the following content and provide:
    1. A list of 3-5 relevant categories or topics (as a JSON array of strings)
    2. A brief summary in 1-2 sentences (as a string)
    
    Content Title: ${title}
    Content: ${truncatedContent}
    
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
 * Save transformed content to the database
 */
export async function saveTransformedContent({
  originalContentId,
  transformationType,
  resultData,
  settings,
  title,
  description,
  userId,
}: {
  originalContentId: string;
  transformationType: string;
  resultData: any;
  settings?: any;
  title?: string;
  description?: string;
  userId?: string;
}) {
  try {
    const { data, error } = await supabase
      .from("transformed_content")
      .insert({
        original_content_id: originalContentId,
        transformation_type: transformationType,
        result_data: resultData,
        settings: settings || {},
        title: title || "",
        description: description || "",
        user_id: userId || (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;

    // Also mark the original content as transformed
    await markExternalContentAsTransformed(originalContentId);

    return { success: true, data };
  } catch (error) {
    console.error("Error saving transformed content:", error);
    return { success: false, error };
  }
}

/**
 * Get transformed content for a specific original content
 */
export async function getTransformedContent(originalContentId: string) {
  try {
    const { data, error } = await supabase
      .from("transformed_content")
      .select("*")
      .eq("original_content_id", originalContentId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching transformed content:", error);
    return { success: false, error };
  }
}

export async function markExternalContentAsTransformed(contentId: string) {
  try {
    const { error } = await supabase
      .from("external_content")
      .update({ transformed: true })
      .eq("id", contentId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error marking external content as transformed:", error);
    return { success: false, error };
  }
}
