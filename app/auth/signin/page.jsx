"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import { AlertCircle, CheckCircle2, Circle, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { PASSWORD_REQUIREMENTS, validatePassword } from "@/lib/password-policy";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [verificationNotice, setVerificationNotice] = useState("");
  const [resendingVerification, setResendingVerification] = useState(false);

  useEffect(() => {
    if (session?.user && !isPending) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  // Clear transient error messages and ephemeral fields when toggling mode
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setErrorMessage("");
    setSuccessNotice("");
    setVerificationNotice("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setResendingVerification(false);
    setGoogleSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    if (googleSubmitting || submitting) return;
    setGoogleSubmitting(true);
    setErrorMessage("");
    setSuccessNotice("");
    setVerificationNotice("");
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      if (res?.error) {
        const msg = res.error.message || "Failed to sign in with Google. Please try again.";
        setErrorMessage(msg);
        toast.error(msg);
        setGoogleSubmitting(false);
      }
    } catch (err) {
      const msg = "An error occurred while connecting to Google. Please try again.";
      setErrorMessage(msg);
      toast.error(msg);
      setGoogleSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      const msg = "Please enter your email address to receive a verification link.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }
    setResendingVerification(true);
    setErrorMessage("");
    try {
      const res = await authClient.sendVerificationEmail({
        email: trimmedEmail,
        callbackURL: "/auth/verify?verified=true",
      });
      if (res?.error) {
        const msg = res.error.message || "Failed to resend verification email. Please try again later.";
        toast.error(msg);
        setErrorMessage(msg);
      } else {
        const msg = "If an unverified account exists for this email, a verification link has been sent.";
        toast.success(msg);
        setVerificationNotice(msg);
      }
    } catch (err) {
      const msg = "Failed to resend verification email. Please try again later.";
      toast.error(msg);
      setErrorMessage(msg);
    } finally {
      setResendingVerification(false);
    }
  };

  if (session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-foreground">
          <p className="text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (googleSubmitting || submitting) return;
    setErrorMessage("");
    setSuccessNotice("");
    setVerificationNotice("");

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !password) {
      const msg = "Please fill in all required fields.";
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (mode === "signup") {
      if (!trimmedName) {
        const msg = "Please enter your full name.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }

      const { isValid, error: pwError } = validatePassword(password);
      if (!isValid) {
        const msg = pwError || "Password does not meet complexity requirements.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }

      if (!confirmPassword) {
        const msg = "Please confirm your password.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }

      if (password !== confirmPassword) {
        const msg = "Passwords do not match.";
        setErrorMessage(msg);
        toast.error(msg);
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({
          email: trimmedEmail,
          password,
          confirmPassword,
          name: trimmedName,
          callbackURL: "/auth/verify?verified=true",
        });

        if (res?.error) {
          const err = res.error;
          if (
            err.code === "PASSWORD_TOO_WEAK" ||
            err.message?.toLowerCase().includes("weak") ||
            err.message?.toLowerCase().includes("complexity")
          ) {
            const msg = err.message || "Password does not meet security requirements.";
            setErrorMessage(msg);
            toast.error(msg);
          } else if (
            err.code === "PASSWORDS_DO_NOT_MATCH" ||
            err.message?.toLowerCase().includes("match")
          ) {
            const msg = "Passwords do not match. Please ensure both fields are identical.";
            setErrorMessage(msg);
            toast.error(msg);
          } else if (
            err.code === "INVALID_EMAIL" ||
            err.message?.toLowerCase().includes("invalid email")
          ) {
            const msg = "Please enter a valid email address.";
            setErrorMessage(msg);
            toast.error(msg);
          } else if (
            err.code === "PASSWORD_TOO_SHORT" ||
            err.message?.toLowerCase().includes("short")
          ) {
            const msg = "Password must be at least 8 characters long.";
            setErrorMessage(msg);
            toast.error(msg);
          } else if (
            err.code === "PASSWORD_TOO_LONG" ||
            err.message?.toLowerCase().includes("long")
          ) {
            const msg = "Password is too long. Please use fewer characters.";
            setErrorMessage(msg);
            toast.error(msg);
          } else if (
            err.code === "USER_ALREADY_EXISTS" ||
            err.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ||
            err.message?.toLowerCase().includes("already exists") ||
            err.status === 422
          ) {
            const msg = "An account with this email already exists. Please sign in instead.";
            setErrorMessage(msg);
            toast.error(msg);
          } else if (
            err.status >= 500 ||
            err.statusText?.toLowerCase().includes("server error") ||
            err.message?.toLowerCase().includes("credential") ||
            err.message?.toLowerCase().includes("internal")
          ) {
            // Server / database failure (HTTP 500+)
            const msg = "Account creation is temporarily unavailable. Please try again later.";
            setErrorMessage(msg);
            toast.error(msg);
          } else {
            const msg = "Failed to create account. Please check your details and try again.";
            setErrorMessage(msg);
            toast.error(msg);
          }
        } else {
          // Success: Only show success state if account creation actually succeeded
          const successMsg = "Account created. Please check your email and verify your address before signing in.";
          setSuccessNotice(successMsg);
          toast.success(successMsg, { duration: 8000 });
          setMode("signin");
          setPassword("");
          setConfirmPassword("");
          setShowPassword(false);
          setShowConfirmPassword(false);
        }
      } else {
        const res = await authClient.signIn.email({
          email: trimmedEmail,
          password,
          callbackURL: "/",
        });

        if (res?.error) {
          const err = res.error;
          if (
            err.code === "EMAIL_NOT_VERIFIED" ||
            err.status === 403 ||
            err.message?.toLowerCase().includes("verify")
          ) {
            const msg = "Please verify your email address before signing in. A verification link was sent to your email.";
            setVerificationNotice(msg);
            toast.error(msg);
          } else if (
            err.code === "INVALID_EMAIL" ||
            err.message?.toLowerCase().includes("invalid email")
          ) {
            const msg = "Please enter a valid email address.";
            setErrorMessage(msg);
            toast.error(msg);
          } else if (
            err.code === "INVALID_CREDENTIALS" ||
            err.code === "INVALID_PASSWORD" ||
            err.code === "INVALID_EMAIL_OR_PASSWORD" ||
            err.status === 400 ||
            err.status === 401
          ) {
            const msg = "Invalid email or password. Please check your credentials.";
            setErrorMessage(msg);
            toast.error(msg);
          } else if (
            err.status >= 500 ||
            err.statusText?.toLowerCase().includes("server error")
          ) {
            const msg = "Sign-in is temporarily unavailable. Please try again later.";
            setErrorMessage(msg);
            toast.error(msg);
          } else {
            const msg = "Failed to sign in. Please check your credentials and try again.";
            setErrorMessage(msg);
            toast.error(msg);
          }
        } else {
          toast.success("Signed in successfully!");
          router.push("/");
        }
      }
    } catch (err) {
      // Safe generic message without exposing internal stack traces
      const msg = mode === "signup"
        ? "Account creation is temporarily unavailable. Please try again later."
        : "Failed to sign in. Please try again later.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-background text-foreground">
      <NavBar />

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header Branding */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="flex items-center gap-2.5">
              <Image
                src="/assets/gdg.svg"
                alt="GDG Logo"
                width={36}
                height={36}
                className="h-9 w-9"
                priority
              />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                Recruitment 2026
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Candidate Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to manage and review your department applications"
                : "Create your candidate profile to begin your application"}
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex rounded-lg border border-border bg-muted/50 p-1">
            <button
              type="button"
              disabled={submitting || googleSubmitting}
              onClick={() => handleModeChange("signin")}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                mode === "signin"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              } ${submitting || googleSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              Sign In
            </button>
            <button
              type="button"
              disabled={submitting || googleSubmitting}
              onClick={() => handleModeChange("signup")}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                mode === "signup"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              } ${submitting || googleSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              Create Account
            </button>
          </div>

          {/* Authentication Card */}
          <Card className="border border-border shadow-sm bg-card">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold text-card-foreground">
                {mode === "signin" ? "Sign In" : "Create an Account"}
              </CardTitle>
              <CardDescription>
                {mode === "signin"
                  ? "Enter your email and password to access your portal."
                  : "Fill out the fields below to register as a candidate."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Success Banner (e.g. post-account creation) */}
              {successNotice && (
                <div
                  role="status"
                  className="flex items-start gap-2.5 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  <div className="leading-snug">
                    <p className="font-semibold">Account created</p>
                    <p className="mt-0.5 text-xs text-emerald-600/90 dark:text-emerald-400/90">
                      Please check your email and verify your address before signing in.
                    </p>
                  </div>
                </div>
              )}

              {/* Email Verification Required Banner */}
              {verificationNotice && (
                <div
                  role="alert"
                  className="flex flex-col gap-2.5 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-sm"
                >
                  <div className="flex items-start gap-2.5">
                    <Mail className="h-5 w-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <div className="leading-snug">
                      <p className="font-semibold">Email Verification Required</p>
                      <p className="mt-0.5 text-xs text-amber-700/90 dark:text-amber-300/90">
                        {verificationNotice}
                      </p>
                    </div>
                  </div>
                  <div className="pt-0.5 pl-7">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={resendingVerification || submitting || googleSubmitting}
                      onClick={handleResendVerification}
                      className="h-8 text-xs font-medium border-amber-500/30 hover:bg-amber-500/10 text-amber-800 dark:text-amber-300"
                    >
                      {resendingVerification ? (
                        <span className="flex items-center gap-1.5">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Resending...</span>
                        </span>
                      ) : (
                        <span>Resend verification email</span>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Error Banner */}
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="leading-snug text-xs sm:text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Google Sign In */}
              <Button
                type="button"
                variant="outline"
                disabled={googleSubmitting || submitting}
                onClick={handleGoogleSignIn}
                className="w-full font-medium flex items-center justify-center gap-2.5 border-border hover:bg-muted/50 transition-all shadow-sm h-10"
              >
                {googleSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <FcGoogle className="h-4 w-4 shrink-0 text-base" />
                )}
                <span>{googleSubmitting ? "Connecting to Google..." : "Continue with Google"}</span>
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                      disabled={submitting || googleSubmitting}
                      className="focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="candidate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={submitting || googleSubmitting}
                    className="focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      disabled={submitting || googleSubmitting}
                      className="pr-10 focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={submitting || googleSubmitting}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-r-md transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  {mode === "signup" && (
                    <div className="pt-1.5 pb-1 space-y-1.5" role="region" aria-label="Password requirements checklist">
                      <p className="text-xs font-medium text-muted-foreground">
                        Password must satisfy:
                      </p>
                      <ul className="space-y-1 text-xs" role="list">
                        {PASSWORD_REQUIREMENTS.map((req) => {
                          const isMet = req.test(password);
                          return (
                            <li
                              key={req.id}
                              role="listitem"
                              className={`flex items-center gap-2 transition-colors ${
                                isMet
                                  ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                  : "text-muted-foreground"
                              }`}
                              aria-label={`${req.label}: ${isMet ? "Satisfied" : "Unmet"}`}
                            >
                              {isMet ? (
                                <CheckCircle2
                                  className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Circle
                                  className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60"
                                  aria-hidden="true"
                                />
                              )}
                              <span>{req.label}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        disabled={submitting || googleSubmitting}
                        className={`pr-10 focus-visible:ring-2 focus-visible:ring-primary ${
                          confirmPassword && confirmPassword !== password
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={submitting || googleSubmitting}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-r-md transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        Passwords do not match.
                      </p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting || googleSubmitting}
                  className="w-full font-medium transition-all shadow-sm"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{mode === "signin" ? "Signing In..." : "Creating Account..."}</span>
                    </span>
                  ) : (
                    <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center justify-center border-t border-border/50 pt-4 pb-4">
              <button
                type="button"
                disabled={submitting || googleSubmitting}
                onClick={() => handleModeChange(mode === "signin" ? "signup" : "signin")}
                className={`text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors ${
                  submitting || googleSubmitting ? "opacity-60 cursor-not-allowed pointer-events-none" : ""
                }`}
              >
                {mode === "signin"
                  ? "Don't have an account yet? Create an account"
                  : "Already have an account? Sign in here"}
              </button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
