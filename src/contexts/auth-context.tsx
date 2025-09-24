"use client";

import type { ReactNode } from "react";
import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User, UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password_or_role: string, as_role: UserRole) => boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("ticketyUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((username: string, password_or_role: string, as_role: UserRole) => {
    let success = false;
    if (as_role === 'admin' && username === 'admin' && password_or_role === 'admin123') {
      const adminUser: User = { username, role: 'admin' };
      setUser(adminUser);
      localStorage.setItem('ticketyUser', JSON.stringify(adminUser));
      router.push('/dashboard');
      success = true;
    } else if (as_role === 'user' && username === 'user' && password_or_role === 'user123') {
      const regularUser: User = { username, role: 'user' };
      setUser(regularUser);
      localStorage.setItem('ticketyUser', JSON.stringify(regularUser));
      router.push('/request');
      success = true;
    }
    return success;
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("ticketyUser");
    router.push("/login");
  }, [router]);

  if (loading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
     );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
