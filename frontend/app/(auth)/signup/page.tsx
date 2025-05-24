"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientSignup from './ClientSignup';
import AttorneySignup from './AttorneySignup';

const Signup: React.FC = () => {
  const router = useRouter();
  const [userType, setUserType] = useState<'Client' | 'Attorney'>('Client');

  const handleUserTypeChange = (type: 'Client' | 'Attorney') => {
    setUserType(type);
  };

  const handleLoginClick = () => {
    router.push('/signin');
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
          onClick={handleLoginClick}
        >
          Login
        </button>
      </div>

      {/* Right Side - Signup Form */}
      <div className='relative w-full h-full'>
        {/* User Type Toggle */}
        <div className='flex flex-row p-1 bg-blue-950 rounded-full absolute right-10 top-20'>
          <button
            className={`px-5 py-1 rounded-full transition-colors ${
              userType === 'Client'
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
              userType === 'Attorney'
                ? 'text-blue-950 bg-white'
                : 'text-white bg-transparent hover:bg-blue-900'
            }`}
            type="button"
            onClick={() => handleUserTypeChange('Attorney')}
          >
            Attorney
          </button>
        </div>

        {/* Conditionally Render Client or Attorney Signup */}
        {userType === 'Client' ? <ClientSignup /> : <AttorneySignup />}
      </div>
    </div>
  );
};

export default Signup;