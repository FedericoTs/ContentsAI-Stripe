import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "../../../supabase/auth";
import { Users, Mail, Plus, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Team() {
  const { user, subscriptionStatus } = useAuth();

  // This would be determined by subscription type in the future
  const maxTeamMembers = 3;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Team Management</h1>
        <p className="text-white/70">
          Invite team members to collaborate on your projects
        </p>
      </div>

      <Card className="bg-black/40 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Team Members</span>
          </CardTitle>
          <CardDescription className="text-white/70">
            You can invite up to {maxTeamMembers} team members with your current
            plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-purple-500/10 border-purple-500/20 text-purple-300">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Coming Soon</AlertTitle>
            <AlertDescription>
              Team management functionality will be available soon. Stay tuned!
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 border border-gray-800 rounded-md bg-gray-900/50">
              <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1">
                <p className="font-medium">{user?.email}</p>
                <p className="text-sm text-white/50">Owner (You)</p>
              </div>
            </div>

            {/* Placeholder for future team members list */}
            <div className="border border-dashed border-gray-700 rounded-md p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-2 text-sm font-semibold">
                Invite team members
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                You haven't invited any team members yet.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:items-center border-t border-white/10 pt-4">
          <div className="flex-1 space-y-1">
            <div className="text-sm text-white/50">
              <span className="font-medium">1</span> of{" "}
              <span className="font-medium">{maxTeamMembers}</span> team members
              used
            </div>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <Input
              type="email"
              placeholder="colleague@example.com"
              className="h-9 w-full sm:w-[240px] bg-gray-900 border-gray-700"
              disabled
            />
            <Button className="h-9" disabled>
              <Mail className="mr-2 h-4 w-4" />
              Invite
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
