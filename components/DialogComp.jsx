"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { CiWarning } from "react-icons/ci";

import CarouselComp from "./CarouselComp";
import { toast } from "sonner";

export default function DialogComp({ selectedApplicants, onApplicantUpdate }) {
    const [shortlistStatus, setShortlistStatus] = useState([]);

    // Initialize the shortlist status when the component loads or selection changes
    useEffect(() => {
        const applicants = typeof selectedApplicants === "function" ? selectedApplicants() : [];
        const status = applicants.map(applicant => Boolean(applicant?.shortlisted));
        setShortlistStatus(status);
    }, [selectedApplicants]);

    const handleShortlist = async (index) => {
        const applicants = typeof selectedApplicants === "function" ? selectedApplicants() : [];
        const applicant = applicants[index];
        if (!applicant) return;

        const applicantId = applicant._id || applicant.id;
        const isShortlisted = Boolean(shortlistStatus[index]);
        const nextShortlisted = !isShortlisted;

        try {
            const res = await fetch(`/api/shortlist/${applicantId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shortlisted: nextShortlisted }),
            });

            if (res.ok) {
                const updatedStatus = [...shortlistStatus];
                updatedStatus[index] = nextShortlisted;
                setShortlistStatus(updatedStatus);
                if (typeof onApplicantUpdate === "function") {
                    onApplicantUpdate(applicantId, nextShortlisted);
                }
                toast.success(`Applicant has been ${nextShortlisted ? 'shortlisted' : 'unshortlisted'}!`);
            } else {
                const errData = await res.json().catch(() => ({}));
                const errMsg = errData.message || "Failed to update applicant status.";
                toast.error(errMsg);
            }
        } catch (error) {
            console.error("Error occurred while updating the status:", error.message);
            toast.error("Failed to update status");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View Responses</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] h-fit">
                <DialogHeader>
                    <DialogTitle>Applicant&apos;s Responses</DialogTitle>
                    <DialogDescription>
                        Questions and answers answered by the applicants can be viewed here.
                    </DialogDescription>
                </DialogHeader>
                <div className="">
                    {selectedApplicants().length !== 0 ? (
                        <CarouselComp    
                            dataList={selectedApplicants()} 
                            handleShortlist={handleShortlist} 
                            shortlistStatus={shortlistStatus}
                        />
                    ) : (
                        <p className="flex gap-3 items-center justify-start font-light text-md text-red-500">
                            <CiWarning /> No applicant selected
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
