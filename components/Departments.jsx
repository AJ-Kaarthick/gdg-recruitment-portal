"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import { reviews } from "@/constants/index";
import { getDepartmentDisplayName, getDepartmentDescription } from "@/lib/departments";

export const ReviewCard = ({ img, name, username, body, description, icon: Icon, tone, id }) => {
    const displayName = getDepartmentDisplayName(name || id);
    const textContent = getDepartmentDescription(description || body || "", name || id);
    const formattedPreview = textContent.length > 60 ? `${textContent.slice(0, 60)}...` : textContent;

    return (
        <figure
            className={cn(
                "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 shadow-xs",
                "border-border bg-card hover:bg-accent/40",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
            )}
        >
            <div className="flex flex-row items-center gap-2.5">
                {Icon ? (
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: tone ? `${tone}20` : "rgba(255,255,255,0.1)" }}
                    >
                        <Icon size={18} style={{ color: tone || "#8ab4f8" }} />
                    </div>
                ) : (
                    <Image
                        className="rounded-full shrink-0"
                        width={32}
                        height={32}
                        alt=""
                        src={img || "/icon.svg"}
                    />
                )}
                <div className="flex flex-col min-w-0">
                    <figcaption className="text-sm font-semibold truncate text-foreground dark:text-white">
                        {displayName}
                    </figcaption>
                    {username && (
                        <p className="text-xs font-medium text-muted-foreground dark:text-white/40 truncate">
                            {username}
                        </p>
                    )}
                </div>
            </div>
            <blockquote className="mt-2.5 text-xs text-muted-foreground dark:text-zinc-400 leading-relaxed">
                {formattedPreview}
            </blockquote>
        </figure>
    );
};

const Departments = () => {
    const consolidatedDepartments = useMemo(() => {
        const seenIds = new Set();
        return reviews.filter((r) => {
            const id = r.id;
            if (seenIds.has(id)) return false;
            seenIds.add(id);
            return true;
        });
    }, []);

    const primaryRowList = useMemo(
        () => consolidatedDepartments.slice(0, Math.ceil(consolidatedDepartments.length / 2)),
        [consolidatedDepartments]
    );

    const secondaryRowList = useMemo(
        () => consolidatedDepartments.slice(Math.ceil(consolidatedDepartments.length / 2)),
        [consolidatedDepartments]
    );

    return (
        <div
            className="cursor-pointer relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-none bg-background"
        >
            <Marquee pauseOnHover>
                {primaryRowList.map((review) => {
                    const href = review.id === "development" ? "/development" : `/explore?dept=${review.id}`;
                    return (
                        <Link key={`primary-${review.id}`} href={href}>
                            <ReviewCard {...review} />
                        </Link>
                    );
                })}
            </Marquee>
            <Marquee reverse pauseOnHover className="cursor-pointer">
                {secondaryRowList.map((review) => {
                    const href = review.id === "development" ? "/development" : `/explore?dept=${review.id}`;
                    return (
                        <Link key={`secondary-${review.id}`} href={href}>
                            <ReviewCard {...review} />
                        </Link>
                    );
                })}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
        </div>
    );
};

export default Departments;
