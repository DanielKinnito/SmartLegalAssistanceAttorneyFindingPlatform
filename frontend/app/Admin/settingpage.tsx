// pages/settings.tsx
import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <div className="space-y-6">

        {/* Profile Settings */}
        <section className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Admin Name</label>
              <input type="text" className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Update Profile</button>
          </form>
        </section>

        {/* Password Settings */}
        <section className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Change Password</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Current Password</label>
              <input type="password" className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">New Password</label>
              <input type="password" className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Update Password</button>
          </form>
        </section>

        {/* Notification Settings */}
        <section className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <div className="flex items-center space-x-4">
            <input type="checkbox" id="emailNotifications" className="h-4 w-4" />
            <label htmlFor="emailNotifications" className="text-sm">Enable email notifications for new user sign-ups</label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
