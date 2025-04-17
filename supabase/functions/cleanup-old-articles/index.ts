import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

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
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";

    console.log(
      `Initializing Supabase client with URL: ${supabaseUrl.substring(0, 10)}...`,
    );

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_KEY",
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Get days parameter from request or default to 30
    const { days = 30, dryRun = false } = await req.json();

    // Calculate the date threshold (30 days ago by default)
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);
    const thresholdDateString = thresholdDate.toISOString();

    console.log(`Checking for articles older than ${thresholdDateString}`);

    // First, count how many articles will be deleted
    const { count, error: countError } = await supabaseAdmin
      .from("rss_articles")
      .select("*", { count: "exact", head: true })
      .lt("published_at", thresholdDateString)
      .eq("saved", false)
      .is("transformed", null);

    if (countError) {
      throw countError;
    }

    let deleteResult = null;

    // If not a dry run, actually delete the articles
    if (!dryRun) {
      console.log(`Attempting to delete ${count} articles`);
      const { error: deleteError } = await supabaseAdmin
        .from("rss_articles")
        .delete()
        .lt("published_at", thresholdDateString)
        .eq("saved", false)
        .is("transformed", null);

      if (deleteError) {
        throw deleteError;
      }

      deleteResult = { deleted: true, count };
    } else {
      deleteResult = { deleted: false, count, dryRun: true };
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: dryRun
          ? `Found ${count} articles older than ${days} days that would be deleted`
          : `Deleted ${count} articles older than ${days} days`,
        result: deleteResult,
        thresholdDate: thresholdDateString,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in cleanup-old-articles function:", error);

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
