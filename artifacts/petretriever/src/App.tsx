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
import { AdminDashboardPage } from "@/pages/admin-dashboard";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/verify" component={VerifyPage} />
        <Route path="/pet/:id" component={PetProfilePage} />
        <Route path="/vet" component={VetDashboardPage} />
        <Route path="/admin" component={AdminDashboardPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
