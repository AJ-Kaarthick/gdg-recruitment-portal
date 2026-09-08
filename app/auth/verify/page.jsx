"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  Mail,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorParam = searchParams.get("error");
  const isVerifiedParam = searchParams.get("verified") === "true";

  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");
  const [countdown, setCountdown] = useState(3);

  // Automatic redirection for authenticated users after successful verification
  useEffect(() => {
    if (!errorParam && !isSessionPending && session?.user && isVerifiedParam) {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        router.replace("/");
      }
    }
  }, [countdown, errorParam, isSessionPending, session, isVerifiedParam, router]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    const trimmed = resendEmail.trim();
    if (!trimmed) {
      const msg = "Please enter your email address.";
      setResendError(msg);
      toast.error(msg);
      return;
    }

    setResending(true);
    setResendError("");
    setResendSuccess("");

    try {
      const res = await authClient.sendVerificationEmail({
        email: trimmed,
        callbackURL: "/auth/verify?verified=true",
      });

      if (res?.error) {
        const msg = res.error.message || "Failed to resend verification email. Please try again later.";
        setResendError(msg);
        toast.error(msg);
      } else {
        const msg = "If an account exists for this email, a fresh verification link has been sent.";
        setResendSuccess(msg);
        toast.success(msg);
        setResendEmail("");
      }
    } catch {
      const msg = "Failed to resend verification email. Please try again later.";
      setResendError(msg);
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  const ResendForm = () => (
    <form onSubmit={handleResendVerification} className="w-full space-y-3 mt-4 text-left">
      <div className="space-y-1.5">
        <Label htmlFor="resend-email" className="text-xs font-medium text-muted-foreground">
          Email address
        </Label>
        <Input
          id="resend-email"
          type="email"
          placeholder="name@example.com"
          value={resendEmail}
          onChange={(e) => setResendEmail(e.target.value)}
          disabled={resending}
          className="h-10"
        />
      </div>

      {resendSuccess && (
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-600 dark:text-emerald-400">
          {resendSuccess}
        </div>
      )}

      {resendError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
          {resendError}
        </div>
      )}

      <Button type="submit" className="w-full h-10 font-medium" disabled={resending}>
        {resending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending link...
          </>
        ) : (
          "Request new verification email"
        )}
      </Button>
    </form>
  );

  // Loading state while checking session and parameters
  if (isSessionPending && !errorParam) {
    return (
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Confirming verification
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Checking your verification status, please wait a moment...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Error case 1: Token Expired
  if (errorParam === "TOKEN_EXPIRED") {
    return (
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-3 ring-8 ring-amber-500/5">
            <Clock className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Verification link expired
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            This verification link is no longer valid. For security, verification links expire after 1 hour.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground text-center">
            Enter your email address below to receive a new verification link.
          </p>
          <ResendForm />
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border/40">
          <Button
            variant="outline"
            className="w-full h-10"
            onClick={() => router.push("/auth/signin")}
          >
            Return to sign in
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Error case 2: Invalid Token or Already Used
  if (errorParam === "INVALID_TOKEN") {
    return (
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3 ring-8 ring-destructive/5">
            <AlertCircle className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Link invalid or already used
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            This verification link is invalid or has already been used. If your account is already verified, you can sign in directly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <p className="text-xs text-muted-foreground text-center">
            Need a fresh link? Enter your email to resend verification.
          </p>
          <ResendForm />
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border/40">
          <Button
            variant="default"
            className="w-full h-10"
            onClick={() => router.push("/auth/signin")}
          >
            Go to sign in
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Error case 3: User Not Found
  if (errorParam === "USER_NOT_FOUND") {
    return (
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3 ring-8 ring-destructive/5">
            <AlertCircle className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Account not found
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            We could not find an account associated with this verification link. Please register to create an account.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-2 pt-4">
          <Button
            className="w-full h-10"
            onClick={() => router.push("/auth/signin")}
          >
            Create an account
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Error case 4: Generic / Unexpected Error
  if (errorParam) {
    return (
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3 ring-8 ring-destructive/5">
            <AlertCircle className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Verification issue
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Something went wrong while verifying your email. You can request a new verification link below or try signing in.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <ResendForm />
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border/40">
          <Button
            variant="outline"
            className="w-full h-10"
            onClick={() => router.push("/auth/signin")}
          >
            Return to sign in
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Success case A: Verification succeeded AND user has an active session (Automatic Sign-in)
  if (session?.user && (isVerifiedParam || session.user.emailVerified)) {
    return (
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 ring-8 ring-emerald-500/5">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Email verified successfully!
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Your email address has been verified.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center space-y-1.5">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              You&apos;re all set!
            </p>
            <p className="text-xs text-muted-foreground">
              Redirecting you to the Recruitment Portal in{" "}
              <span className="font-bold text-foreground">{countdown}s</span>...
            </p>
          </div>

          <Button
            className="w-full h-10 font-medium"
            onClick={() => router.replace("/")}
          >
            Continue to Recruitment Portal
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>

        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground text-center w-full">
            Opened this on another tab or device? You can safely close this window and return to your original tab.
          </p>
        </CardFooter>
      </Card>
    );
  }

  // Success case B: Verification succeeded WITHOUT an active session on this device/browser
  if (isVerifiedParam) {
    return (
      <Card className="w-full max-w-md border-border bg-card shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 ring-8 ring-emerald-500/5">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Email verified successfully!
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mt-1">
            Your email address has been verified.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="rounded-xl bg-muted/60 border border-border/80 p-4 text-center space-y-1.5">
            <p className="text-sm font-medium text-foreground">
              You can now return to the Recruitment Portal and sign in.
            </p>
            <p className="text-xs text-muted-foreground">
              You may safely close this verification tab.
            </p>
          </div>

          <Button
            className="w-full h-10 font-medium"
            onClick={() => router.push("/auth/signin")}
          >
            Sign in to Recruitment Portal
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>

        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground text-center w-full">
            If you already have the portal open in another window, simply refresh that window or sign in.
          </p>
        </CardFooter>
      </Card>
    );
  }

  // Direct visit / Neutral state (e.g. visiting /auth/verify directly without params)
  return (
    <Card className="w-full max-w-md border-border bg-card shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
          <Mail className="h-7 w-7" />
        </div>
        <CardTitle className="text-xl font-bold tracking-tight text-foreground">
          Email verification
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mt-1">
          Please check your email inbox for the verification link sent during registration.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        <p className="text-xs text-muted-foreground text-center">
          Didn&apos;t receive the email? Enter your email address below to resend the link.
        </p>
        <ResendForm />
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border/40">
        <Button
          variant="outline"
          className="w-full h-10"
          onClick={() => router.push("/auth/signin")}
        >
          Return to sign in
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-background text-foreground">
      <NavBar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense
          fallback={
            <Card className="w-full max-w-md border-border bg-card shadow-lg p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading verification status...</p>
            </Card>
          }
        >
          <VerifyContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
