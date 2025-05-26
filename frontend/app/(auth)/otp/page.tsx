"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "@/app/services/client_api";

const OtpVerificationPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setIsSubmitting(false);
      return;
    }

    try {
      await verifyOtp({ email, otp });
      setSuccess(true);
      console.log("OTP verification successful! Signup completed...");

      setTimeout(() => {
        router.push(`/signin?email=${email}`);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during OTP verification."
      );
      console.error("OTP verification error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-950">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-950 mb-6 text-center">
          OTP Verification
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          Enter the 6-digit OTP sent to {email}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={handleChange}
            maxLength={6}
            required
          />
          <button
            className={`px-6 py-2 rounded-full text-white bg-blue-950 hover:bg-blue-900 transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        {success && (
          <div className="mt-4 text-green-500 text-center">
            Successful signup! Redirecting to Pro Bono page...
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpVerificationPage;
