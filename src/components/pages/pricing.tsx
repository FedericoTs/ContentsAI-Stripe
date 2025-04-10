import React from "react";
import PricingSection from "../home/PricingSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

const Pricing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="font-bold text-xl flex items-center text-black"
            >
              Tempo Starter Kit
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-black"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-black"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="mb-12 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
              Choose Your Plan
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your needs. Upgrade or downgrade at
              any time.
            </p>
          </div>

          <PricingSection />
        </div>
      </main>
    </div>
  );
};

export default Pricing;
