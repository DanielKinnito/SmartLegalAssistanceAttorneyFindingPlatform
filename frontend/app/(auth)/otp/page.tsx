"use client";

import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "@/app/services/attorney_api";

export default function OtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const tempToken = searchParams.get("tempToken") || "";
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [resendEnabled, setResendEnabled] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email || !tempToken) {
      setError("Invalid or missing email/token");
    }
  }, [email, tempToken]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && !resendEnabled) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setResendEnabled(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, resendEnabled]);

  const handleChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = Array(6).fill("");
    for (let i = 0; i < paste.length; i++) {
      newOtp[i] = paste[i];
    }
    setOtp(newOtp);
    inputRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a 6-digit OTP");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await verifyOtp(email, otpValue);
      if (response.success) {
        setSuccess(true);
        router.push("/signin");
      } else {
        setError(response.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Failed to verify OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    if (resendEnabled) {
      setTimeLeft(60);
      setResendEnabled(false);
      setOtp(Array(6).fill(""));
      console.log("Resending OTP...");
      inputRefs.current[0]?.focus();
      // Optionally, add API call to resend OTP if needed
    }
  };

  return (
    <div className="flex flex-row items-center gap-10 justify-center h-screen py-10 bg-blue-950">
      {/* Left Side - Welcome Section */}
      <div className="flex flex-col items-start justify-center w-1/2 h-full p-20 gap-5">
        <h1 className="text-4xl text-white">Welcome to</h1>
        <h1 className="text-4xl font-bold text-white">LawConnect</h1>
        <p className="text-gray-300">Facilitates connections between the community and affordable attorneys</p>
        <button
          className="px-7 py-1 rounded-4xl text-blue-950 bg-white hover:bg-gray-100 transition-colors"
          type="button"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
      </div>

      {/* Right Side - OTP Verification */}
      <div className="relative w-full h-full">
        <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-l-full">
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <h1 className="text-4xl font-bold text-blue-950 mb-10">OTP Verification</h1>

            {/* OTP Input Boxes */}
            <div className="flex flex-row gap-3 mb-5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  className="w-12 h-12 text-xl text-center rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  value={digit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  maxLength={1}
                  ref={(el: HTMLInputElement | null) => (inputRefs.current[index] = el)}
                />
              ))}
            </div>

            {/* Resend Timer */}
            <p className="mb-5 text-sm text-gray-600">
              {resendEnabled ? (
                <span onClick={handleResend} className="text-blue-950 cursor-pointer hover:underline">
                  Resend OTP
                </span>
              ) : (
                `Resend OTP in ${timeLeft}s`
              )}
            </p>

            {/* Submit Button */}
            <button
              className={`px-10 py-2 rounded-full text-white bg-blue-950 hover:bg-blue-900 transition-colors ${
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify"
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-4 text-red-500 text-center max-w-md">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-4 text-green-500 text-center max-w-md">
                OTP verified successfully! Redirecting to login...
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}