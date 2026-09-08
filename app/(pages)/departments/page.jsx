"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { reviews } from "@/constants";
import { getDepartmentDisplayName, getDepartmentDescription } from "@/lib/departments";

import { useSubmissions } from "@/components/SubmissionsProvider";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const departments = reviews;

const DepartmentsListPage = () => {
  const router = useRouter();
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const { submittedDepartments } = useSubmissions();

  const remainingSlots = useMemo(() => 2 - submittedDepartments.length, [submittedDepartments]);
  const selectedCount = selectedDepartments.length;

  // Preserve user's explicit selection order for Priority 1 and Priority 2
  const selectedIds = useMemo(() => {
    return selectedDepartments
      .map((deptName) => departments.find((d) => d.name === deptName)?.id)
      .filter(Boolean);
  }, [selectedDepartments]);

  const isContinueDisabled = selectedIds.length === 0;

  const toggleDepartment = (departmentName) => {
    if (submittedDepartments.includes(departmentName)) {
      toast.error(`You have already submitted an application for ${getDepartmentDisplayName(departmentName)}.`);
      return;
    }

    if (remainingSlots <= 0) {
      toast.error("You have already submitted the maximum allowed (2) applications.");
      return;
    }

    setSelectedDepartments((current) => {
      const isSelected = current.includes(departmentName);

      if (isSelected) {
        return current.filter((name) => name !== departmentName);
      }

      if (current.length >= remainingSlots) {
        toast.error(`You can select at most ${remainingSlots} department(s).`);
        return current;
      }

      return [...current, departmentName];
    });
  };

  const swapPriorities = () => {
    if (selectedDepartments.length === 2) {
      setSelectedDepartments([selectedDepartments[1], selectedDepartments[0]]);
    }
  };

  const goToApplication = () => {
    if (!selectedIds.length) return;
    router.push(`/join/${selectedIds.join("/")}`);
  };

  // Department item card renderer
  const DepartmentListItem = ({ department }) => {
    const isSelected = selectedDepartments.includes(department.name);
    const isSubmitted = submittedDepartments.includes(department.name);

    let priorityBadge = null;
    if (isSelected) {
      if (submittedDepartments.length === 1) {
        priorityBadge = {
          label: "Priority 2 (Preference 2)",
          variant: "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
        };
      } else {
        const index = selectedDepartments.indexOf(department.name);
        if (index === 0) {
          priorityBadge = {
            label: "Priority 1 (Preference 1)",
            variant: "bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          };
        } else if (index === 1) {
          priorityBadge = {
            label: "Priority 2 (Preference 2)",
            variant: "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
          };
        }
      }
    }

    return (
      <li
        key={department.id || department.name}
        className={`p-5 rounded-xl border transition-all duration-200 motion-reduce:transition-none ${
          isSubmitted
            ? "bg-muted/40 border-border/50 opacity-60 cursor-not-allowed"
            : isSelected
            ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary"
            : "bg-card border-border hover:border-border/80 hover:bg-accent/40 cursor-pointer"
        }`}
        onClick={() => !isSubmitted && toggleDepartment(department.name)}
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            disabled={isSubmitted}
            checked={isSelected}
            onChange={() => {}} // Handled by parent container click
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="font-semibold text-foreground text-base">
                {getDepartmentDisplayName(department.name || department.id)}
              </span>
              <div className="flex items-center gap-1.5">
                {priorityBadge && (
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${priorityBadge.variant}`}>
                    {priorityBadge.label}
                  </span>
                )}
                {isSubmitted && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium border border-border">
                    Already Submitted
                  </span>
                )}
              </div>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {getDepartmentDescription(department.body || department.description, department.name || department.id)}
            </p>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="flex min-h-screen flex-col justify-between bg-background text-foreground">
      <NavBar />

      <main className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 flex-1 w-full">
        <header>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            Step 01 · Select Preferences
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Pick your departments
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Select up to <strong className="text-foreground">two</strong> departments. Your first choice will be <strong>Priority 1</strong> and your second will be <strong>Priority 2</strong>.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm text-foreground">
                  {selectedCount} / 2 selected
                </span>
                <div
                  className="flex items-center gap-1.5"
                  aria-label={`Selection progress: ${selectedCount} of 2 slots filled`}
                >
                  <div
                    className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
                      selectedCount >= 1 ? "bg-primary shadow-sm shadow-primary/50" : "bg-muted"
                    }`}
                  />
                  <div
                    className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
                      selectedCount >= 2 ? "bg-primary shadow-sm shadow-primary/50" : "bg-muted"
                    }`}
                  />
                </div>
              </div>

              {selectedDepartments.length === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={swapPriorities}
                  className="text-xs font-medium"
                >
                  ⇄ Swap Priorities
                </Button>
              )}
            </div>

            <Button
              type="button"
              onClick={goToApplication}
              disabled={isContinueDisabled}
              className="font-medium"
            >
              Continue to application →
            </Button>
          </div>
        </header>

        <section className="mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Available Departments</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 m-0">
            {departments.map((department) => (
              <DepartmentListItem
                key={department.id || department.name}
                department={department}
              />
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DepartmentsListPage;
