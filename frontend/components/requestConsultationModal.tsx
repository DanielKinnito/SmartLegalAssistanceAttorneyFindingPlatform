"use client";

import React, { useState, useEffect } from "react";
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
import { FileText, Loader2, Upload, X, CheckCircle2 } from "lucide-react"; // Added CheckCircle2 for success icon

interface Attorney {
  id: string; // This is the attorney's specific PROFILE ID
  user: {
    id: string; // This is the attorney's USER ID
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
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(
    null
  ); // New state for success message

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caseTitle: "",
      caseDescription: "",
    },
  });

  // Reset form and states when the modal opens
  useEffect(() => {
    if (isOpen) {
      form.reset();
      setUploadedFiles([]);
      setFileError(null);
      setSubmissionError(null);
      setSubmissionSuccess(null); // Clear success message on open
    }
  }, [isOpen, form]);

  const onSubmit = async (values: FormData) => {
    setSubmissionError(null); // Clear any previous submission errors
    setSubmissionSuccess(null); // Clear any previous success messages

    // Frontend validation: Ensure attorney object and its user ID are present
    if (!attorney || !attorney.user || !attorney.user.id) {
      setSubmissionError(
        "Attorney user information is incomplete. Please try again or select a different attorney."
      );
      return;
    }

    if (!authToken) {
      setSubmissionError("You must be logged in to request a consultation.");
      return;
    }

    if (uploadedFiles.length === 0) {
      setFileError("At least one document is required.");
      return;
    } else {
      setFileError(null); // Clear file error if files are present
    }

    setIsSubmitting(true);

    try {
      // --- Step 1: Create the Case ---
      const caseFormData = new FormData();
      caseFormData.append("title", values.caseTitle);
      caseFormData.append("description", values.caseDescription);
      uploadedFiles.forEach((file) => {
        caseFormData.append("document", file);
      });

      const caseCreationResponse = await fetch(
        "https://main-backend-aan1.onrender.com/api/cases",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`, // FormData handles Content-Type automatically
          },
          body: caseFormData,
        }
      );

      if (!caseCreationResponse.ok) {
        let errorDetails = "Unknown error during case creation.";
        try {
          const errorData = await caseCreationResponse.json();
          errorDetails = errorData.message || JSON.stringify(errorData);
          if (errorData.errors) {
            errorDetails += " Details: " + JSON.stringify(errorData.errors);
          }
        } catch (jsonError) {
          const textError = await caseCreationResponse.text();
          errorDetails = `Non-JSON error: ${textError}`;
        }
        throw new Error(
          `Failed to create case: HTTP ${caseCreationResponse.status}. ${errorDetails}`
        );
      }

      const createdCaseData = await caseCreationResponse.json();

      // Verify and extract caseId
      const caseId = createdCaseData.data?.id;
      if (!caseId) {
        throw new Error(
          "Failed to create case: Case ID could not be retrieved from the server response."
        );
      }

      // --- Step 2: Create the Case Request to link the case and attorney ---
      const caseRequestPayload = {
        case: caseId, // Using the extracted case ID
        attorney: attorney.user.id, // Using the attorney's user ID
      };

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
        let errorDetails = "Unknown error during request association.";
        try {
          const errorData = await caseRequestResponse.json();
          errorDetails = errorData.message || JSON.stringify(errorData);
          if (errorData.errors) {
            errorDetails += " Details: " + JSON.stringify(errorData.errors);
          }
        } catch (jsonError) {
          const textError = await caseRequestResponse.text();
          errorDetails = `Non-JSON error: ${textError}`;
        }
        throw new Error(
          `Failed to associate case with attorney: HTTP ${caseRequestResponse.status}. ${errorDetails}`
        );
      }

      // Set success message and then close modal after a delay
      setSubmissionSuccess("Consultation request submitted successfully!");
      setTimeout(() => {
        onClose(); // Close the modal
        form.reset(); // Reset form fields
        setUploadedFiles([]); // Clear uploaded files
        setFileError(null); // Clear any file errors
        setSubmissionSuccess(null); // Clear success message after modal closes
      }, 7000); // Display message for 7 seconds before closing
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      setSubmissionError(`Error submitting request: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024); // 5MB

    if (files.length !== validFiles.length) {
      alert("Some files exceeded the 5MB size limit and were not added.");
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
    setFileError(null); // Clear file error when new files are added
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      // If no files left after removal, set file error
      if (newFiles.length === 0) {
        setFileError("At least one document is required.");
      }
      return newFiles;
    });
  };

  // Don't render modal if attorney or its user ID is missing
  if (!attorney || !attorney.user || !attorney.user.id) return null;

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Success Message Display */}
            {submissionSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center justify-center text-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span className="block sm:inline">{submissionSuccess}</span>
              </div>
            )}

            {/* Form Fields (hidden when success message is shown) */}
            {!submissionSuccess && (
              <>
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
                              setFileError(
                                "At least one document is required."
                              );
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
              </>
            )}

            {submissionError && (
              <p className="text-sm font-medium text-red-500 text-center mt-4">
                {submissionError}
              </p>
            )}

            <DialogFooter className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !!submissionSuccess} // Disable submit button if success message is showing
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
      </DialogContent>
    </Dialog>
  );
}
