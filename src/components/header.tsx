"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Logo } from "./icons";

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="bg-card border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Coswin+
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Se déconnecter">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
