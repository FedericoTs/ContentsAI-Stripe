import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type SubscriptionStatus = {
  isActive: boolean;
  trialActive: boolean;
  currentPeriodEnd: number | null;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  subscriptionStatus: SubscriptionStatus;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasBusinessPlan: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus>({
      isActive: false,
      trialActive: false,
      currentPeriodEnd: null,
    });

  // Function to check subscription status
  const checkSubscriptionStatus = async (userId: string) => {
    try {
      const { data: subscriptions, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching subscription:", error);
        return;
      }

      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const subscription = subscriptions?.[0];

      if (subscription) {
        // Check if subscription is active
        const isActive =
          subscription.status === "active" &&
          subscription.current_period_end > now;

        // Check if in trial period
        const trialActive =
          subscription.status === "trialing" ||
          (subscription.trial_end && subscription.trial_end > now);

        setSubscriptionStatus({
          isActive,
          trialActive,
          currentPeriodEnd: subscription.current_period_end,
        });
      } else {
        setSubscriptionStatus({
          isActive: false,
          trialActive: false,
          currentPeriodEnd: null,
        });
      }
    } catch (err) {
      console.error("Error checking subscription status:", err);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        checkSubscriptionStatus(currentUser.id);
      }

      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        checkSubscriptionStatus(currentUser.id);
      } else {
        // Reset subscription status when user signs out
        setSubscriptionStatus({
          isActive: false,
          trialActive: false,
          currentPeriodEnd: null,
        });
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Function to check if user has a Business Plan subscription
  const hasBusinessPlan = () => {
    // Check if user has an active subscription
    if (!subscriptionStatus.isActive) return false;

    // In a real implementation, you would check the specific plan ID or name
    // For now, we'll assume any active subscription with a current period end date
    // that's more than 30 days from now is a Business Plan
    if (subscriptionStatus.currentPeriodEnd) {
      const thirtyDaysFromNow =
        Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
      return subscriptionStatus.currentPeriodEnd > thirtyDaysFromNow;
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        subscriptionStatus,
        signIn,
        signUp,
        signOut,
        hasBusinessPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
