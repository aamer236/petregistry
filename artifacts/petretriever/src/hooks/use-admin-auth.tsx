import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: "admin";
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  token: string | null;
  login: (token: string, admin: AdminUser) => void;
  logout: (reason?: string) => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const ADMIN_TOKEN_KEY = "petretriever_admin_token";
const ADMIN_USER_KEY = "petretriever_admin_user";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem(ADMIN_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const { toast } = useToast();
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback((reason?: string) => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    setToken(null);
    setAdmin(null);
    if (reason && typeof reason === "string") {
      toast({
        title: "Session Expired",
        description: reason,
        variant: "destructive",
      });
    }
  }, [toast]);

  const login = (newToken: string, newAdmin: AdminUser) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(newAdmin));
    setToken(newToken);
    setAdmin(newAdmin);
  };

  useEffect(() => {
    // Only track inactivity if the admin is logged in
    if (!token || !admin) return;

    const INACTIVITY_LIMIT = 15 * 60 *1000; // 15 minutes

    const resetTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      inactivityTimerRef.current = setTimeout(() => {
        logout("You have been logged out due to 15 minutes of inactivity.");
      }, INACTIVITY_LIMIT);
    };

    // Initialize timer
    resetTimer();

    // Listen for user interactions globally to reset the inactivity timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer, { passive: true }));

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [token, admin, logout]);

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout, isAuthenticated: !!token && !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
