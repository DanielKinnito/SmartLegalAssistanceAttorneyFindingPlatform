import { Button } from "@/components/ui/button"

export function Settings() {
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
            <button className="bg-[#29374A] text-white px-4 py-2 rounded hover:bg-opacity-90">
              Update Profile
            </button>
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
            <button className="bg-[#29374A] text-white px-4 py-2 rounded hover:bg-opacity-90">
              Update Password
            </button>
          </form>
        </section>

        {/* Notification Settings */}
        <section className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <div className="flex items-center space-x-4">
            <input type="checkbox" id="emailNotifications" className="h-4 w-4" />
            <label htmlFor="emailNotifications" className="text-sm">
              Enable email notifications for new user sign-ups
            </label>
          </div>
        </section>

        {/* Role Reassignment */}
        <section className="bg-white shadow rounded p-4">
          <h3 className="text-lg font-semibold mb-4">Role Reassignment</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select User</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">-- Select User --</option>
                <option value="user1">John Doe (Client)</option>
                <option value="user2">Jane Smith (Attorney)</option>
                <option value="user3">Mike Admin (Admin)</option>
                {/* Replace with real user data */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Assign New Role</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="">-- Select Role --</option>
                <option value="admin">Admin</option>
                <option value="attorney">Attorney</option>
                <option value="client">Client</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-[#29374A] text-white px-4 py-2 rounded hover:bg-opacity-90"
            >
              Update Role
            </button>
          </form>
        </section>

      </div>
    </div>
  )
}
