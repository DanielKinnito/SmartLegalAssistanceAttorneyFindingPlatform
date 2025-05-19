"use client"
import React, { useState, FormEvent, ChangeEvent } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'Client' | 'Attorney';
}

interface ApiResponse {
  id?: number;
  name: string;
  email: string;
  phone: string;
  userType: 'Client' | 'Attorney';
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'Client'
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeChange = (type: 'Client' | 'Attorney') => {
    setFormData(prev => ({
      ...prev,
      userType: type
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
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
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          userType: formData.userType,
          password: formData.password
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const data: ApiResponse = await response.json();
      console.log('Mock API Response:', data);
      setSuccess(true);
      
      setTimeout(() => {
        console.log('Redirecting...');
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-row items-center gap-10 justify-center h-screen py-10 bg-blue-950'>
      {/* Left Side - Welcome Section */}
      <div className='flex flex-col items-start justify-center w-1/2 h-full p-20 gap-5'>
        <h1 className='text-4xl text-white'>Welcome to</h1>
        <h1 className='text-4xl font-bold text-white'>LawConnect</h1>
        <p className='text-gray-300'>Facilitates connections between the community and affordable attorneys</p>
        <button 
          className='px-7 py-1 rounded-4xl text-blue-950 bg-white hover:bg-gray-100 transition-colors'
          type='button'
        >
          Login
        </button>
      </div>
      
      {/* Right Side - Signup Form */}
      <div className='flex flex-col items-center justify-center w-full h-full bg-white rounded-l-full'>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          {/* User Type Toggle */}
          <div className='flex flex-row p-1 bg-blue-950 rounded-full self-end mr-10 mb-20'>
            <button 
              className={`px-5 py-1 rounded-full transition-colors ${
                formData.userType === 'Client' 
                  ? 'text-blue-950 bg-white' 
                  : 'text-white bg-transparent hover:bg-blue-900'
              }`}
              type="button"
              onClick={() => handleUserTypeChange('Client')}
            >
              Client
            </button>
            <button 
              className={`px-5 py-1 rounded-full transition-colors ${
                formData.userType === 'Attorney' 
                  ? 'text-blue-950 bg-white' 
                  : 'text-white bg-transparent hover:bg-blue-900'
              }`}
              type="button"
              onClick={() => handleUserTypeChange('Attorney')}
            >
              Attorney
            </button>
          </div>
          
          <h1 className='text-4xl font-bold text-blue-950 mb-10'>Signup</h1>
          
          {/* Form Inputs - Two Columns */}
          <div className='flex flex-row justify-center m-5 w-3/5 gap-7'>
            {/* Left Column */}
            <div className='flex flex-col items-center justify-center text-blue-950 gap-5 w-full'>
              <input 
                className='w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                type="text" 
                placeholder='First Name'
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input 
                className='w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                type="email" 
                placeholder='Email'
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input 
                className='w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
            <div className='flex flex-col items-center justify-center text-blue-950 gap-5 w-full'>
              <input 
                className='w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                type="text" 
                placeholder='Last Name'
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <input 
                className='w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
                type="tel" 
                placeholder='Phone Number'
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <input 
                className='w-full px-7 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
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
              Signup successful! Redirecting...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;