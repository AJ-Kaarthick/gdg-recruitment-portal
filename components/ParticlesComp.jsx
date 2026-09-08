"use client";
// React imports
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ThemeProvider } from "next-themes";
// MagicUI import
import Particles from "@/components/magicui/particles";
import AnimatedButton from "./AnimatedButton";
// Particles Component
const ParticlesComp = () => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || theme;
    const isDark = currentTheme === "dark";
    const [color, setColor] = useState("#ffffff");

    useEffect(() => {
        setColor(isDark ? "#ffffff" : "#4285F4");
    }, [isDark]);

    return (
        <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl">
            <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-6xl sm:text-8xl  font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                Recruitment Portal
            </span>
            <AnimatedButton />
            <Particles
                className="absolute inset-0"
                quantity={150}
                ease={80}
                color={color}
                refresh
            />
        </div>
    );
};

export default ParticlesComp;
