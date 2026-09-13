"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DepartmentVisual from "./DepartmentVisual";
import { useSubmissions } from "@/components/SubmissionsProvider";
import {
  Briefcase,
  Wrench,
  GraduationCap,
  Users,
  CalendarDays,
  CheckCircle2,
  ArrowRight,
  GitCompare,
  Sparkles,
} from "lucide-react";

/**
 * DepartmentDetailModal
 * Renders all 7 required comprehensive sections for an in-depth exploration
 * of a department track.
 */
export default function DepartmentDetailModal({
  department,
  isOpen,
  onClose,
  onOpenCompare,
}) {
  const router = useRouter();
  const { submittedDepartments } = useSubmissions();

  if (!department) return null;

  const isSubmitted =
    submittedDepartments.includes(department.id) ||
    submittedDepartments.includes(department.obfuscatedId) ||
    submittedDepartments.includes(department.name);

  const isMaxSubmitted = submittedDepartments.length >= 2;

  const handleSelectDepartment = () => {
    onClose();
    router.push(`/departments?select=${encodeURIComponent(department.id)}`);
  };

  const handleStartCompare = () => {
    onClose();
    if (onOpenCompare) {
      onOpenCompare(department.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto p-0 gap-0 border-border bg-card shadow-2xl rounded-2xl sm:rounded-2xl">
        {/* Visual Hero Header */}
        <div className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5">
              <DepartmentVisual
                iconPath={department.iconPath}
                name={department.name}
                category={department.category}
                tone={department.tone}
                size="hero"
              />
            </div>
            <div className="md:col-span-7 flex flex-col justify-center space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border uppercase"
                  style={{
                    backgroundColor: `${department.tone}15`,
                    borderColor: `${department.tone}30`,
                    color: department.tone,
                  }}
                >
                  {department.category}
                </span>
                {isSubmitted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" /> Already Applied
                  </span>
                )}
              </div>

              <DialogTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {department.name}
              </DialogTitle>

              <DialogDescription className="text-sm font-medium text-foreground/80 leading-snug">
                {department.tagline}
              </DialogDescription>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {department.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-xs font-medium bg-background border border-border/80 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Body - 7 Structured Sections */}
        <div className="p-6 space-y-8 divide-y divide-border/60 text-foreground">
          {/* 1. Overview */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-base font-bold uppercase tracking-wider text-foreground">
                1. Overview
              </h3>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {department.overview}
            </p>
          </section>

          {/* 2. What You Might Work On */}
          <section className="pt-6 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Briefcase className="h-4 w-4" />
              <h3 className="text-base font-bold uppercase tracking-wider text-foreground">
                2. What You Might Work On
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {department.workAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/30 transition-colors space-y-1.5"
                >
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {area.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Useful Skills */}
          <section className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Wrench className="h-4 w-4" />
              <h3 className="text-base font-bold uppercase tracking-wider text-foreground">
                3. Useful Skills & Concepts
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-none p-0 m-0">
              {department.skills.map((skill, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Good To Have & Beginner Friendly Note */}
          <section className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap className="h-4 w-4" />
              <h3 className="text-base font-bold uppercase tracking-wider text-foreground">
                4. Useful Prior Knowledge
              </h3>
            </div>
            <ul className="space-y-1.5 list-none p-0 m-0">
              {department.goodToHave.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Welcoming Note */}
            <div className="mt-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20 text-xs sm:text-sm text-foreground space-y-1">
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Welcoming Enthusiastic Beginners
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {department.beginnerFriendlyNote}
              </p>
            </div>
          </section>

          {/* 5. What You Can Learn */}
          <section className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-base font-bold uppercase tracking-wider text-foreground">
                5. What You Can Learn
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-none p-0 m-0">
              {department.learningOutcomes.map((outcome, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-lg border border-border/60 bg-muted/20 text-xs leading-relaxed text-muted-foreground flex items-start gap-2"
                >
                  <span className="font-bold text-primary shrink-0">✓</span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 6. Who This Could Suit */}
          <section className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Users className="h-4 w-4" />
              <h3 className="text-base font-bold uppercase tracking-wider text-foreground">
                6. Who This Could Suit
              </h3>
            </div>
            <ul className="space-y-2 list-none p-0 m-0">
              {department.suitableFor.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 7. Realistic Activities */}
          <section className="pt-6 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <CalendarDays className="h-4 w-4" />
              <h3 className="text-base font-bold uppercase tracking-wider text-foreground">
                7. Activities & Workshops
              </h3>
            </div>
            <p className="text-xs text-muted-foreground italic mb-2">
              Possible activities include:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {department.activities.map((activity, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border/70 bg-background flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>{activity}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-border/60 bg-muted/30 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleStartCompare}
              className="text-xs font-medium gap-1.5 w-full sm:w-auto"
            >
              <GitCompare className="h-3.5 w-3.5" />
              Compare with another track
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs sm:inline-flex hidden"
            >
              Close
            </Button>
          </div>

          <Button
            type="button"
            disabled={isSubmitted || isMaxSubmitted}
            onClick={handleSelectDepartment}
            className="text-xs sm:text-sm font-semibold gap-1.5 w-full sm:w-auto"
          >
            {isSubmitted
              ? "Already Applied"
              : isMaxSubmitted
              ? "Maximum 2 Applied"
              : "Choose this department"}
            {!isSubmitted && !isMaxSubmitted && <ArrowRight className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
