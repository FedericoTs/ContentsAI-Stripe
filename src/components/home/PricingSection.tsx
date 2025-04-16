"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Check, CreditCard, Sparkles, Shield, Zap } from "lucide-react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface Plan {
  id: string;
  product: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
}

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
    if (!amount || isNaN(amount)) return "$0";

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    });

    return formatter.format(amount / 100);
  };

  // Plan features
  const getPlanFeatures = (planType: any) => {
    const basicFeatures = [
      "5 content transformations per day",
      "Blog and social media formats",
      "Basic AI content enhancement",
      "Standard support",
    ];

    const proFeatures = [
      "Unlimited content transformations",
      "All content formats supported",
      "Advanced AI content enhancement",
      "Priority support",
      "Custom brand voice profiles",
      "Analytics dashboard",
    ];

    const enterpriseFeatures = [
      "Unlimited content transformations",
      "All content formats supported",
      "Premium AI content enhancement",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced analytics",
      "API access",
      "SLA guarantees",
      "Team collaboration tools",
    ];

    // Convert planType to string and check if it includes the plan name
    const planTypeStr = String(planType || "");
    if (planTypeStr.includes("PRO")) return proFeatures;
    if (planTypeStr.includes("ENTERPRISE")) return enterpriseFeatures;
    return basicFeatures;
  };

  // Placeholder plans for development/preview
  const placeholderPlans: Plan[] = [
    {
      id: "price_basic",
      product: "BASIC",
      name: "Starter",
      description: "Perfect for individuals and small projects",
      price: 1900,
      currency: "usd",
      interval: "month",
    },
    {
      id: "price_pro",
      product: "PRO",
      name: "Professional",
      description: "Ideal for growing businesses and teams",
      price: 4900,
      currency: "usd",
      interval: "month",
    },
    {
      id: "price_enterprise",
      product: "ENTERPRISE",
      name: "Enterprise",
      description: "For organizations with advanced needs",
      price: 9900,
      currency: "usd",
      interval: "month",
    },
  ];

  // Use placeholder plans if no plans are loaded
  const plansToDisplay = plans.length > 0 ? plans : placeholderPlans;

  // Reorder the plans to swap first and last, keeping the middle one in place
  const displayPlans =
    plansToDisplay.length === 3
      ? [plansToDisplay[2], plansToDisplay[1], plansToDisplay[0]]
      : plansToDisplay;

  const fadeInUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/3 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px] opacity-70" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-[300px] w-[300px] rounded-full bg-blue-600/10 blur-[100px] opacity-70" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <Badge className="mb-4 bg-white/10 backdrop-blur-sm text-cyan-400 hover:bg-white/20 border-0 px-3 py-1.5">
            <CreditCard className="h-3.5 w-3.5 mr-2" />
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Simple, <span className="text-purple-400">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-white/70">
            Choose the perfect plan for your content needs. All plans include
            access to our core AI transformation features. No hidden fees or
            surprises.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 backdrop-blur-md border border-red-500/30 text-red-200 px-4 py-3 rounded-lg relative mb-6 max-w-3xl mx-auto"
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
          </motion.div>
        )}

        {isLoadingPlans ? (
          <div className="flex justify-center items-center py-12">
            <div className="space-y-8">
              <div className="h-12 bg-white/5 rounded-lg w-64 animate-pulse"></div>
              <div className="h-24 bg-white/5 rounded-lg w-80 animate-pulse"></div>
              <div className="h-8 bg-white/5 rounded-lg w-40 mx-auto animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {displayPlans.map((plan, index) => {
              const features = getPlanFeatures(plan.product);
              const isPopular = index === 1;
              const planGradient =
                index === 0
                  ? "from-blue-500/20 to-blue-700/20"
                  : index === 1
                    ? "from-purple-500/20 to-purple-700/20"
                    : "from-cyan-500/20 to-cyan-700/20";

              const buttonGradient =
                index === 0
                  ? "from-blue-500 to-blue-600"
                  : index === 1
                    ? "from-purple-500 to-purple-600"
                    : "from-cyan-500 to-cyan-600";

              const iconColor =
                index === 0
                  ? "text-blue-400"
                  : index === 1
                    ? "text-purple-400"
                    : "text-cyan-400";

              return (
                <motion.div
                  key={plan.id}
                  variants={fadeInUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index}
                  className="relative"
                >
                  {isPopular && (
                    <div className="absolute -top-5 inset-x-0 flex justify-center">
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white border-0 px-3 py-1 shadow-lg">
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <Card
                    className={`h-full bg-gradient-to-br ${planGradient} backdrop-blur-md border ${
                      isPopular ? "border-purple-500/30" : "border-white/10"
                    } overflow-hidden relative ${
                      isPopular ? "shadow-[0_0_30px_rgba(168,85,247,0.15)]" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md -z-10" />

                    <CardHeader className="pb-2">
                      <CardTitle className="text-2xl font-bold text-white">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-0">
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-white">
                          {formatCurrency(
                            plan.amount || plan.price,
                            plan.currency,
                          )}
                        </span>
                        <span className="text-white/50 ml-2">
                          /{plan.interval}
                        </span>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <Check
                              className={`h-5 w-5 mr-2 mt-0.5 ${iconColor}`}
                            />
                            <span className="text-white/80">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pt-4">
                      <Button
                        onClick={() => handleCheckout(plan.id)}
                        disabled={isLoading && processingPlanId === plan.id}
                        className={`w-full bg-gradient-to-r ${buttonGradient} hover:from-purple-600 hover:to-blue-600 text-white border-0 h-12 relative overflow-hidden group`}
                      >
                        <span className="relative z-10 flex items-center">
                          {isLoading && processingPlanId === plan.id ? (
                            <>
                              <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                              Processing...
                            </>
                          ) : (
                            <>
                              {index === 0
                                ? "Get Started"
                                : index === 1
                                  ? "Choose Pro"
                                  : "Get the Most"}
                            </>
                          )}
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Enterprise callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-md border border-white/10 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-soft-light pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 mr-2 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">
                    Need a custom solution?
                  </h3>
                </div>
                <p className="text-white/70">
                  Contact our sales team for custom pricing, dedicated support,
                  and tailored solutions for your enterprise needs.
                </p>
              </div>
              <div>
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 px-6">
                  <Zap className="h-4 w-4 mr-2" />
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
