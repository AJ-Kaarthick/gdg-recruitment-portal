"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DepartmentVisual from "./DepartmentVisual";
import { Button } from "@/components/ui/button";
import { useSubmissions } from "@/components/SubmissionsProvider";
import { CheckCircle2, ArrowRight, BookOpen, GitCompare } from "lucide-react";

/**
 * DepartmentCard
 * Displays department overview in grid, visual banner, tags, and action triggers.
 */
export default function DepartmentCard({
  department,
  onOpenDetails,
  isComparing = false,
  onToggleCompare,
  compareDisabled = false,
}) {
  const router = useRouter();
  const { submittedDepartments } = useSubmissions();

  const isSubmitted =
    submittedDepartments.includes(department.id) ||
    submittedDepartments.includes(department.obfuscatedId) ||
    submittedDepartments.includes(department.name);

  const isMaxSubmitted = submittedDepartments.length >= 2;

  const handleChoose = (e) => {
    e.stopPropagation();
    router.push(`/departments?select=${encodeURIComponent(department.id)}`);
  };

  return (
    <div
      onClick={() => onOpenDetails(department)}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-border/90 hover:shadow-lg hover:-translate-y-1 cursor-pointer focus-within:ring-2 focus-within:ring-primary h-full"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetails(department);
        }
      }}
      aria-label={`View details for ${department.name}`}
    >
      <div className="space-y-3.5 flex-1 flex flex-col">
        {/* Visual Banner */}
        <DepartmentVisual
          iconPath={department.iconPath}
          name={department.name}
          category={department.category}
          tone={department.tone}
        />

        {/* Content Header */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 flex-wrap min-h-[1.75rem]">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {department.name}
            </h3>
            {isSubmitted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" /> Applied
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {department.tagline}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1 min-h-[1.75rem]">
          {department.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/50"
            >
              {tag}
            </span>
          ))}
          {department.tags.length > 4 && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 text-muted-foreground/70">
              +{department.tags.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto pt-3.5 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(department);
            }}
            className="text-xs h-8 px-2.5 font-medium text-muted-foreground hover:text-foreground gap-1 flex-1 sm:flex-initial"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Details
          </Button>

          {onToggleCompare && (
            <Button
              type="button"
              variant={isComparing ? "secondary" : "ghost"}
              size="sm"
              disabled={!isComparing && compareDisabled}
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(department.id);
              }}
              className={`text-xs h-8 px-2.5 font-medium gap-1 flex-1 sm:flex-initial ${
                isComparing ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground"
              }`}
              title={compareDisabled && !isComparing ? "You can compare up to 2 tracks at once" : ""}
            >
              <GitCompare className="h-3.5 w-3.5" />
              {isComparing ? "Comparing" : "Compare"}
            </Button>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          disabled={isSubmitted || isMaxSubmitted}
          onClick={handleChoose}
          className="text-xs h-8 px-3 font-semibold gap-1 w-full sm:w-auto"
        >
          {isSubmitted ? "Applied" : isMaxSubmitted ? "Max (2)" : "Choose"}
          {!isSubmitted && !isMaxSubmitted && <ArrowRight className="h-3 w-3" />}
        </Button>
      </div>
    </div>
  );
}
