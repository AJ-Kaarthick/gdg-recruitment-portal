"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Particles from "@/components/magicui/particles";
import AnimatedButton from "./AnimatedButton";
import { Button } from "./ui/button";

import { useSubmissions } from "./SubmissionsProvider";
import { getDepartmentDisplayName } from "@/lib/departments";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function Hero() {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";
  const [color, setColor] = useState("#ffffff");
  const { submittedDepartments } = useSubmissions();

  useEffect(() => {
    setColor(isDark ? "#ffffff" : "#4285F4");
  }, [isDark]);

  return (
    <section className="relative flex min-h-[520px] w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-16 text-center">
      <div className="z-10 flex flex-col items-center justify-center max-w-3xl space-y-6">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-400/80 bg-clip-text text-center text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl lg:text-8xl dark:from-white dark:to-slate-400/20">
          Recruitment Portal
        </span>
        
        <p className="text-lg font-medium text-muted-foreground sm:text-xl max-w-xl">
          Ready to make your mark? Join our departments and work on real-world projects. Your journey starts here.
        </p>

        {submittedDepartments && submittedDepartments.length > 0 && (
          <div className="w-full max-w-md rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20 p-4 text-center space-y-2 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Application Submitted</span>
            </div>
            <p className="text-xs text-muted-foreground">
              You have submitted {submittedDepartments.length === 1 ? "an application" : "applications"} for:
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {submittedDepartments.map((dept) => (
                <span
                  key={dept}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-background border border-border shadow-xs text-foreground"
                >
                  {getDepartmentDisplayName(dept)}
                </span>
              ))}
            </div>
            {submittedDepartments.length < 2 ? (
              <p className="text-xs text-muted-foreground pt-1">
                You can apply for 1 more department.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground pt-1">
                You have reached the maximum of 2 applications. Thank you for applying!
              </p>
            )}
            <div className="pt-2">
              <Button asChild size="sm" variant="outline" className="text-xs font-medium">
                <Link href="/applications">View Application Status →</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button asChild size="default" className="rounded-full font-semibold px-5 shadow-sm gap-2">
            <Link href="/explore">
              Explore Departments <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <AnimatedButton />
        </div>
      </div>

      <Particles
        className="absolute inset-0 z-0 pointer-events-none"
        quantity={120}
        ease={80}
        color={color}
        refresh
      />
    </section>
  );
}


