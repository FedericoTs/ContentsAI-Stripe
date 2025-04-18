import { useState, useEffect } from "react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Edit,
  ExternalLink,
  Loader2,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function UserProfile() {
  const { user, loading, subscriptionStatus, hasBusinessPlan, deleteAccount } =
    useAuth();
  const [avatarSeed, setAvatarSeed] = useState<string>(user?.email || "user");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [customAvatarSeed, setCustomAvatarSeed] = useState(avatarSeed);
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);
  const [planType, setPlanType] = useState<string>("");
  const [isPlanLoading, setIsPlanLoading] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAvatarChange = () => {
    setAvatarSeed(customAvatarSeed);
    setIsEditingAvatar(false);
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  // Fetch plan type from Stripe subscription
  useEffect(() => {
    const fetchPlanType = async () => {
      if (!user || !subscriptionStatus.isActive) {
        setPlanType("Free Plan");
        return;
      }

      try {
        setIsPlanLoading(true);
        setSubscriptionError(null);

        // Get the subscription details from Supabase
        const { data, error } = await supabase
          .from("subscriptions")
          .select("stripe_price_id, metadata, amount, currency, interval")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            // No rows returned
            setPlanType("Free Plan");
            console.log(
              "No active subscription found in database, using Free Plan",
            );
          } else {
            console.error("Database error fetching subscription:", error);
            throw new Error(`Database error: ${error.message}`);
          }
          return;
        }

        if (data) {
          console.log("Subscription data from database:", data);

          // First try to get the plan name from the product name in metadata
          let planName = data.metadata?.product_name || "";

          // If no product name, try to get it from the price ID
          if (!planName) {
            // Get available plans from the pricing section
            const { data: plansData, error: plansError } = await supabase
              .from("plans")
              .select("id, name, product_name")
              .eq("id", data.stripe_price_id)
              .maybeSingle();

            if (!plansError && plansData) {
              planName = plansData.name || plansData.product_name || "";
              console.log("Found plan name from plans table:", planName);
            }
          }

          // If still no plan name, create one based on the price
          if (!planName) {
            // Format the amount with currency
            const formatter = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: data.currency?.toUpperCase() || "USD",
              minimumFractionDigits: 0,
            });

            const formattedAmount = formatter.format(
              data.amount ? data.amount / 100 : 0,
            );
            const interval = data.interval || "month";

            // Create a generic plan name based on price
            planName = `${formattedAmount}/${interval} Plan`;
          }

          setPlanType(planName || "Standard Plan");
          console.log("Successfully set plan type to:", planName);
        } else {
          setPlanType("Free Plan");
          console.log("No subscription data, using Free Plan");
        }
      } catch (error: any) {
        console.error("Error fetching subscription details:", error);
        setSubscriptionError("Could not retrieve subscription details");
        setPlanType("Free Plan");
      } finally {
        setIsPlanLoading(false);
      }
    };

    fetchPlanType();
  }, [user, subscriptionStatus.isActive]);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      const result = await deleteAccount();

      if (result.success) {
        toast({
          title: "Account deleted",
          description:
            result.message || "Your account has been successfully deleted",
          variant: "default",
        });
        // No need to navigate - the auth context will handle sign out
        // and the app will redirect to login
      } else {
        throw new Error(result.message || "Failed to delete account");
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      setDeleteError(error.message || "Failed to delete account");
      toast({
        title: "Account Deletion Error",
        description:
          error.message ||
          "Could not delete your account. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsManagingSubscription(true);
      setSubscriptionError(null);

      // Get the current URL to use as the return URL
      const returnUrl = window.location.origin + "/profile";

      console.log(
        "Creating customer portal session with return URL:",
        returnUrl,
      );

      // Call the Supabase Edge Function to create a customer portal session
      const { data, error } = await supabase.functions.invoke(
        "create-customer-portal",
        {
          body: { returnUrl },
        },
      );

      console.log("Customer portal response:", { data, error });

      if (error) {
        throw new Error(
          error.message || "Failed to create customer portal session",
        );
      }

      // Check if we have a valid URL in the response
      if (!data?.url) {
        throw new Error("No portal URL returned from server");
      }

      // Redirect to the Stripe Customer Portal
      console.log("Redirecting to Stripe portal URL:", data.url);
      window.location.href = data.url;
    } catch (error: any) {
      console.error("Error opening customer portal:", error);
      setSubscriptionError(error.message || "An unknown error occurred");
      toast({
        title: "Subscription Management Error",
        description:
          error.message ||
          "Could not open subscription management portal. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsManagingSubscription(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        Please sign in
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card className="bg-black/40 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile</CardTitle>
          <CardDescription className="text-white/60">
            Manage your account settings and subscription
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Information */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex flex-col items-center space-y-3">
              <Avatar className="h-24 w-24 border-2 border-purple-500/50">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                  alt={user.email || ""}
                />
                <AvatarFallback className="bg-black/40 text-lg">
                  {user.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {isEditingAvatar ? (
                <div className="flex flex-col gap-2 w-full">
                  <Input
                    value={customAvatarSeed}
                    onChange={(e) => setCustomAvatarSeed(e.target.value)}
                    className="bg-black/30 border-white/20 text-white"
                    placeholder="Enter avatar seed"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAvatarChange}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingAvatar(false)}
                      className="border-white/20 text-white/70 hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingAvatar(true)}
                  className="border-white/20 text-white/70 hover:bg-white/10"
                >
                  <Edit className="h-3 w-3 mr-1" /> Change Avatar
                </Button>
              )}
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <h3 className="text-sm font-medium text-white/60">Full Name</h3>
                <p className="text-lg">
                  {user.user_metadata?.full_name || "Not provided"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/60">Email</h3>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/60">
                  Member Since
                </h3>
                <p className="text-lg">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Account Management */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Account Management</h2>
            <div className="bg-black/20 rounded-lg p-6 border border-white/10">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Delete Account</h3>
                <p className="text-white/60">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-black/90 border border-white/10 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-500">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-white/70">
                        This action cannot be undone. This will permanently
                        delete your account and remove all your data from our
                        servers, including all subscriptions, saved content, and
                        personal information.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-white/20 text-white/70 hover:bg-white/10">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {deleteError && (
                  <div className="text-sm text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    {deleteError}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Subscription Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Subscription</h2>

            <div className="bg-black/20 rounded-lg p-6 border border-white/10">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {/* Plan Information */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">Current Plan</h3>
                    {subscriptionStatus.isActive ? (
                      <Badge className="bg-green-600 text-white">
                        {subscriptionStatus.trialActive ? "Trial" : "Active"}
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-600 text-white">Free</Badge>
                    )}
                  </div>

                  {/* Plan Details */}
                  <div className="bg-black/30 rounded-lg p-4 space-y-3">
                    {isPlanLoading ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-5 w-5 mr-2 animate-spin text-purple-400" />
                        <span>Loading subscription details...</span>
                      </div>
                    ) : subscriptionStatus.isActive ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-500/20 p-2 rounded-full">
                            <CheckCircle className="h-5 w-5 text-purple-500" />
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {planType ||
                                (hasBusinessPlan()
                                  ? "Business Plan"
                                  : "Standard Plan")}
                            </div>
                            <div className="text-xs text-white/60">
                              Full access to all premium features
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-white/60">Status</div>
                            <div className="font-medium">
                              {subscriptionStatus.trialActive
                                ? "Trial Period"
                                : "Active"}
                            </div>
                          </div>
                          <div>
                            <div className="text-white/60">Next Billing</div>
                            <div className="font-medium">
                              {formatDate(subscriptionStatus.currentPeriodEnd)}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="bg-yellow-500/20 p-2 rounded-full">
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            Free Plan
                          </div>
                          <div className="text-xs text-white/60">
                            Limited features available
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="md:w-64 space-y-3">
                  <h4 className="text-sm font-medium text-white/60">
                    Subscription Actions
                  </h4>

                  {subscriptionStatus.isActive ? (
                    <>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        onClick={() => window.open("/pricing", "_blank")}
                      >
                        Upgrade Plan <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full border-white/20 text-white/70 hover:bg-white/10"
                        onClick={handleManageSubscription}
                        disabled={isManagingSubscription}
                      >
                        {isManagingSubscription ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            Opening Portal...
                          </>
                        ) : (
                          "Manage Subscription"
                        )}
                      </Button>

                      {subscriptionError && (
                        <div className="text-sm text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {subscriptionError}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        onClick={() => window.open("/pricing", "_blank")}
                      >
                        Upgrade to Premium{" "}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                      <div className="text-xs text-white/60 text-center mt-2">
                        Unlock all premium features and content transformation
                        capabilities
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
