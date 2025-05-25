"use client";

import { Person } from "@mui/icons-material";

interface BasicUserInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  image: string | null;
  isApproved?: boolean;
}

export default function BasicUserInfo({
  firstName,
  lastName,
  email,
  role,
  image,
  isApproved
}: BasicUserInfoProps) {
  return (
    <div className="border-b pb-4 mb-4">
      <h4 className="text-lg font-medium mb-3">Basic Information</h4>
      <div className="flex items-start gap-6">
        {image ? (
          <img 
            src={image} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <Person className="text-gray-400 text-4xl" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-lg font-medium text-gray-800">{`${firstName} ${lastName}`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email Address</p>
              <p className="text-gray-800">{email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="text-gray-800 capitalize">{role}</p>
            </div>
            {isApproved !== undefined && (
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-gray-800">{isApproved ? "Approved" : "Pending Approval"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 