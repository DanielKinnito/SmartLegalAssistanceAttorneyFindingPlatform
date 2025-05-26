"use client"; // This line makes this page a Client Component

import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation
import React, { useState } from "react";
import ClientForm from "./ClientSignup";
import AttorneySignup from "./AttorneySignup";

export default function SignupPage() {
  const router = useRouter(); // Initialize the router hook
  const [userType, setUserType] = useState<"client" | "attorney">("client"); // Default is client

  const handleUserTypeChange = (type: "client" | "attorney") => {
    setUserType(type);
  };

  return (
    <div className="flex flex-row items-center gap-10 justify-center h-screen py-10 bg-blue-950">
      {/* Left Side */}
      <div className="flex flex-col items-start justify-center w-1/2 h-full p-20 gap-5">
        <h1 className="text-4xl text-white">Welcome to</h1>
        <h1 className="text-4xl font-bold text-white">LawConnect</h1>
        <p className="text-gray-300">
          Facilitates connections between the community and affordable attorneys
        </p>
        <button
          className="px-7 py-1 rounded-4xl text-blue-950 bg-white hover:bg-gray-100 transition-colors cursor-pointer"
          type="button"
          onClick={() => router.push("/signin")}
        >
          Login
        </button>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-l-full">
        <div className="w-full flex flex-col items-center">
          {/* User Type Toggle */}
          <div className="flex flex-row p-1 bg-blue-950 rounded-full self-end mr-10 mb-20">
            <button
              type="button"
              onClick={() => handleUserTypeChange("client")}
              className={`px-5 py-1 rounded-full transition-colors ${
                userType === "client"
                  ? "text-blue-950 bg-white"
                  : "text-white bg-transparent hover:bg-blue-900"
              }`}
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange("attorney")}
              className={`px-5 py-1 rounded-full transition-colors ${
                userType === "attorney"
                  ? "text-blue-950 bg-white"
                  : "text-white bg-transparent hover:bg-blue-900"
              }`}
            >
              Attorney
            </button>
          </div>

          <h1 className="text-4xl font-bold text-blue-950 mb-10">Signup</h1>

          {userType === "client" ? (
            <ClientForm router={router} />
          ) : (
            <AttorneySignup router={router} />
          )}
        </div>
      </div>
    </div>
  );
}
