import React, { useState, FormEvent, ChangeEvent } from "react";
import { NextRouter } from "next/navigation";
import { createClientUser } from "@/app/services/client_api";

interface ClientFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: "client";
  document?: File | null;
}

const ClientForm: React.FC<{ router: NextRouter }> = ({ router }) => {
  const [formData, setFormData] = useState<ClientFormData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "client",
    document: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [wantsProBono, setWantsProBono] = useState<"yes" | "no">("no");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "document" && files) {
      setFormData((prev) => ({
        ...prev,
        document: files[0] || null,
      }));
    } else if (name === "wantsProBono") {
      setWantsProBono(value as "yes" | "no");
      if (value === "no") {
        setFormData((prev) => ({
          ...prev,
          document: null,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords don't match");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    if (wantsProBono === "yes" && !formData.document) {
      setError("Please upload a document for pro bono services");
      setIsSubmitting(false);
      return;
    }

    try {
      await createClientUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirm_password,
        role: formData.role,
        wantsProBono: wantsProBono === "yes",
        document: formData.document,
      });

      setSuccess(true);
      console.log("Registration submitted! Redirecting to OTP verification...");

      setTimeout(() => {
        router.push(`/otp?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during registration."
      );
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      <div className="w-3/5 flex flex-col gap-6">
        <div className="flex gap-7">
          <input
            className="w-1/2 px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            className="w-1/2 px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex gap-7">
          <input
            className="w-1/2 px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-1/2 px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password (min 6 characters)"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>
        <div className="flex gap-7">
          <input
            className="w-1/2 px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Confirm Password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            minLength={6}
            required
          />
          <div className="w-1/2"></div>
        </div>
        <div className="flex gap-7">
          <div className="w-1/2 flex flex-col gap-2">
            <label className="text-blue-950 font-medium">
              Do you want pro bono services?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wantsProBono"
                  value="no"
                  checked={wantsProBono === "no"}
                  onChange={handleChange}
                />
                No
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="wantsProBono"
                  value="yes"
                  checked={wantsProBono === "yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
            </div>
          </div>
          {wantsProBono === "yes" && (
            <div className="w-1/2">
              <input
                className="w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="file"
                name="document"
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleChange}
                required
              />
            </div>
          )}
          {wantsProBono === "no" && <div className="w-1/2"></div>}
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
            Processing...
          </span>
        ) : (
          "Signup"
        )}
      </button>

      {error && (
        <div className="mt-4 text-red-500 text-center max-w-md">{error}</div>
      )}
      {success && (
        <div className="mt-4 text-green-500 text-center max-w-md">
          Registration submitted! Please verify the OTP sent to your email.
        </div>
      )}
    </form>
  );
};

export default ClientForm;
