"use client";

import type React from "react";

import { useState, useEffect } from "react"; // Import useEffect
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, Loader2, Upload, X } from "lucide-react";

interface Attorney {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface RequestConsultationModalProps {
  attorney: Attorney | null;
  isOpen: boolean;
  onClose: () => void;
  authToken: string | null; // Authentication token for API requests
}

const formSchema = z.object({
  caseTitle: z
    .string()
    .min(5, "Case title must be at least 5 characters.")
    .max(100, "Case title cannot exceed 100 characters."),
  caseDescription: z
    .string()
    .min(20, "Case description must be at least 20 characters.")
    .max(2000, "Case description cannot exceed 2000 characters."),
});

type FormData = z.infer<typeof formSchema>;

export default function RequestConsultationModal({
  attorney,
  isOpen,
  onClose,
  authToken,
}: RequestConsultationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  // New state for handling the existing case check
  const [hasExistingCase, setHasExistingCase] = useState(false);
  const [isLoadingCaseStatus, setIsLoadingCaseStatus] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseTitle: "",
      caseDescription: "",
    },
  });

  // Effect to check if the user already has a case
  useEffect(() => {
    const checkUserCases = async () => {
      // Only proceed if modal is open and authToken is available
      if (!isOpen || !authToken) {
        setIsLoadingCaseStatus(false);
        return;
      }

      setIsLoadingCaseStatus(true);
      try {
        // This GET request should fetch cases associated with the current user.
        // Adjust the endpoint if your backend has a more specific way to check this.
        const response = await fetch(
          "https://main-backend-aan1.onrender.com/api/cases",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Assuming the backend returns an array of cases for the user.
          // If the array is not empty, the user has existing cases.
          setHasExistingCase(Array.isArray(data) && data.length > 0);
        } else {
          // Log error but proceed, assuming no existing case if check fails
          console.error(
            "Failed to fetch user's case status:",
            await response.json()
          );
          setHasExistingCase(false);
        }
      } catch (error) {
        console.error("Error fetching user's case status:", error);
        setHasExistingCase(false);
      } finally {
        setIsLoadingCaseStatus(false);
      }
    };

    if (isOpen) {
      // Only run check when modal is active
      checkUserCases();
    } else {
      // Reset state when modal closes
      setHasExistingCase(false);
      setIsLoadingCaseStatus(true); // Reset to true for next open
    }
  }, [isOpen, authToken]); // Depend on isOpen and authToken

  const onSubmit = async (values: FormData) => {
    if (!attorney) {
      alert("No attorney selected for consultation.");
      return;
    }

    if (!authToken) {
      alert("You must be logged in to request a consultation.");
      return;
    }

    // Frontend validation: Prevent submission if an existing case is detected
    if (hasExistingCase) {
      alert(
        "You already have an active case associated with your account. You cannot create a new one with current system rules. Please contact support or update your existing case."
      );
      return;
    }

    if (uploadedFiles.length === 0) {
      setFileError("At least one document is required.");
      return;
    } else {
      setFileError(null);
    }

    setIsSubmitting(true);

    try {
      const caseFormData = new FormData();
      caseFormData.append("title", values.caseTitle);
      caseFormData.append("description", values.caseDescription);
      uploadedFiles.forEach((file) => {
        caseFormData.append("document", file); // Changed from 'documents' to 'document'
      });

      console.log("--- Submitting to /api/cases ---");
      for (const [key, value] of caseFormData.entries()) {
        console.log(`${key}:`, value);
      }

      const caseCreationResponse = await fetch(
        "https://main-backend-aan1.onrender.com/api/cases",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: caseFormData,
        }
      );

      if (!caseCreationResponse.ok) {
        const errorData = await caseCreationResponse.json().catch(() => ({
          message: "Unknown error during case creation (non-JSON response).",
        }));
        console.error("Error response from /api/cases:", errorData);
        throw new Error(
          errorData.message ||
            `Failed to create case: HTTP ${caseCreationResponse.status}`
        );
      }

      const createdCase = await caseCreationResponse.json();
      // --- START DEBUGGING LOG ---
      console.log("Full successful response from /api/cases:", createdCase);
      // --- END DEBUGGING LOG ---

      const caseId = createdCase.id; // Expecting 'id' property here

      if (!caseId) {
        // --- START DEBUGGING LOG ---
        console.error(
          "Backend response for /api/cases did not contain an 'id' property:",
          createdCase
        );
        // --- END DEBUGGING LOG ---
        throw new Error(
          "Case ID not returned from /api/cases, cannot proceed with case request. Please check backend response structure."
        );
      }

      const caseRequestPayload = {
        case: caseId,
        attorney: attorney.id,
      };

      console.log("--- Submitting to /api/case-requests ---");
      console.log("Payload:", caseRequestPayload);

      const caseRequestResponse = await fetch(
        "https://main-backend-aan1.onrender.com/api/case-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(caseRequestPayload),
        }
      );

      if (!caseRequestResponse.ok) {
        const errorData = await caseRequestResponse.json().catch(() => ({
          message:
            "Unknown error during request association (non-JSON response).",
        }));
        console.error("Error response from /api/case-requests:", errorData);
        throw new Error(
          errorData.message ||
            `Failed to associate case with attorney: HTTP ${caseRequestResponse.status}`
        );
      }

      console.log("Successful response from /api/case-requests.");

      setIsSubmitting(false);
      onClose();
      form.reset();
      setUploadedFiles([]);
      setFileError(null);
      alert("Consultation request submitted successfully!");
    } catch (error: unknown) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      alert(
        `Error submitting request: ${
          error instanceof Error ? error.message : "Please try again."
        }`
      );
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);

    if (files.length !== validFiles.length) {
      alert("Some files exceeded the 5MB size limit and were not added.");
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
    setFileError(null);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length === 1 && fileError) {
      setFileError("At least one document is required.");
    }
  };

  if (!attorney) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Request Consultation with {attorney.user.first_name}{" "}
            {attorney.user.last_name}
          </DialogTitle>
          <DialogDescription>
            Please provide details about your case to help the attorney prepare
            for your consultation.
          </DialogDescription>
        </DialogHeader>

        {isLoadingCaseStatus ? (
          <div className="flex flex-col items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-[#1e2e45] mb-2" />
            <span className="text-gray-600">
              Checking your existing case status...
            </span>
          </div>
        ) : hasExistingCase ? (
          <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <p className="text-yellow-800 font-semibold text-lg mb-4">
              You already have an active case associated with your account.
            </p>
            <p className="text-gray-700 text-sm mb-6">
              According to current system rules, you cannot create a new case.
              Please contact support if you need to update your existing case or
              if you believe this is an error.
            </p>
            <Button
              type="button"
              onClick={onClose}
              className="bg-[#1e2e45] hover:bg-[#1e2e45]/90"
            >
              Close
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Case Title Form Field */}
              <FormField
                control={form.control}
                name="caseTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g., Property Dispute Resolution"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief title that summarizes your legal issue.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Case Description Form Field */}
              <FormField
                control={form.control}
                name="caseDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a detailed description of your legal issue, including relevant background information, timeline, and specific questions you'd like to discuss..."
                        className="resize-none min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible to help the attorney
                      understand your case.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Document Upload Section UI */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Supporting Documents
                  </label>
                  <span className="text-xs text-gray-500">Required</span>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <FileText className="h-10 w-10 text-gray-400 mb-2" />
                    <h3 className="text-sm font-medium mb-1">
                      Upload Case Documents
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Upload relevant legal documents to help the attorney
                      understand your case better
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className="bg-[#1e2e45] text-white hover:bg-[#1e2e45]/90"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Select Files
                    </Button>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-center text-gray-500">
                      Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB per
                      file)
                    </p>
                  </div>
                </div>

                {fileError && (
                  <p className="text-sm font-medium text-red-500 mt-2 text-center">
                    {fileError}
                  </p>
                )}

                {/* Display List of Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">
                        Uploaded Documents ({uploadedFiles.length})
                      </h4>
                      {uploadedFiles.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUploadedFiles([]);
                            setFileError("At least one document is required.");
                          }}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove All
                        </Button>
                      )}
                    </div>
                    <div className="border rounded-md divide-y">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-[#1e2e45]" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium truncate max-w-[300px]">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {(file.size / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dialog Footer with Action Buttons */}
              <DialogFooter className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || hasExistingCase} // Disable if existing case found
                  className="bg-[#1e2e45] hover:bg-[#1e2e45]/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    "Submit Consultation Request"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
