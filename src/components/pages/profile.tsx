import React, { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CreditCard,
  User,
  Settings,
  Shield,
  ExternalLink,
  Trash2,
} from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, subscriptionStatus, hasBusinessPlan, deleteAccount } =
    useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const { toast } = useToast();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 border-2 border-purple-500">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt={user.email || ""}
                  />
                  <AvatarFallback className="bg-purple-900 text-xl">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-medium text-white">
                    {user.email}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Member since{" "}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Separator className="bg-gray-800" />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">User ID</span>
                  <span
                    className="text-white truncate max-w-[180px]"
                    title={user.id}
                  >
                    {user.id}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Subscription</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-purple-500/20">
                    <CreditCard className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Current Plan</h3>
                    <p className="text-sm text-gray-400">
                      Your active subscription
                    </p>
                  </div>
                </div>
                <Badge
                  className={`px-3 py-1 ${subscriptionStatus.isActive ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"}`}
                >
                  {subscriptionStatus.isActive ? "Active" : "Free Tier"}
                </Badge>
              </div>

              <Separator className="bg-gray-800" />

              <div className="space-y-4">
                <p className="text-gray-300">
                  {subscriptionStatus.isActive
                    ? `You are currently on the ${hasBusinessPlan() ? "Business" : "Premium"} plan. ${subscriptionStatus.trialActive ? "Your trial is active." : ""}`
                    : "Upgrade to our premium plan to unlock all features."}
                </p>
                {subscriptionStatus.isActive &&
                  subscriptionStatus.currentPeriodEnd && (
                    <p className="text-sm text-gray-400 mt-1">
                      Your subscription renews on{" "}
                      {new Date(
                        subscriptionStatus.currentPeriodEnd * 1000,
                      ).toLocaleDateString()}
                    </p>
                  )}
                <Button
                  className={`w-full mt-4 ${subscriptionStatus.isActive ? "bg-purple-600 hover:bg-purple-700" : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"}`}
                  onClick={async () => {
                    if (subscriptionStatus.isActive) {
                      setIsLoading(true);
                      try {
                        // Create a portal session for the user to manage their subscription
                        const { data, error } = await supabase.functions.invoke(
                          "create-customer-portal",
                          {
                            body: {
                              returnUrl: window.location.origin + "/profile",
                            },
                          },
                        );

                        if (error) throw error;
                        if (data?.url) {
                          window.location.href = data.url;
                        }
                      } catch (error) {
                        console.error("Error creating portal session:", error);
                      } finally {
                        setIsLoading(false);
                      }
                    } else {
                      // Redirect to pricing page
                      window.location.href = "/pricing";
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Loading..."
                  ) : subscriptionStatus.isActive ? (
                    <>
                      Manage Subscription{" "}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    "Upgrade Now"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 text-red-400 mr-2" />
                Account Security
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Your account security is important to us. You can delete your
                account at any time, but this action cannot be undone.
              </p>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-900 border-gray-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This action cannot be undone. This will permanently delete
                      your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={async (e) => {
                        e.preventDefault();
                        setIsDeletingAccount(true);
                        try {
                          const result = await deleteAccount();
                          if (result.success) {
                            toast({
                              title: "Account deleted",
                              description: result.message,
                              variant: "default",
                            });
                            // Redirect will happen automatically due to signOut()
                          } else {
                            throw new Error(
                              result.message || "Failed to delete account",
                            );
                          }
                        } catch (error: any) {
                          console.error("Error deleting account:", error);
                          toast({
                            title: "Error",
                            description:
                              error?.message || "An unexpected error occurred",
                            variant: "destructive",
                          });
                        } finally {
                          setIsDeletingAccount(false);
                        }
                      }}
                      disabled={isDeletingAccount}
                    >
                      {isDeletingAccount ? "Deleting..." : "Delete Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
          {/* Additional sections can be added here */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
