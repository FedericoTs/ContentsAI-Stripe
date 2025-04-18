import { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import Pricing from "./components/pages/pricing";
import Team from "./components/pages/team";
import Content from "./components/pages/content";
import Archive from "./components/pages/archive";
import Schedule from "./components/pages/schedule";
import Profile from "./components/pages/profile";
import { AuthProvider, useAuth } from "../supabase/auth";
import { Toaster } from "./components/ui/toaster";
import DashboardLayout from "./components/dashboard/layout/DashboardLayout";

function PrivateRoute({
  children,
  path,
  requireSubscription = true,
}: {
  children: React.ReactNode;
  path?: string;
  requireSubscription?: boolean;
}) {
  const { user, loading, subscriptionStatus } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // For debugging - log the subscription status
  console.log("Subscription status:", subscriptionStatus);

  // Check if the user has an active subscription when required
  if (requireSubscription && !subscriptionStatus.isActive) {
    console.log(
      "User does not have an active subscription, redirecting to pricing",
    );
    return <Navigate to="/pricing" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  // Use the routes from tempo-routes when in Tempo environment
  const tempoRoutesElement =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <>
      {tempoRoutesElement}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/success" element={<Success />} />

        {/* Profile route - accessible without subscription */}
        <Route
          path="/profile"
          element={
            <PrivateRoute requireSubscription={false}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Profile />} />
        </Route>

        {/* Dashboard layout with nested routes - requires subscription */}
        <Route
          path="/"
          element={
            <PrivateRoute requireSubscription={true}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="team" element={<Team />} />
          <Route path="content" element={<Content />} />
          <Route path="archive" element={<Archive />} />
          <Route path="schedule" element={<Schedule />} />
        </Route>

        {/* Add a route for Tempo storyboards if in Tempo environment */}
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={null} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <AppRoutes />
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
