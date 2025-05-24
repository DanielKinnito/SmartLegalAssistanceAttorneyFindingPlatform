"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/services/attorney_api";
import Link from "next/link";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await login({
        email: loginData.email,
        password: loginData.password,
      });

      if (response.success && response.statuscode === 200) {
        const accessToken = response.data?.access_token;
        const refreshToken = response.data?.refresh_token;
        const userRole = response.data?.user?.role;
        const userId = response.data?.user?.id;
        if (accessToken && userRole && userId) {
          localStorage.setItem("authToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken || "");
          localStorage.setItem("userRole", userRole);
          localStorage.setItem("userId", userId);
        } else {
          throw new Error("No token, role, or userId received from server");
        }
        console.log("Login successful:", response);
        router.push("/Attorney/profile");
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row items-center gap-10 justify-center h-screen py-10 bg-blue-950">
      {/* Left Side - Welcome Section */}
      <div className="flex flex-col items-start justify-center w-1/2 h-full p-20 gap-5">
        <h1 className="text-4xl text-white">Welcome back to</h1>
        <h1 className="text-4xl font-bold text-white">LawConnect</h1>
        <p className="text-gray-300">Facilitates connections between the community and affordable attorneys</p>
        <Link href="/signup">
          <button
            className="px-7 py-1 rounded-4xl text-blue-950 bg-white hover:bg-gray-100 transition-colors"
            type="button"
          >
            Sign Up
          </button>
        </Link>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-l-full">
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <h1 className="text-4xl font-bold text-blue-950 mb-10">Login</h1>

          {/* Form Inputs */}
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

          {/* Submit Button */}
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-red-500 text-center max-w-md">
              {error}
            </div>
          )}

          {/* Forgot Password Link */}
          <div className="mt-4 text-blue-950 text-center max-w-md">
            <a href="#" className="hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}