"use client";
import { useTheme } from "next-themes";
import { getDepartmentDisplayName } from "@/lib/departments";

import { MagicCard } from "@/components/magicui/magic-card";

export default function MagicCardComp({ review }) {
    const { theme } = useTheme();
    return (
        <div className={"flex h-[250px] w-full flex-col gap-4 lg:flex-row"}>
            <MagicCard
                className="rounded-md text-xl font-thin cursor-pointer flex-col items-center justify-center shadow-none whitespace-nowrap"
                gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            >
                {getDepartmentDisplayName(review?.name || review?.id)}
            </MagicCard>
        </div>
    );
}
