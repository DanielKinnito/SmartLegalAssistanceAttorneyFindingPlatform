"use client"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteUserDialog({ open, onOpenChange, onConfirm }: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md p-6 rounded-lg bg-white shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <DialogTitle className="text-lg font-semibold text-[#263A56]">
            Delete User
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 text-[#263A56]" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <DialogDescription className="mt-4 text-gray-600">
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogDescription>
        <DialogFooter className="mt-6 flex justify-end space-x-3">
          <Button
            variant="outline"
            className="border-gray-300 text-[#263A56] hover:bg-gray-100 hover:text-[#263A56] transition-colors duration-200"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
