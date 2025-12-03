"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const RequireAuth: React.FC<{ children: React.ReactNode; redirectTo?: string }> = ({
  children,
  redirectTo = "/auth",
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setChecking(false);
      return;
    }
    setChecking(false);
    logout();
    const t = setTimeout(() => router.push(redirectTo), 600);
    return () => clearTimeout(t);
  }, [isAuthenticated, logout, router, redirectTo]);

  if (isAuthenticated && user) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Access restricted</CardTitle>
          <CardDescription>You need to sign in to access the invoice generator.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm text-muted-foreground">Checking session…</p>
          </div>

          <div className="w-full flex justify-center gap-2">
            <Button onClick={() => router.push(redirectTo)}>Go to Sign in</Button>
            <Button variant="outline" onClick={() => { logout(); router.push(redirectTo); }}>
              Sign out & Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
