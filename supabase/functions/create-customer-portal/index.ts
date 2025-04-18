import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    console.log("Processing customer portal request");

    // Create a Supabase client using the auth header from the request
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error(
        "Unauthorized: " + (userError?.message || "No user found"),
      );
    }

    console.log(`User authenticated: ${user.id}`);

    // Get the request body
    const { returnUrl } = await req.json();
    if (!returnUrl) {
      throw new Error("Return URL is required");
    }

    console.log(`Return URL: ${returnUrl}`);

    // Get the user's subscription from the database
    const { data: subscription, error: subscriptionError } =
      await supabaseClient
        .from("subscriptions")
        .select("customer_id, status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    console.log("Subscription query result:", {
      subscription,
      error: subscriptionError,
    });

    if (subscriptionError) {
      throw new Error(
        `Error fetching subscription: ${subscriptionError.message}`,
      );
    }

    if (!subscription?.customer_id) {
      throw new Error(
        "No active subscription found for this user. Please subscribe to a plan first.",
      );
    }

    // Create a Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customer_id,
      return_url: returnUrl,
    });

    // Return the session URL
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
