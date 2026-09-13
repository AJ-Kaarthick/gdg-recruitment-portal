"use client";

import React, { useState } from "react";
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
import {
  DEPARTMENTS_EXPLORE_DATA,
  getDepartmentExploreData,
} from "@/constants/departmentsData";
import { useSubmissions } from "@/components/SubmissionsProvider";
import {
  ArrowRight,
  GitCompare,
  Briefcase,
  Wrench,
  Users,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

/**
 * DepartmentCompareModal
 * Lightweight side-by-side comparison modal allowing students to compare any two tracks.
 */
export default function DepartmentCompareModal({
  isOpen,
  onClose,
  initialDept1Id,
  initialDept2Id,
}) {
  const router = useRouter();
  const { submittedDepartments } = useSubmissions();

  // Pick sensible defaults if not provided
  const [dept1Id, setDept1Id] = useState(
    initialDept1Id || DEPARTMENTS_EXPLORE_DATA[0].id
  );
  const [dept2Id, setDept2Id] = useState(
    initialDept2Id ||
      (initialDept1Id === DEPARTMENTS_EXPLORE_DATA[1].id
        ? DEPARTMENTS_EXPLORE_DATA[0].id
        : DEPARTMENTS_EXPLORE_DATA[1].id)
  );

  // Update if props change
  React.useEffect(() => {
    if (initialDept1Id) setDept1Id(initialDept1Id);
    if (initialDept2Id) setDept2Id(initialDept2Id);
  }, [initialDept1Id, initialDept2Id]);

  const dept1 = getDepartmentExploreData(dept1Id) || DEPARTMENTS_EXPLORE_DATA[0];
  const dept2 = getDepartmentExploreData(dept2Id) || DEPARTMENTS_EXPLORE_DATA[1];

  const isSubmitted1 =
    submittedDepartments.includes(dept1.id) ||
    submittedDepartments.includes(dept1.obfuscatedId) ||
    submittedDepartments.includes(dept1.name);

  const isSubmitted2 =
    submittedDepartments.includes(dept2.id) ||
    submittedDepartments.includes(dept2.obfuscatedId) ||
    submittedDepartments.includes(dept2.name);

  const isMaxSubmitted = submittedDepartments.length >= 2;

  const handleChoose = (id) => {
    onClose();
    router.push(`/departments?select=${encodeURIComponent(id)}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border bg-card shadow-2xl rounded-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2 text-primary mb-1">
            <GitCompare className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Side-by-Side Comparison</span>
          </div>
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground">
            Compare Departments
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
            Evaluate curriculum, project types, and expectations to choose your best fit.
          </DialogDescription>
        </div>

        {/* Comparison Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {/* Column 1 */}
            <div className="flex flex-col space-y-4">
              {/* Dropdown Selector */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">
                  Track 1
                </label>
                <select
                  value={dept1.id}
                  onChange={(e) => setDept1Id(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DEPARTMENTS_EXPLORE_DATA.map((d) => (
                    <option key={d.id} value={d.id} disabled={d.id === dept2.id}>
                      {d.name} ({d.category})
                    </option>
                  ))}
                </select>
              </div>

              <DepartmentVisual
                iconPath={dept1.iconPath}
                name={dept1.name}
                category={dept1.category}
                tone={dept1.tone}
              />

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">{dept1.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {dept1.tagline}
                </p>
              </div>

              {/* Work areas */}
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/15 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-primary" /> Key Project Areas
                </h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-none p-0 m-0">
                  {dept1.workAreas.slice(0, 3).map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                      <div>
                        <strong className="text-foreground">{w.title}:</strong> {w.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/15 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-primary" /> Core Tools & Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {dept1.skills.map((s, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-background border border-border/70 text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Who it suits */}
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/15 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" /> Best Suited For
                </h4>
                <ul className="space-y-1 text-xs text-muted-foreground list-none p-0 m-0">
                  {dept1.suitableFor.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activities */}
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/15 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" /> Sample Activities
                </h4>
                <p className="text-[11px] text-muted-foreground italic">Possible activities include:</p>
                <ul className="space-y-1 text-xs text-muted-foreground list-none p-0 m-0">
                  {dept1.activities.slice(0, 3).map((a, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Button
                  type="button"
                  className="w-full font-semibold text-xs h-9 gap-1.5"
                  disabled={isSubmitted1 || isMaxSubmitted}
                  onClick={() => handleChoose(dept1.id)}
                >
                  {isSubmitted1 ? "Already Applied" : isMaxSubmitted ? "Max (2) Applied" : `Choose ${dept1.shortName}`}
                  {!isSubmitted1 && !isMaxSubmitted && <ArrowRight className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col space-y-4">
              {/* Dropdown Selector */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase">
                  Track 2
                </label>
                <select
                  value={dept2.id}
                  onChange={(e) => setDept2Id(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DEPARTMENTS_EXPLORE_DATA.map((d) => (
                    <option key={d.id} value={d.id} disabled={d.id === dept1.id}>
                      {d.name} ({d.category})
                    </option>
                  ))}
                </select>
              </div>

              <DepartmentVisual
                iconPath={dept2.iconPath}
                name={dept2.name}
                category={dept2.category}
                tone={dept2.tone}
              />

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">{dept2.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {dept2.tagline}
                </p>
              </div>

              {/* Work areas */}
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/15 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-primary" /> Key Project Areas
                </h4>
                <ul className="space-y-1.5 text-xs text-muted-foreground list-none p-0 m-0">
                  {dept2.workAreas.slice(0, 3).map((w, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                      <div>
                        <strong className="text-foreground">{w.title}:</strong> {w.description}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/15 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-primary" /> Core Tools & Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {dept2.skills.map((s, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-background border border-border/70 text-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Who it suits */}
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/15 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" /> Best Suited For
                </h4>
                <ul className="space-y-1 text-xs text-muted-foreground list-none p-0 m-0">
                  {dept2.suitableFor.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activities */}
              <div className="p-3.5 rounded-xl border border-border/70 bg-muted/15 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" /> Sample Activities
                </h4>
                <p className="text-[11px] text-muted-foreground italic">Possible activities include:</p>
                <ul className="space-y-1 text-xs text-muted-foreground list-none p-0 m-0">
                  {dept2.activities.slice(0, 3).map((a, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="pt-2">
                <Button
                  type="button"
                  className="w-full font-semibold text-xs h-9 gap-1.5"
                  disabled={isSubmitted2 || isMaxSubmitted}
                  onClick={() => handleChoose(dept2.id)}
                >
                  {isSubmitted2 ? "Already Applied" : isMaxSubmitted ? "Max (2) Applied" : `Choose ${dept2.shortName}`}
                  {!isSubmitted2 && !isMaxSubmitted && <ArrowRight className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/60 bg-muted/20 flex justify-end">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close Comparison
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
