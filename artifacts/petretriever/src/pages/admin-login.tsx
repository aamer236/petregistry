import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartBar, Loader2, KeyRound, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { login } = useAdminAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsPending(true);
    // Simulate API Delay
    await new Promise(r => setTimeout(r, 1000));

    if (username === "admin" && password === "admin123") {
      login("mock_admin_token_2026", {
        id: "admin-1",
        username: "admin",
        name: "Super Administrator",
        role: "admin",
      });
      toast({
        title: "Login successful",
        description: "Welcome back, Administrator.",
      });
      navigate("/admin");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please attempt with admin/admin123.",
        variant: "destructive",
      });
    }
    setIsPending(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <ChartBar className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Platform Administration</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Access the admin dashboard to monitor system data and registrations
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Sign In as Admin
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/40 rounded-xl p-3">
              <KeyRound className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Admin Credentials</p>
                <p className="mt-0.5">Username: <code className="bg-muted px-1 rounded">admin</code></p>
                <p>Password: <code className="bg-muted px-1 rounded">admin123</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
