import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/layout";
import { LandingPage } from "@/pages/landing";
import { RegisterPage } from "@/pages/register";
import { VerifyPage } from "@/pages/verify";
import { PetProfilePage } from "@/pages/pet-profile";
import { VetDashboardPage } from "@/pages/vet-dashboard";
import { VetLoginPage } from "@/pages/vet-login";
import { AdminDashboardPage } from "@/pages/admin-dashboard";
import { AdminLoginPage } from "@/pages/admin-login";
import { AdminAuthProvider, useAdminAuth } from "@/hooks/use-admin-auth";
import { VetAuthProvider, useVetAuth } from "@/hooks/use-vet-auth";

const queryClient = new QueryClient();

function AdminProtectedRoute() {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <AdminLoginPage />;
  return <AdminDashboardPage />;
}

function VetProtectedRoute() {
  const { isAuthenticated } = useVetAuth();
  if (!isAuthenticated) return <VetLoginPage />;
  return <VetDashboardPage />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/verify" component={VerifyPage} />
        <Route path="/pet/:id" component={PetProfilePage} />
        <Route path="/vet" component={VetProtectedRoute} />
        <Route path="/admin" component={AdminProtectedRoute} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminAuthProvider>
          <VetAuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </VetAuthProvider>
        </AdminAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
