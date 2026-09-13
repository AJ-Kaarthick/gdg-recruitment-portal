"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

/**
 * DepartmentVisual
 * Renders a consistent 16:9 visual banner for each department track.
 * Uses local SVG icons, tone gradients, and reliable fallback handling.
 */
export default function DepartmentVisual({
  iconPath,
  name,
  category,
  tone = "#4285F4",
  className = "",
  size = "default", // "default" | "compact" | "hero"
}) {
  const [imageError, setImageError] = useState(false);

  // Soft tone transparency variations
  const toneBg = `${tone}15`; // ~8% opacity
  const toneBorder = `${tone}30`; // ~19% opacity
  const toneGlow = `${tone}25`;

  return (
    <div
      className={`relative w-full aspect-video rounded-xl overflow-hidden border transition-all duration-300 select-none bg-gradient-to-br from-card via-background to-muted/50 ${className}`}
      style={{ borderColor: toneBorder }}
    >
      {/* Background Accent Glow & Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${toneGlow} 0%, transparent 70%)`,
        }}
      />
      
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Structured 3-Tier Layout */}
      <div className="relative z-10 w-full h-full p-3 sm:p-4 flex flex-col justify-between">
        {/* 1. Consistent Top Region: Category Badge */}
        <div className="h-6 sm:h-7 flex items-center justify-start shrink-0">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide uppercase shadow-xs backdrop-blur-md border"
            style={{
              backgroundColor: toneBg,
              borderColor: toneBorder,
              color: tone,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ backgroundColor: tone }} />
            <span className="truncate">{category}</span>
          </span>
        </div>

        {/* 2. Consistent Center Region: Fixed-Size Icon Backdrop & Normalized SVG Container */}
        <div className="flex-1 flex items-center justify-center min-h-0 py-1">
          <div
            className={`relative flex items-center justify-center rounded-2xl shadow-sm backdrop-blur-sm border transition-transform duration-300 group-hover:scale-105 shrink-0 ${
              size === "hero"
                ? "w-20 h-20 sm:w-24 sm:h-24"
                : size === "compact"
                ? "w-12 h-12"
                : "w-16 h-16 sm:w-[4.25rem] sm:h-[4.25rem]"
            }`}
            style={{
              backgroundColor: `${tone}12`,
              borderColor: toneBorder,
            }}
          >
            {!imageError && iconPath ? (
              <div
                className={`relative flex items-center justify-center ${
                  size === "hero"
                    ? "w-12 h-12 sm:w-14 sm:h-14"
                    : size === "compact"
                    ? "w-7 h-7"
                    : "w-9 h-9 sm:w-10 sm:h-10"
                }`}
              >
                <Image
                  src={iconPath}
                  alt={`${name} icon`}
                  fill
                  sizes={size === "hero" ? "56px" : "40px"}
                  className="object-contain filter drop-shadow-md brightness-95 dark:brightness-100"
                  onError={() => setImageError(true)}
                  priority={size === "hero"}
                />
              </div>
            ) : (
              <Sparkles
                className={
                  size === "hero"
                    ? "h-10 w-10"
                    : size === "compact"
                    ? "h-6 w-6"
                    : "h-7 w-7"
                }
                style={{ color: tone }}
              />
            )}
          </div>
        </div>

        {/* 3. Consistent Bottom Region: Centered Department Name Label */}
        <div className="h-6 sm:h-7 flex items-center justify-center text-center px-2 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground/90 tracking-wider truncate max-w-full">
            {name}
          </span>
        </div>
      </div>

      {/* Bottom Border Highlight Strip */}
      <div
        className="absolute bottom-0 inset-x-0 h-1 opacity-70 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${tone}, transparent)`,
        }}
      />
    </div>
  );
}
