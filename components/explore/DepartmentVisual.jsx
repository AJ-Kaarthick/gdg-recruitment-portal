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
      className={`relative w-full aspect-video rounded-xl overflow-hidden border transition-all duration-300 flex items-center justify-center select-none bg-gradient-to-br from-card via-background to-muted/50 ${className}`}
      style={{ borderColor: toneBorder }}
    >
      {/* Background Accent Glow & Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${toneGlow} 0%, transparent 70%)`,
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

      {/* Top Track Pill */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase shadow-xs backdrop-blur-md border"
          style={{
            backgroundColor: toneBg,
            borderColor: toneBorder,
            color: tone,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: tone }} />
          {category}
        </span>
      </div>

      {/* Center Icon & Artwork */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4">
        <div
          className="relative flex items-center justify-center rounded-2xl p-4 shadow-sm backdrop-blur-sm border transition-transform duration-300 group-hover:scale-105"
          style={{
            backgroundColor: `${tone}12`,
            borderColor: toneBorder,
          }}
        >
          {!imageError && iconPath ? (
            <Image
              src={iconPath}
              alt={`${name} icon`}
              width={size === "hero" ? 72 : 54}
              height={size === "hero" ? 72 : 54}
              className="object-contain filter drop-shadow-md brightness-95 dark:brightness-100"
              onError={() => setImageError(true)}
              priority={size === "hero"}
            />
          ) : (
            <Sparkles className="h-12 w-12" style={{ color: tone }} />
          )}
        </div>

        <span className="mt-2 text-xs font-medium text-muted-foreground/80 tracking-wider">
          {name}
        </span>
      </div>

      {/* Bottom Border Highlight Strip */}
      <div
        className="absolute bottom-0 inset-x-0 h-1 opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${tone}, transparent)`,
        }}
      />
    </div>
  );
}
