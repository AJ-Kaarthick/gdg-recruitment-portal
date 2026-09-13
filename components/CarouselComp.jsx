"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "./ui/separator";
import { Button } from "@/components/ui/button";
import { resolveQuestionLabel } from "@/constants";
import { getDepartmentDisplayName } from "@/lib/departments";
import {
    normalizeStatus,
    getStatusLabel,
    STATUS_CONFIG,
    RECRUITMENT_STATUS,
} from "@/lib/status";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Clock, XCircle, AlertTriangle, RotateCcw } from "lucide-react";

export default function CarouselComp({
    dataList = [],
    onApplicantUpdate,
    allApplicants = [],
}) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [confirmRejectId, setConfirmRejectId] = useState(null);

    const getQuestions = (data) => {
        if (!data?.Questions) return [];

        if (Array.isArray(data.Questions)) {
            return data.Questions;
        }

        if (typeof data.Questions === "object") {
            return Object.entries(data.Questions);
        }

        return [];
    };

    // Build map of students with a shortlisted department
    const studentShortlistMap = React.useMemo(() => {
        const map = new Map();
        allApplicants.forEach((item) => {
            const isShortlisted = normalizeStatus(item) === RECRUITMENT_STATUS.SHORTLISTED;
            if (isShortlisted && item.Email) {
                map.set(item.Email, {
                    id: item._id || item.id,
                    department: item.Department,
                    priority: item.priority,
                });
            }
        });
        return map;
    }, [allApplicants]);

    const handleStatusTransition = async (applicant, nextStatus) => {
        const applicantId = applicant._id || applicant.id;
        setIsUpdating(true);
        setConfirmRejectId(null);

        try {
            const res = await fetch(`/api/shortlist/${applicantId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });

            const result = await res.json().catch(() => ({}));

            if (res.ok) {
                const label = getStatusLabel(nextStatus);
                toast.success(`Applicant status updated to ${label}`);
                if (typeof onApplicantUpdate === "function") {
                    onApplicantUpdate(applicantId, nextStatus, result.data);
                }
            } else {
                toast.error(result.message || "Failed to update applicant status.");
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error("Failed to update applicant status.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Carousel className="max-w-full">
            <CarouselContent>
                {dataList.map((data, index) => {
                    const applicantId = data._id || data.id || index;
                    const questions = getQuestions(data);
                    const currentStatus = normalizeStatus(data);
                    const statusConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG[RECRUITMENT_STATUS.PENDING];

                    const studentEmail = data.Email;
                    const otherShortlisted = studentEmail ? studentShortlistMap.get(studentEmail) : null;
                    const isBlockedFromShortlist =
                        currentStatus !== RECRUITMENT_STATUS.SHORTLISTED &&
                        otherShortlisted &&
                        otherShortlisted.id !== applicantId;

                    const otherDeptName = otherShortlisted
                        ? getDepartmentDisplayName(otherShortlisted.department) || otherShortlisted.department
                        : "";

                    const isConfirmingReject = confirmRejectId === applicantId;

                    return (
                        <CarouselItem key={applicantId}>
                            <div className="p-1">
                                <Card className="h-[62vh] max-h-[62vh] border-none shadow-none overflow-hidden flex flex-col">
                                    <CardContent className="flex h-full flex-col p-3 overflow-hidden">
                                        {/* Applicant Metadata Header */}
                                        <div className="flex flex-col items-center justify-center mb-3 gap-1 shrink-0">
                                            <span className="font-bold text-base text-foreground">
                                                {data.Name || "Unnamed Applicant"}
                                            </span>
                                            <span className="font-light text-xs text-muted-foreground">
                                                {getDepartmentDisplayName(data?.Department) || "Unknown Department"}
                                                {data?.priority ? ` • Priority ${data.priority}` : ""}
                                                {data?.Gender ? ` • ${data.Gender}` : ""}
                                                {data?.RegistrationNumber ? ` • ${data.RegistrationNumber}` : ""}
                                            </span>

                                            {/* Current Status Badge */}
                                            <div className="mt-1 flex items-center gap-1.5">
                                                <span className="text-xs text-muted-foreground font-medium">Status:</span>
                                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${statusConfig.adminBadge.className}`}>
                                                    {statusConfig.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Questions and Responses List */}
                                        <div className="w-full flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
                                            {questions.length > 0 ? (
                                                questions.map(([question, answer], qIndex) => {
                                                    const displayAnswer =
                                                        answer === undefined || answer === null || answer === ""
                                                            ? "Not Answered"
                                                            : answer;

                                                    return (
                                                        <div
                                                            key={`${question}-${qIndex}`}
                                                            className="border border-border/80 p-3 rounded-lg bg-card/60"
                                                        >
                                                            <h4 className="mb-1 text-xs font-semibold text-foreground">
                                                                {qIndex + 1}. {resolveQuestionLabel(question)}
                                                            </h4>
                                                            <Separator className="my-1.5" />
                                                            <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                                                                {displayAnswer}
                                                            </p>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-xs text-muted-foreground text-center py-6">
                                                    No responses available for this applicant.
                                                </p>
                                            )}
                                        </div>

                                        {/* Decision Actions Bar */}
                                        <div className="mt-3 pt-3 border-t border-border/70 flex flex-col gap-2 shrink-0">
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                                    Recruitment Decision:
                                                </span>

                                                {/* Single-Shortlist conflict warning */}
                                                {isBlockedFromShortlist && (
                                                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                                                        <AlertTriangle className="h-3 w-3 shrink-0" />
                                                        Shortlisted for {otherDeptName}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                {/* 1. Shortlist Control */}
                                                {currentStatus === RECRUITMENT_STATUS.SHORTLISTED ? (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isUpdating}
                                                        onClick={() => handleStatusTransition(data, RECRUITMENT_STATUS.PENDING)}
                                                        className="text-xs h-8 gap-1.5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-semibold"
                                                    >
                                                        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                                                        <span>Unshortlist (Set Pending)</span>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        disabled={isUpdating || isBlockedFromShortlist}
                                                        title={isBlockedFromShortlist ? `Student already shortlisted for ${otherDeptName}` : "Shortlist for this department"}
                                                        onClick={() => handleStatusTransition(data, RECRUITMENT_STATUS.SHORTLISTED)}
                                                        className="text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
                                                    >
                                                        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                                                        <span>{isBlockedFromShortlist ? "Already Shortlisted" : "Shortlist"}</span>
                                                    </Button>
                                                )}

                                                {/* 2. Waitlist Control */}
                                                {currentStatus === RECRUITMENT_STATUS.WAITLISTED ? (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isUpdating}
                                                        onClick={() => handleStatusTransition(data, RECRUITMENT_STATUS.PENDING)}
                                                        className="text-xs h-8 gap-1.5 border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 font-semibold"
                                                    >
                                                        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                                                        <span>Remove from Waitlist</span>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isUpdating}
                                                        onClick={() => handleStatusTransition(data, RECRUITMENT_STATUS.WAITLISTED)}
                                                        className="text-xs h-8 gap-1.5 border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 font-semibold"
                                                    >
                                                        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Clock className="h-3 w-3" />}
                                                        <span>Waitlist</span>
                                                    </Button>
                                                )}

                                                {/* 3. Reject Control (with confirmation toggle to prevent misclicks) */}
                                                {currentStatus === RECRUITMENT_STATUS.REJECTED ? (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isUpdating}
                                                        onClick={() => handleStatusTransition(data, RECRUITMENT_STATUS.PENDING)}
                                                        className="text-xs h-8 gap-1.5 border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-semibold"
                                                    >
                                                        {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                                                        <span>Reset Rejection</span>
                                                    </Button>
                                                ) : isConfirmingReject ? (
                                                    <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            disabled={isUpdating}
                                                            onClick={() => handleStatusTransition(data, RECRUITMENT_STATUS.REJECTED)}
                                                            className="text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3"
                                                        >
                                                            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm Reject"}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="ghost"
                                                            disabled={isUpdating}
                                                            onClick={() => setConfirmRejectId(null)}
                                                            className="text-xs h-8 px-2 text-muted-foreground"
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isUpdating}
                                                        onClick={() => setConfirmRejectId(applicantId)}
                                                        className="text-xs h-8 gap-1.5 border-rose-400 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold"
                                                    >
                                                        <XCircle className="h-3 w-3" />
                                                        <span>Reject</span>
                                                    </Button>
                                                )}

                                                {/* 4. Reset to Pending (if not already pending) */}
                                                {currentStatus !== RECRUITMENT_STATUS.PENDING && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="ghost"
                                                        disabled={isUpdating}
                                                        onClick={() => handleStatusTransition(data, RECRUITMENT_STATUS.PENDING)}
                                                        className="text-xs h-8 px-2 text-muted-foreground hover:text-foreground"
                                                        title="Reset status to Pending"
                                                    >
                                                        <RotateCcw className="h-3 w-3 mr-1" />
                                                        Reset
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
