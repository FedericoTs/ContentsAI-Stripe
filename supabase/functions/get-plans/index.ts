import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get all active plans
    const plans = await stripe.plans.list({
      active: true,
      expand: ["data.product"],
    });

    // Enhance plans with product information
    const enhancedPlans = await Promise.all(
      plans.data.map(async (plan) => {
        // If product is expanded, use it directly
        if (typeof plan.product === "object") {
          return {
            ...plan,
            product_name: plan.product.name,
            product_description: plan.product.description,
          };
        }

        // Otherwise fetch the product
        try {
          const product = await stripe.products.retrieve(
            plan.product as string,
          );
          return {
            ...plan,
            product_name: product.name,
            product_description: product.description,
          };
        } catch (err) {
          console.error(`Error fetching product ${plan.product}:`, err);
          return plan;
        }
      }),
    );

    return new Response(JSON.stringify(enhancedPlans), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error getting products:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
