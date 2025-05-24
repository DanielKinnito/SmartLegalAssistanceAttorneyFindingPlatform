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

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        console.error("Login API error response (NOT OK):", errorData); // Log detailed error if not OK
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("1. Login successful, received raw data:", data); // THIS IS CRUCIAL
      console.log("2. Checking data.access_token:", data.data.access_token); // Make sure to access data.data.access_token based on your response structure

      // --- CRITICAL FIX AND LOGGING ---
      // Your backend response has data: { user: {}, access_token: "..." }
      // So you need to access data.data.access_token
      if (data.data && data.data.access_token) {
        console.log("3. Condition 'if (data.data.access_token)' is TRUE.");
        localStorage.setItem("access_token", data.data.access_token);
        console.log("4. Attempted to set access_token in localStorage.");
        const storedTokenCheck = localStorage.getItem("access_token");
        console.log(
          "5. Token in localStorage IMMEDIATELY AFTER SETTING:",
          storedTokenCheck
            ? "SET_SUCCESS (length: " + storedTokenCheck.length + ")"
            : "SET_FAILURE (token is null/empty)"
        );
      } else {
        console.warn(
          "3. Condition 'if (data.data.access_token)' is FALSE. No access_token found or it was null/empty."
        );
        // If this path is taken, it means the token was not found even though the API response was 200
        setError(
          "Login successful, but no access token was provided by the server."
        );
      }
      // --- END CRITICAL FIX AND LOGGING ---

      console.log("6. Redirecting to /Client...");
      router.push("/Client");
    } catch (error) {
      console.error("7. Login error caught in catch block:", error);
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
      console.log("8. Login process finished.");
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
        >
          Sign Up
        </button>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-l-full">
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
            <a href="#" className="hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
