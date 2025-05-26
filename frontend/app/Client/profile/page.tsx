"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string; // The email used for the account, where OTP will be sent
  image: string | null;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserProfile>({
    first_name: "",
    last_name: "",
    email: "",
    image: null,
  });
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
  const [otpRequested, setOtpRequested] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0); // For OTP resend timer

  // --- Load existing data from localStorage on mount ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFirstName = localStorage.getItem("user_first_name") || "";
      const storedLastName = localStorage.getItem("user_last_name") || "";
      const storedEmail = localStorage.getItem("user_email") || "";
      const storedImage = localStorage.getItem("user_image") || null;

      setProfileData({
        first_name: storedFirstName,
        last_name: storedLastName,
        email: storedEmail,
        image: storedImage,
      });
    }
  }, []);

  // --- OTP Countdown Timer Effect ---
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer); // Cleanup on unmount or if countdown ends
  }, [countdown]);

  // --- Handlers for form input changes ---
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
      // Optional: Immediately show a preview of the new image
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData((prev) => ({
          ...prev,
          image: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  // --- Function to upload the image to the backend ---
  const uploadImage = async (): Promise<string | null> => {
    if (!profileImageFile) {
      return profileData.image; // No new file selected, return existing image URL
    }

    setError(null);
    setMessage(null);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      return null;
    }

    const formData = new FormData();
    formData.append("image", profileImageFile);

    try {
      const response = await fetch(
        "https://main-backend-aan1.onrender.com/api/user/uploadimage", // Your backend image upload endpoint
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image.");
      }

      const data = await response.json();
      const newImageUrl = data.data.image_url;

      localStorage.setItem("user_image", newImageUrl);
      setProfileData((prev) => ({ ...prev, image: newImageUrl }));
      setMessage("Image uploaded successfully!");
      setProfileImageFile(null);
      return newImageUrl;
    } catch (err: any) {
      console.error("Error uploading image:", err);
      setError(err.message || "Error uploading image.");
      return null;
    }
  };

  // --- Request OTP for Password Change ---
  const handleRequestOtp = async () => {
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Updated backend endpoint for requesting OTP
      const response = await fetch(
        "https://main-backend-aan1.onrender.com/api/createotp", // <--- UPDATED BACKEND ENDPOINT
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Still send token for authentication
          },
          body: JSON.stringify({ email: profileData.email }), // Send the user's email
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to request OTP.");
      }

      setMessage("OTP sent to your email. Please check your inbox.");
      setOtpRequested(true);
      setShowPasswordFields(true);
      setCountdown(60); // Start 60-second countdown for resend
    } catch (err: any) {
      console.error("Error requesting OTP:", err);
      setError(err.message || "Error requesting OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Handle overall profile update submission ---
  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("Authentication token not found. Please log in.");
      setIsSubmitting(false);
      return;
    }

    let updatedImageUrl = profileData.image;

    // If a new image file is selected, upload it first
    if (profileImageFile) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) {
        updatedImageUrl = uploadedUrl;
      } else {
        setIsSubmitting(false);
        return;
      }
    }

    // --- Handle Password Change if requested ---
    if (showPasswordFields) {
      if (!newPassword || !confirmPassword || !otp) {
        setError(
          "Please fill in new password, confirm password, and OTP fields."
        );
        setIsSubmitting(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match.");
        setIsSubmitting(false);
        return;
      }

      try {
        // Backend endpoint to verify OTP and reset password
        const passwordResetResponse = await fetch(
          "https://main-backend-aan1.onrender.com/api/user/reset-password-with-otp", // <--- NEW BACKEND ENDPOINT
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ otp: otp, new_password: newPassword }),
          }
        );

        if (!passwordResetResponse.ok) {
          const errorData = await passwordResetResponse.json();
          throw new Error(errorData.message || "Failed to change password.");
        }

        setMessage("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
        setOtp("");
        setOtpRequested(false);
        setShowPasswordFields(false);
      } catch (err: any) {
        setError(err.message || "Error changing password.");
        setIsSubmitting(false);
        return;
      }
    }

    // Final check to see if any updates were processed, otherwise show no changes.
    // This primarily caters to the scenario where neither image nor password was changed,
    // or if image upload is the only action.
    if (!showPasswordFields && !profileImageFile && message === null) {
      setError("No changes detected to update.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-950 mb-6 text-center">
          Update Profile
        </h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {message && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6">
            {profileData.image ? (
              <img
                src={profileData.image}
                alt="Profile Picture"
                width={120}
                height={120}
                className="rounded-full object-cover border-4 border-blue-950 mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm mb-4">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Personal Information Fields (Read-only) */}
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={profileData.first_name}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={profileData.last_name}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
              readOnly
            />
          </div>

          {/* Password Change Section */}
          {!showPasswordFields && (
            <button
              type="button"
              onClick={handleRequestOtp}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting || countdown > 0}
            >
              {isSubmitting && !otpRequested ? (
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
                  Sending OTP...
                </span>
              ) : (
                `Change Password ${countdown > 0 ? `(${countdown}s)` : ""}`
              )}
            </button>
          )}

          {showPasswordFields && (
            <>
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter OTP from email"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="new_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="new_password"
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirm_password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </>
          )}

          {/* Main Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-950 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            } ${showPasswordFields ? "mt-4" : "mt-8"}`}
            disabled={
              isSubmitting ||
              (showPasswordFields && (!otp || !newPassword || !confirmPassword))
            }
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
                Updating...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
