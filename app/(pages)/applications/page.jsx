"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { authClient } from "@/lib/auth-client";
import { getDepartmentDisplayName } from "@/lib/departments";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Clock, AlertCircle, ArrowRight, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";

export default function StudentApplicationsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async (showToast = false) => {
    try {
      setError(null);
      const res = await fetch("/api/get-submissions");
      if (res.status === 401) {
        setApplications([]);
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to load applications");
      }
      const json = await res.json();
      setApplications(Array.isArray(json?.data) ? json.data : []);
      if (showToast) {
        toast.success("Applications updated");
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.message || "Failed to load applications");
      if (showToast) {
        toast.error("Failed to refresh applications");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        fetchApplications();
      } else {
        setIsLoading(false);
      }
    }
  }, [isPending, session?.user, fetchApplications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchApplications(true);
  };

  const formatDate = (isoString) => {
    if (!isoString) return null;
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return null;
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-background text-foreground">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Page Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                Candidate Portal
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                My Applications
              </h1>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Track the status and details of your submitted department applications.
              </p>
            </div>

            {session?.user && !isLoading && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="self-start sm:self-auto flex items-center gap-2 text-xs font-medium"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>Refresh Status</span>
              </Button>
            )}
          </div>
        </header>

        {/* Loading State */}
        {(isPending || isLoading) && (
          <div className="space-y-4">
            <div className="h-32 rounded-xl border border-border bg-card/60 animate-pulse p-6" />
            <div className="h-32 rounded-xl border border-border bg-card/60 animate-pulse p-6" />
          </div>
        )}

        {/* Unauthenticated State */}
        {!isPending && !isLoading && !session?.user && (
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm max-w-lg mx-auto">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">Authentication Required</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Please sign in with your applicant account to view your application status.
            </p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        )}

        {/* Authenticated State */}
        {!isPending && !isLoading && session?.user && (
          <div className="space-y-6">
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Empty State: 0 Applications */}
            {applications.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center shadow-sm">
                <div className="mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">No Applications Submitted</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  You haven&apos;t submitted any department applications yet. You can apply to up to two departments.
                </p>
                <Button asChild>
                  <Link href="/departments" className="flex items-center gap-2">
                    <span>Explore Departments</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Applications List */}
            {applications.length > 0 && (
              <div className="space-y-4">
                {applications.map((app, index) => {
                  const deptDisplay = getDepartmentDisplayName(app.Department) || app.Department || "Unassigned";
                  const formattedSubmissionDate = formatDate(app.createdAt);
                  const isShortlisted = Boolean(app.shortlisted);

                  return (
                    <div
                      key={app.id || index}
                      className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-border/80"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-lg font-bold text-foreground">
                              {deptDisplay}
                            </h3>

                            {/* Priority Badge */}
                            {app.priority === 1 || app.priority === "1" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                                Priority 1
                              </span>
                            ) : app.priority === 2 || app.priority === "2" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
                                Priority 2
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs text-muted-foreground/70 italic border border-dashed border-border/70">
                                Priority: Not set
                              </span>
                            )}
                          </div>

                          {formattedSubmissionDate && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Submitted on {formattedSubmissionDate}</span>
                            </p>
                          )}
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap sm:flex-col sm:items-end gap-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Application Submitted</span>
                          </div>

                          {/* Shortlist Status */}
                          {isShortlisted ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                              <span>Shortlisted</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                              <span>Under Review</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Explanation */}
                      <div className="mt-4 pt-4 border-t border-border/60 flex items-start gap-2.5 text-xs text-muted-foreground">
                        {isShortlisted ? (
                          <p className="text-emerald-700 dark:text-emerald-300">
                            🎉 Congratulations! You have been shortlisted for this department. Further communication will be shared soon.
                          </p>
                        ) : (
                          <p>
                            Your application has been received and is currently under review by our department leads.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Slots info card */}
                {applications.length === 1 && (
                  <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-foreground">1 of 2 Applications Submitted</span>
                      <p className="text-muted-foreground mt-0.5">
                        You can submit 1 more application if you wish to apply for another department.
                      </p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="shrink-0 text-xs">
                      <Link href="/departments" className="flex items-center gap-1.5">
                        <span>Browse Departments</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                )}

                {applications.length >= 2 && (
                  <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-center text-muted-foreground">
                    You have reached the maximum allowed (2) applications. Thank you for applying!
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
