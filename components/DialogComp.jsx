"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CiWarning } from "react-icons/ci";
import CarouselComp from "./CarouselComp";

export default function DialogComp({ selectedApplicants, onApplicantUpdate, allApplicants = [] }) {
    const applicants = typeof selectedApplicants === "function" ? selectedApplicants() : [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-xs h-9">View Responses</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] h-fit">
                <DialogHeader>
                    <DialogTitle>Applicant&apos;s Responses</DialogTitle>
                    <DialogDescription>
                        Questions and answers submitted by the applicant with recruitment decision controls.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {applicants.length !== 0 ? (
                        <CarouselComp    
                            dataList={applicants} 
                            onApplicantUpdate={onApplicantUpdate}
                            allApplicants={allApplicants}
                        />
                    ) : (
                        <p className="flex gap-2.5 items-center justify-start text-xs text-amber-600 dark:text-amber-400 py-4">
                            <CiWarning className="h-4 w-4" /> Please select an applicant row in the table first.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
