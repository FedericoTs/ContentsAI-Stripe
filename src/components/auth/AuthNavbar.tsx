import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const AuthNavbar = () => {
  return (
    <header className="w-full py-4 px-6 bg-black/60 backdrop-blur-md border-b border-white/10 fixed top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur-sm opacity-70" />
              <div className="relative bg-black/50 backdrop-blur-md rounded-lg p-1.5 border border-white/10">
                <Zap className="h-5 w-5 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400" />
              </div>
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              ContentSphere
            </span>
          </Link>
          <Link to="/">
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AuthNavbar;
