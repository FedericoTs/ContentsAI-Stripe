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
import { AuthProvider, useAuth } from "../supabase/auth";
import { Toaster } from "./components/ui/toaster";

function PrivateRoute({
  children,
  path,
}: {
  children: React.ReactNode;
  path?: string;
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

  // Always allow access to protected routes
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
        <Route
          path="/schedule"
          element={
            <PrivateRoute path="/schedule">
              <Schedule />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute path="/dashboard">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/team"
          element={
            <PrivateRoute path="/team">
              <Team />
            </PrivateRoute>
          }
        />
        <Route
          path="/content"
          element={
            <PrivateRoute path="/content">
              <Content />
            </PrivateRoute>
          }
        />
        <Route
          path="/archive"
          element={
            <PrivateRoute path="/archive">
              <Archive />
            </PrivateRoute>
          }
        />
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
