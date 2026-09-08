"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PiArrowRightThin } from "react-icons/pi";

const PopupComp = ({ isOpen, onClose, PopupData }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{PopupData?.header || "Notice"}</DialogTitle>
          {PopupData?.description && (
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              {PopupData.description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="py-2 space-y-2">
          {Array.isArray(PopupData?.message) ? (
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
              {PopupData.message.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          ) : PopupData?.message ? (
            <p className="text-sm text-muted-foreground">{PopupData.message}</p>
          ) : null}
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupComp;
