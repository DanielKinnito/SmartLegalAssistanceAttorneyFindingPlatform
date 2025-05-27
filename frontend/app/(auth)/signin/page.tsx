"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // For login submission
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isRequestingOtp, setIsRequestingOtp] = useState<boolean>(false); // For OTP request
  const [otpRequested, setOtpRequested] = useState<boolean>(false);
  const [isResettingPassword, setIsResettingPassword] =
    useState<boolean>(false); // For password reset
  const [countdown, setCountdown] = useState<number>(0); // For OTP resend timer

  // --- OTP Countdown Timer Effect ---
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer); // Cleanup on unmount or if countdown ends
  }, [countdown]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleForgotEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForgotEmail(e.target.value);
  };

  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        "https://main-backend-aan1.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login API error response (NOT OK):", errorData);
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("1. Login successful, received raw data:", data);

      const { user, access_token } = data.data;

      if (access_token) {
        console.log("3. Condition 'if (access_token)' is TRUE.");
        localStorage.setItem("access_token", access_token);
        console.log("4. Attempted to set access_token in localStorage.");
        const storedTokenCheck = localStorage.getItem("access_token");
        console.log(
          "5. Token in localStorage IMMEDIATELY AFTER SETTING:",
          storedTokenCheck
            ? "SET_SUCCESS (length: " + storedTokenCheck.length + ")"
            : "SET_FAILURE (token is null/empty)"
        );

        if (user) {
          localStorage.setItem("user_first_name", user.first_name || "");
          localStorage.setItem("user_last_name", user.last_name || "");
          localStorage.setItem("user_image", user.image || "");
          localStorage.setItem("user_email", user.email || "");
          console.log(
            "6. Stored user_first_name, user_last_name, user_image, user_email in localStorage."
          );
        } else {
          console.warn("User data not found in login response.");
        }
      } else {
        console.warn(
          "3. Condition 'if (access_token)' is FALSE. No access_token found or it was null/empty."
        );
        setError(
          "Login successful, but no access token was provided by the server."
        );
      }

      console.log("7. Redirecting to /Client...");
      router.push("/Client");
    } catch (error) {
      console.error("8. Login error caught in catch block:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
      console.log("9. Login process finished.");
    }
  };

  // --- Request OTP for Forgot Password ---
  const handleRequestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setIsRequestingOtp(true);
    setError(null);

    try {
      const response = await fetch(
        "https://main-backend-aan1.onrender.com/api/createotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to request OTP.");
      }

      setOtpRequested(true);
      setCountdown(60);
      setError(null);
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
    } catch (err: any) {
      console.error("Error requesting OTP:", err);
      setError(err.message || "Error requesting OTP.");
    } finally {
      setIsRequestingOtp(false);
    }
  };

  // --- Handle Password Reset ---
  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    setIsResettingPassword(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setIsResettingPassword(false);
      return;
    }

    try {
      const response = await fetch(
        "https://main-backend-aan1.onrender.com/api/user/reset-password-with-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp: otp, new_password: newPassword }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password.");
      }

      setError(null);
      setShowForgotPassword(false);
      setOtpRequested(false);
      setForgotEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setCountdown(0);
      alert(
        "Password reset successfully! Please log in with your new password."
      );
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setError(err.message || "Error resetting password.");
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="flex flex-row items-center gap-10 justify-center h-screen py-10 bg-blue-950">
      {/* Left Side - Welcome Section */}
      <div className="flex flex-col items-start justify-center w-1/2 h-full p-20 gap-5">
        <h1 className="text-4xl text-white">Welcome back to</h1>
        <h1 className="text-4xl font-bold text-white">LawConnect</h1>
        <p className="text-gray-300">
          Facilitates connections between the community and affordable attorneys
        </p>
        <button
          className="px-7 py-1 rounded-4xl text-blue-950 bg-white hover:bg-gray-100 transition-colors"
          type="button"
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </button>
      </div>

      {/* Right Side - Login/Forgot Password Form */}
      <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-l-full">
        {!showForgotPassword ? (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col items-center"
          >
            <h1 className="text-4xl font-bold text-blue-950 mb-10">Login</h1>

            <div className="flex flex-col justify-center m-5 w-3/5 gap-7">
              <div className="flex flex-col items-center justify-center text-blue-950 gap-5 w-full">
                <input
                  className="w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                />
                <input
                  className="w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              className={`px-10 py-2 rounded-full text-white bg-blue-950 hover:bg-blue-900 transition-colors mt-5 ${
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
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            {error && (
              <div className="mt-4 text-red-500 text-center max-w-md">
                {error}
              </div>
            )}

            <div className="mt-4 text-blue-950 text-center max-w-md">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          <div className="w-full flex flex-col items-center">
            <h1 className="text-4xl font-bold text-blue-950 mb-10">
              Forgot Password
            </h1>

            {!otpRequested ? (
              <form
                onSubmit={handleRequestOtp}
                className="w-full flex flex-col items-center"
              >
                <div className="flex flex-col justify-center m-5 w-3/5 gap-7">
                  <div className="flex flex-col items-center justify-center text-blue-950 gap-5 w-full">
                    <input
                      className="w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="email"
                      placeholder="Enter your registered email"
                      value={forgotEmail}
                      onChange={handleForgotEmailChange}
                      required
                    />
                  </div>
                </div>

                <button
                  className={`px-10 py-2 rounded-full text-white bg-blue-950 hover:bg-blue-900 transition-colors mt-5 ${
                    isRequestingOtp ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={isRequestingOtp || countdown > 0}
                >
                  {isRequestingOtp ? (
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
                    `Request OTP ${countdown > 0 ? `(${countdown}s)` : ""}`
                  )}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handlePasswordReset}
                className="w-full flex flex-col items-center"
              >
                <div className="flex flex-col justify-center m-5 w-3/5 gap-7">
                  <div className="flex flex-col items-center justify-center text-blue-950 gap-5 w-full">
                    <input
                      className="w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={handleOtpChange}
                      required
                    />
                    <input
                      className="w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      required
                    />
                    <input
                      className="w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                  </div>
                </div>

                <button
                  className={`px-10 py-2 rounded-full text-white bg-blue-950 hover:bg-blue-900 transition-colors mt-5 ${
                    isResettingPassword ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? (
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
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            )}

            {error && (
              <div className="mt-4 text-red-500 text-center max-w-md">
                {error}
              </div>
            )}

            <div className="mt-4 text-blue-950 text-center max-w-md">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setOtpRequested(false);
                  setForgotEmail("");
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setCountdown(0);
                  setError(null);
                }}
                className="hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
