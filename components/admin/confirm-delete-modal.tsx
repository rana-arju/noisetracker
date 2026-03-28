"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  reportId: string;
  employeeName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  reportId,
  employeeName,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>রিপোর্টটি কি মুছে ফেলবেন?</AlertDialogTitle>
          <AlertDialogDescription>
            আপনি কি নিশ্চিত যে আপনি <strong>{employeeName}</strong>-এর বিরুদ্ধে রিপোর্টটি মুছে ফেলতে চান? এই কাজটি আর ফিরে পাওয়া যাবে না।
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-4 justify-end">
          <AlertDialogCancel onClick={onCancel}>বাতিল</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            মুছে ফেলুন
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
