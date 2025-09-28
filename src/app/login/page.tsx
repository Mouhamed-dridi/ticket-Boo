"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UserRole } from "@/lib/types";
import { Logo } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");

  useEffect(() => {
    if (user) {
      router.replace(user.role === 'admin' ? '/dashboard' : '/request');
    }
  }, [user, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password, role);
    if (!success) {
      toast({
        variant: "destructive",
        title: "Échec de la connexion",
        description: "Nom d'utilisateur ou mot de passe invalide. Veuillez réessayer.",
      });
    }
  };

  const LoginForm = (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nom d'utilisateur</Label>
        <Input
          id="username"
          placeholder={role === "admin" ? "" : "user"}
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder={role === "admin" ? "" : "user123"}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
        Se connecter
      </Button>
    </form>
  );

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Tabs
        defaultValue="user"
        className="w-full max-w-sm"
        onValueChange={(value) => setRole(value as UserRole)}
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Logo className="h-12 w-12 text-primary"/>
            </div>
            <CardTitle className="text-2xl font-bold">Tickety Boo</CardTitle>
            <CardDescription>
              Connectez-vous pour gérer vos tickets informatiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">Utilisateur</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="user">{LoginForm}</TabsContent>
            <TabsContent value="admin">{LoginForm}</TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </main>
  );
}
