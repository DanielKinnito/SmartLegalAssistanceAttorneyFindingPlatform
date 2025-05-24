"use client";

import React, { useState, FormEvent, ChangeEvent } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface ApiResponse {
  id?: number;
  name: string;
  email: string;
  phone: string;
  userType: 'Client';
}

const ClientSignup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    // Validation
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

    try {
      console.log('Creating client with:', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        role: 'client',
      });
      const createUserResponse = await fetch(`${BASE_URL}/api/createuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          role: 'client',
        }),
      });

      console.log('Create user response status:', createUserResponse.status);
      if (!createUserResponse.ok) {
        const errorText = await createUserResponse.text();
        console.log('Create user response body:', errorText);
        throw new Error(`Failed to create client: ${createUserResponse.status} - ${errorText}`);
      }

      const userData: ApiResponse = await createUserResponse.json();
      console.log('Client created:', userData);
      setSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-full h-full bg-white rounded-l-full'>
      <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
        <h1 className='text-4xl font-bold text-blue-950 mb-10'>Client Signup</h1>

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
              type="tel"
              placeholder='Phone Number'
              name="phone"
              value={formData.phone}
              onChange={handleChange}
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
          ) : 'Signup'}
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
            Client created successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default ClientSignup;