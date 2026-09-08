"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const performSignOut = async () => {
      try {
        await authClient.signOut();
        const sessionAtom = authClient.$store?.atoms?.session;
        if (sessionAtom) {
          sessionAtom.set({
            data: null,
            error: null,
            isPending: false,
            isRefetching: false,
            refetch: sessionAtom.get()?.refetch,
          });
        }
        if (mounted) {
          toast.success("Signed out successfully");
          router.replace("/auth/signin");
          router.refresh();
        }
      } catch (error) {
        console.error("Sign out error:", error);
        if (mounted) {
          toast.error("Failed to sign out");
          router.replace("/auth/signin");
          router.refresh();
        }
      }
    };

    performSignOut();
    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Signing out...</p>
      </div>
    </div>
  );
} 