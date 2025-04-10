import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import PriceCard, { Plan } from "./PriceCard";

export default function PricingSection() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  // Fetch plans from Supabase function
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoadingPlans(true);
      try {
        const { data, error } = await supabase.functions.invoke(
          "supabase-functions-get-plans",
          {
            body: {},
          },
        );

        if (error) {
          throw error;
        }

        if (data) {
          setPlans(data);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        setError("Failed to load pricing plans. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load pricing plans. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, [toast]);

  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan.",
        variant: "default",
      });
      window.location.href = "/login?redirect=pricing";
      return;
    }

    setIsLoading(true);
    setProcessingPlanId(priceId);
    setError("");

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            price_id: priceId,
            user_id: user.id,
            return_url: `${window.location.origin}/dashboard`,
          },
          headers: {
            "X-Customer-Email": user.email || "",
          },
        },
      );

      if (error) {
        throw error;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        toast({
          title: "Redirecting to checkout",
          description:
            "You'll be redirected to Stripe to complete your purchase.",
          variant: "default",
        });
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setError("Failed to create checkout session. Please try again.");
      toast({
        title: "Checkout failed",
        description:
          "There was an error creating your checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProcessingPlanId(null);
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    });

    return formatter.format(amount / 100);
  };

  // Plan features
  const getPlanFeatures = (planType: any) => {
    const basicFeatures = [
      "Core application features",
      "Basic authentication",
      "1GB storage",
      "Community support",
    ];

    const proFeatures = [
      ...basicFeatures,
      "Advanced analytics",
      "Priority support",
      "10GB storage",
      "Custom branding",
    ];

    const enterpriseFeatures = [
      ...proFeatures,
      "Dedicated account manager",
      "Custom integrations",
      "Unlimited storage",
      "SLA guarantees",
    ];

    // Convert planType to string and check if it includes the plan name
    const planTypeStr = String(planType || "");
    if (planTypeStr.includes("PRO")) return proFeatures;
    if (planTypeStr.includes("ENTERPRISE")) return enterpriseFeatures;
    return basicFeatures;
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gray-200 text-gray-800 hover:bg-gray-300 border-none">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-black">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 max-w-[700px] mx-auto">
            Choose the perfect plan for your needs. All plans include access to
            our core features. No hidden fees or surprises.
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError("")}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {isLoadingPlans ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded w-64"></div>
              <div className="h-24 bg-gray-200 rounded w-80"></div>
              <div className="h-8 bg-gray-200 rounded w-40 mx-auto"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.length > 0 ? (
              plans.map((plan, index) => (
                <PriceCard
                  key={plan.id}
                  plan={plan}
                  isLoading={isLoading}
                  processingPlanId={processingPlanId}
                  onCheckout={handleCheckout}
                  formatCurrency={formatCurrency}
                  features={getPlanFeatures(plan.product)}
                  isPopular={index === 1} // Make the middle plan popular
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">
                  No pricing plans available at the moment.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
