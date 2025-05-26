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
  const [showPassword, setShowPassword] = useState(false);

    const handleForgotPassword = () => {
      alert("Forgot password clicked!");
    };


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
        console.error("Login API error response (NOT OK):", errorData);
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      console.log("1. Login successful, received raw data:", data);

      // --- CRITICAL FIX AND LOGGING ---
      // Your backend response structure: { data: { user: { ... }, access_token: "..." } }
      const { user, access_token } = data.data; // Destructure user and access_token

      if (access_token) {
        console.log("3. Condition 'if (access_token)' is TRUE.");
        
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("userRole", data.data.user.role);
        localStorage.setItem("userId", data.data.user.id);
        console.log("Data data", data.data);
        const storedTokenCheck = localStorage.getItem("access_token");
        console.log(
          "5. Token in localStorage IMMEDIATELY AFTER SETTING:",
          storedTokenCheck
            ? "SET_SUCCESS (length: " + storedTokenCheck.length + ")"
            : "SET_FAILURE (token is null/empty)"
        );

        // --- NEW: Store user details from the login response ---
        if (user) {
          localStorage.setItem("user_first_name", user.first_name || '');
          localStorage.setItem("user_last_name", user.last_name || '');
          // 'image' field can be null, so ensure to store a string or handle null
          localStorage.setItem("user_image", user.image || ''); // Store as empty string if null
          console.log("6. Stored user_first_name, user_last_name, user_image in localStorage.");
        } else {
          console.warn("User data not found in login response.");
        }
        // --- END NEW ---

      } else {
        console.warn(
          "3. Condition 'if (access_token)' is FALSE. No access_token found or it was null/empty."
        );
        setError(
          "Login successful, but no access token was provided by the server."
        );
      }
      // --- END CRITICAL FIX AND LOGGING ---
       const usersRole = localStorage.getItem("userRole")
       console.log("5. Role retrieved from localStorage:", usersRole);
       if (usersRole && usersRole == "attorney") {
        router.push("/Attorney/profile")
      }else{
        console.log("6. Redirecting to /Client...");
        router.push("/Client");
      }

     
    } catch (error) {
      console.error("8. Login error caught in catch block:", error); // Changed from 7 to 8
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
      console.log("9. Login process finished."); // Changed from 8 to 9
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
        <div className="relative w-full">
          <input
            className="w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-950"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.822-.642 1.603-1.09 2.325M15.54 15.54A9.978 9.978 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675" />
              </svg>
            )}
          </button>
        </div>
        {/* Password strength indicator */}
        
      </div>
      <div className="flex items-center justify-between w-full">
        
        <button
          type="button"
          className="text-blue-950 hover:underline text-sm"
          onClick={handleForgotPassword}
        >
          Forgot password?
        </button>
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
          {/* ...spinner svg... */}
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
  </form>
      </div>
    </div>
  );
};

export default Login;