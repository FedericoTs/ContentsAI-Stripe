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
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SERVICE_ROLE_KEY") || "",
    );

    // Get days parameter from request or default to 30
    const { days = 30, dryRun = false } = await req.json();

    // Calculate the date threshold (30 days ago by default)
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - days);
    const thresholdDateString = thresholdDate.toISOString();

    // First, count how many articles will be deleted
    const { count, error: countError } = await supabaseAdmin
      .from("rss_articles")
      .select("*", { count: "exact", head: true })
      .lt("published_at", thresholdDateString)
      .eq("saved", false)
      .eq("transformed", false);

    if (countError) {
      throw countError;
    }

    let deleteResult = null;

    // If not a dry run, actually delete the articles
    if (!dryRun) {
      const { error: deleteError } = await supabaseAdmin
        .from("rss_articles")
        .delete()
        .lt("published_at", thresholdDateString)
        .eq("saved", false)
        .eq("transformed", false);

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
