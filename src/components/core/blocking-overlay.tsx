
"use client";

import { ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";


type BlockingOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function BlockingOverlay({ isOpen, onClose }: BlockingOverlayProps) {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md bg-card text-card-foreground shadow-xl rounded-lg">
        <AlertDialogHeader className="text-center">
          <div className="mx-auto mb-4 text-destructive">
            <ShieldAlert size={64} strokeWidth={1.5} />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-destructive">
            Content Blocked
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground mt-2">
            Access to this content has been restricted by Guardian Angel.
            This incident has been logged.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose} className="w-full">
              Acknowledge & Close
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
