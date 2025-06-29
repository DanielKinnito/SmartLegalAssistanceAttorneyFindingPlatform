"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createAttorney } from "@/app/services/attorney_api";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  document?: File | null;
  role?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  tempToken: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    document: null,
    role: "attorney",
  });
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLicenseFile(file);
      setFormData(prev => ({
        ...prev,
        document: file
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    data.append("first_name", formData.firstName);
    data.append("last_name", formData.lastName);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("confirm_password", formData.confirmPassword);
    data.append("role", "attorney");
    
    if (!formData.document) {
      setError("License document is required");
      setIsSubmitting(false);
      return;
    }
    
    data.append("document", formData.document);

    try {
      const response = await createAttorney(data);
      if (response.success) {
        router.push(`/otp?email=${encodeURIComponent(formData.email)}&tempToken=${encodeURIComponent(response.tempToken)}`);
      } else {
        setError(response.message || "Failed to create attorney account");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create attorney account");
    } finally {
      setIsSubmitting(false);
    }
  };
function PasswordStrength({ password }: { password: string }) {
  let strength = "";
  if (!password) strength = "";
  else if (password.length < 6) strength = "Weak";
  else if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) strength = "Strong";
  else strength = "Medium";
}
  return (
    <div className='flex flex-col items-center justify-center w-full h-full '>
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">

        {/* Form Inputs - Two Columns */}
        <div className='flex flex-row justify-center w-3/5 gap-5 mb-5'>
          {/* Left Column */}
          <div className='flex flex-col gap-3 w-1/2 text-blue-950'>
            <input
              className='w-full px-5 py-1.5 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="text"
              placeholder='First Name'
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              className='w-full px-5 py-1.5 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="email"
              placeholder='Email'
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className='w-full px-5 py-1.5 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="password"
              placeholder='Password (min 6 characters)'
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          {/* Right Column */}
          <div className='flex flex-col gap-3 w-1/2 text-blue-950'>
            <input
              className='w-full px-5 py-1.5 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="text"
              placeholder='Last Name'
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            
            <input
              className='w-full px-5 py-1.5 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
              type="password"
              placeholder='Confirm Password'
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>
        </div>
        
        {/* License Document Upload */}
        <div className='w-3/5 mb-5'>
          <label className='block text-sm text-blue-950 mb-2'>Upload License Document</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            required
            className='w-full px-5 py-1.5 text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Submit Button */}
        <button
          className={`px-10 py-2 rounded-full text-white bg-blue-950 hover:bg-blue-900 transition-colors mt-5 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : 'Sign Up'}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-500 text-center max-w-md">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

