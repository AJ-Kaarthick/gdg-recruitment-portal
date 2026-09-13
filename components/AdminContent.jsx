"use client";
import React, { useState, useEffect, useMemo } from "react";
import { authClient } from "@/lib/auth-client";
import DataTable from "./DataTable";
import { getDepartmentDisplayName } from "@/lib/departments";
import { normalizeStatus, RECRUITMENT_STATUS } from "@/lib/status";
import { GrPowerReset } from "react-icons/gr";
import { Button } from "./ui/button";

const AdminContent = ({ applicants = [] }) => {
  const { data: session, isPending } = authClient.useSession();
  const [data, setData] = useState(applicants);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedShortlist, setSelectedShortlist] = useState("");

  useEffect(() => {
    setData(applicants);
  }, [applicants]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDept("");
    setSelectedPriority("");
    setSelectedShortlist("");
  };

  const isFiltered = Boolean(
    searchQuery.trim() ||
    selectedDept ||
    selectedPriority ||
    selectedShortlist
  );

  // Client-side filtering without extra Firestore queries
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Department filter
      if (selectedDept && item.Department !== selectedDept) {
        return false;
      }

      // 2. Recruitment Status / Shortlist filter
      if (selectedShortlist) {
        const itemStatus = normalizeStatus(item);
        if (selectedShortlist === "true" && itemStatus !== RECRUITMENT_STATUS.SHORTLISTED) {
          return false;
        }
        if (selectedShortlist === "false" && itemStatus === RECRUITMENT_STATUS.SHORTLISTED) {
          return false;
        }
        if (
          [RECRUITMENT_STATUS.PENDING, RECRUITMENT_STATUS.SHORTLISTED, RECRUITMENT_STATUS.WAITLISTED, RECRUITMENT_STATUS.REJECTED].includes(selectedShortlist) &&
          itemStatus !== selectedShortlist
        ) {
          return false;
        }
      }

      // 3. Priority filter: P1, P2, or Not set
      if (selectedPriority === "1" && item.priority !== 1 && item.priority !== "1") {
        return false;
      }
      if (selectedPriority === "2" && item.priority !== 2 && item.priority !== "2") {
        return false;
      }
      if (
        selectedPriority === "not_set" &&
        (item.priority === 1 || item.priority === "1" || item.priority === 2 || item.priority === "2")
      ) {
        return false;
      }

      // 4. Search query across Name, Email, RegistrationNumber, Department
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = String(item.Name || "").toLowerCase();
        const email = String(item.Email || "").toLowerCase();
        const regNo = String(item.RegistrationNumber || "").toLowerCase();
        const rawDept = String(item.Department || "").toLowerCase();
        const displayDept = String(getDepartmentDisplayName(item.Department) || "").toLowerCase();

        const matches =
          name.includes(q) ||
          email.includes(q) ||
          regNo.includes(q) ||
          rawDept.includes(q) ||
          displayDept.includes(q);

        if (!matches) return false;
      }

      return true;
    });
  }, [data, selectedDept, selectedShortlist, selectedPriority, searchQuery]);

  // Analytics computed from filteredData
  const analytics = useMemo(() => {
    const totalApplications = filteredData.length;

    // Status Counts & Percentages
    let pendingCount = 0;
    let shortlistedCount = 0;
    let waitlistedCount = 0;
    let rejectedCount = 0;

    filteredData.forEach((a) => {
      const status = normalizeStatus(a);
      if (status === RECRUITMENT_STATUS.SHORTLISTED) shortlistedCount++;
      else if (status === RECRUITMENT_STATUS.WAITLISTED) waitlistedCount++;
      else if (status === RECRUITMENT_STATUS.REJECTED) rejectedCount++;
      else pendingCount++;
    });

    // Unique applicants identified using authenticated email, not by row count
    const uniqueApplicants = new Set(filteredData.map((a) => a.Email).filter(Boolean)).size;

    const shortlistRate =
      totalApplications > 0
        ? ((shortlistedCount / totalApplications) * 100).toFixed(1)
        : "0.0";

    const pendingRate = totalApplications > 0 ? ((pendingCount / totalApplications) * 100).toFixed(1) : "0.0";
    const waitlistedRate = totalApplications > 0 ? ((waitlistedCount / totalApplications) * 100).toFixed(1) : "0.0";
    const rejectedRate = totalApplications > 0 ? ((rejectedCount / totalApplications) * 100).toFixed(1) : "0.0";

    // Applications by Department
    const deptMap = {};
    filteredData.forEach((a) => {
      const dept = a.Department || "Unassigned";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    const departmentBreakdown = Object.entries(deptMap)
      .map(([deptKey, count]) => {
        const displayName = getDepartmentDisplayName(deptKey) || deptKey;
        const percentage =
          totalApplications > 0
            ? ((count / totalApplications) * 100).toFixed(1)
            : "0.0";
        return { deptKey, displayName, count, percentage: Number(percentage) };
      })
      .sort((a, b) => b.count - a.count);

    const maxDeptCount = departmentBreakdown.length > 0 ? departmentBreakdown[0].count : 1;

    // Priority Distribution: P1, P2, and Not set (legacy records)
    let p1Count = 0;
    let p2Count = 0;
    let notSetCount = 0;

    filteredData.forEach((a) => {
      if (a.priority === 1 || a.priority === "1") {
        p1Count++;
      } else if (a.priority === 2 || a.priority === "2") {
        p2Count++;
      } else {
        notSetCount++;
      }
    });

    const p1Percent = totalApplications > 0 ? ((p1Count / totalApplications) * 100).toFixed(1) : "0.0";
    const p2Percent = totalApplications > 0 ? ((p2Count / totalApplications) * 100).toFixed(1) : "0.0";
    const notSetPercent = totalApplications > 0 ? ((notSetCount / totalApplications) * 100).toFixed(1) : "0.0";

    return {
      totalApplications,
      shortlistedCount,
      uniqueApplicants,
      shortlistRate,
      statusCounts: {
        pending: { count: pendingCount, percentage: pendingRate },
        shortlisted: { count: shortlistedCount, percentage: shortlistRate },
        waitlisted: { count: waitlistedCount, percentage: waitlistedRate },
        rejected: { count: rejectedCount, percentage: rejectedRate },
      },
      departmentBreakdown,
      maxDeptCount,
      priorityDistribution: {
        p1: { count: p1Count, percentage: p1Percent },
        p2: { count: p2Count, percentage: p2Percent },
        notSet: { count: notSetCount, percentage: notSetPercent },
      },
    };
  }, [filteredData]);

  if (isPending) {
    return (
      <div className="w-full space-y-6 p-4 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 bg-muted/60 rounded-xl border border-border/50"></div>
          <div className="h-24 bg-muted/60 rounded-xl border border-border/50"></div>
          <div className="h-24 bg-muted/60 rounded-xl border border-border/50"></div>
          <div className="h-24 bg-muted/60 rounded-xl border border-border/50"></div>
        </div>
        <div className="h-96 bg-muted/40 rounded-xl border border-border/50 p-4 space-y-4">
          <div className="h-10 bg-muted/60 rounded-lg w-1/3"></div>
          <div className="h-64 bg-muted/30 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-4">Please sign in to access the admin panel.</p>
        <button
          type="button"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
          onClick={() => {
            window.location.href = "/auth/signin";
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  if (session.user.role !== "admin") {
    return (
      <div className="p-8 text-center text-destructive font-semibold">
        Access Denied! You are not authorized to view this webpage.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Filter Indicator */}
      {isFiltered && (
        <div className="mx-1 px-4 py-2.5 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">Filtered View Active:</span>
            <span className="text-muted-foreground">
              Showing <strong className="text-foreground">{filteredData.length}</strong> of{" "}
              <strong className="text-foreground">{data.length}</strong> total applications
            </span>
          </div>
          <Button
            onClick={handleResetFilters}
            variant="ghost"
            size="sm"
            className="h-7 text-xs flex items-center gap-1.5 hover:bg-primary/10 text-primary"
          >
            <GrPowerReset className="h-3 w-3" />
            <span>Reset All</span>
          </Button>
        </div>
      )}

      {/* Primary Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-1">
        {/* A. Total Applications */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Applications
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-foreground">
              {analytics.totalApplications}
            </span>
            <span className="text-xs text-muted-foreground">
              {isFiltered ? `of ${data.length} total` : "submissions"}
            </span>
          </div>
        </div>

        {/* B. Unique Applicants */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Unique Applicants
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {analytics.uniqueApplicants}
            </span>
            <span className="text-xs text-muted-foreground">individual students</span>
          </div>
        </div>

        {/* C. Shortlisted Applications */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Shortlisted Applications
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {analytics.shortlistedCount}
            </span>
            <span className="text-xs text-emerald-600/80 dark:text-emerald-500/80">
              {analytics.shortlistRate}% of current
            </span>
          </div>
        </div>

        {/* D. Decisions Breakdown */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Recruitment Decisions
          </span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Pending:</span>
              <span className="font-bold text-foreground">{analytics.statusCounts.pending.count}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Waitlist:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{analytics.statusCounts.waitlisted.count}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Shortlist:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{analytics.statusCounts.shortlisted.count}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Rejected:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{analytics.statusCounts.rejected.count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Breakdown: Applications by Department, Priority, and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-1">
        {/* 1. Applications by Department */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">By Department</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                {analytics.departmentBreakdown.length}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-1">
            {analytics.departmentBreakdown.length > 0 ? (
              analytics.departmentBreakdown.map((item) => {
                const barWidth =
                  analytics.maxDeptCount > 0
                    ? Math.max((item.count / analytics.maxDeptCount) * 100, 3)
                    : 0;

                return (
                  <div key={item.deptKey} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground truncate max-w-[180px]">
                        {item.displayName}
                      </span>
                      <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 font-mono text-[11px]">
                        <span className="font-bold text-foreground">{item.count}</span>
                        <span>({item.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No department applications.
              </p>
            )}
          </div>
        </div>

        {/* 2. Priority Distribution */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <span className="text-sm font-bold text-foreground">Priority Distribution</span>
              <span className="text-xs text-muted-foreground">
                Total: {analytics.totalApplications}
              </span>
            </div>

            {/* Segmented Distribution Bar */}
            <div className="mt-4">
              <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-muted/60">
                {analytics.totalApplications > 0 ? (
                  <>
                    <div
                      className="bg-blue-600 dark:bg-blue-500 transition-all duration-300"
                      style={{
                        width: `${analytics.priorityDistribution.p1.percentage}%`,
                      }}
                      title={`Priority 1: ${analytics.priorityDistribution.p1.count} (${analytics.priorityDistribution.p1.percentage}%)`}
                    />
                    <div
                      className="bg-indigo-600 dark:bg-indigo-400 transition-all duration-300"
                      style={{
                        width: `${analytics.priorityDistribution.p2.percentage}%`,
                      }}
                      title={`Priority 2: ${analytics.priorityDistribution.p2.count} (${analytics.priorityDistribution.p2.percentage}%)`}
                    />
                    <div
                      className="bg-zinc-400 dark:bg-zinc-500 transition-all duration-300"
                      style={{
                        width: `${analytics.priorityDistribution.notSet.percentage}%`,
                      }}
                      title={`Not set: ${analytics.priorityDistribution.notSet.count} (${analytics.priorityDistribution.notSet.percentage}%)`}
                    />
                  </>
                ) : (
                  <div className="w-full bg-muted/40" />
                )}
              </div>
            </div>

            {/* Priority Details Grid */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-2.5 text-center">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 block">P1</span>
                <div className="text-lg font-extrabold text-foreground mt-1">
                  {analytics.priorityDistribution.p1.count}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {analytics.priorityDistribution.p1.percentage}%
                </div>
              </div>

              <div className="rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-2.5 text-center">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">P2</span>
                <div className="text-lg font-extrabold text-foreground mt-1">
                  {analytics.priorityDistribution.p2.count}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {analytics.priorityDistribution.p2.percentage}%
                </div>
              </div>

              <div className="rounded-lg border border-border bg-muted/40 p-2.5 text-center">
                <span className="text-xs font-semibold text-muted-foreground block">Not set</span>
                <div className="text-lg font-extrabold text-foreground mt-1">
                  {analytics.priorityDistribution.notSet.count}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {analytics.priorityDistribution.notSet.percentage}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
            P1/P2 assigned during candidate preference selection.
          </div>
        </div>

        {/* 3. Decision Status Breakdown */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <span className="text-sm font-bold text-foreground">Status Breakdown</span>
              <span className="text-xs text-muted-foreground">
                Total: {analytics.totalApplications}
              </span>
            </div>

            {/* Segmented Status Bar */}
            <div className="mt-4">
              <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-muted/60">
                {analytics.totalApplications > 0 ? (
                  <>
                    <div
                      className="bg-blue-500 transition-all duration-300"
                      style={{ width: `${analytics.statusCounts.pending.percentage}%` }}
                      title={`Pending: ${analytics.statusCounts.pending.count} (${analytics.statusCounts.pending.percentage}%)`}
                    />
                    <div
                      className="bg-emerald-600 transition-all duration-300"
                      style={{ width: `${analytics.statusCounts.shortlisted.percentage}%` }}
                      title={`Shortlisted: ${analytics.statusCounts.shortlisted.count} (${analytics.statusCounts.shortlisted.percentage}%)`}
                    />
                    <div
                      className="bg-amber-500 transition-all duration-300"
                      style={{ width: `${analytics.statusCounts.waitlisted.percentage}%` }}
                      title={`Waitlisted: ${analytics.statusCounts.waitlisted.count} (${analytics.statusCounts.waitlisted.percentage}%)`}
                    />
                    <div
                      className="bg-rose-500 transition-all duration-300"
                      style={{ width: `${analytics.statusCounts.rejected.percentage}%` }}
                      title={`Rejected: ${analytics.statusCounts.rejected.count} (${analytics.statusCounts.rejected.percentage}%)`}
                    />
                  </>
                ) : (
                  <div className="w-full bg-muted/40" />
                )}
              </div>
            </div>

            {/* Status Grid */}
            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-2 text-center">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Pending</span>
                <div className="text-base font-bold text-foreground mt-0.5">
                  {analytics.statusCounts.pending.count}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {analytics.statusCounts.pending.percentage}%
                </div>
              </div>

              <div className="rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-2 text-center">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Shortlisted</span>
                <div className="text-base font-bold text-foreground mt-0.5">
                  {analytics.statusCounts.shortlisted.count}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {analytics.statusCounts.shortlisted.percentage}%
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-2 text-center">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Waitlisted</span>
                <div className="text-base font-bold text-foreground mt-0.5">
                  {analytics.statusCounts.waitlisted.count}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {analytics.statusCounts.waitlisted.percentage}%
                </div>
              </div>

              <div className="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 p-2 text-center">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">Rejected</span>
                <div className="text-base font-bold text-foreground mt-0.5">
                  {analytics.statusCounts.rejected.count}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {analytics.statusCounts.rejected.percentage}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
            % represents share of current {analytics.totalApplications} filtered application(s).
          </div>
        </div>
      </div>

      {/* Admin DataTable with synchronized search and filters */}
      <DataTable
        data={data}
        filteredData={filteredData}
        onDataChange={setData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedShortlist={selectedShortlist}
        setSelectedShortlist={setSelectedShortlist}
        handleResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />
    </div>
  );
};

export default AdminContent;
