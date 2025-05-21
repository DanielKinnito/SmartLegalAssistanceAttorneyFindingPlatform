const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

// Base user interface
interface BaseUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

// Client specific data
interface ClientData {
  id: string;
  user: BaseUser;
  is_probono: boolean;
  probono_document: string;
  probono_status: string;
  probono_rejected_reason: string | null;
  probono_approved_at: string | null;
  probono_expires_at: string | null;
}

// Attorney specific data
interface AttorneyData {
  id: string;
  user: BaseUser;
  starting_price: number | null;
  is_available: boolean;
  offers_probono: boolean;
  address: string;
  rating: number;
  profile_completion: number;
  license_document: string;
  is_approved: boolean;
  expertise: string[];
}

// Admin specific data
interface AdminData extends BaseUser {
  id: string;
}

// Response interfaces for each user type
interface ClientResponse {
  User: {
    Role: "client";
    data: ClientData;
  }
}

interface AttorneyResponse {
  User: {
    Role: "attorney";
    data: AttorneyData;
  }
}

interface AdminResponse {
  User: {
    Role: "admin";
    data: AdminData;
  }
}

// Union type for all possible responses
type UserResponse = ClientResponse | AttorneyResponse | AdminResponse;

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  is_attorney_approved?: boolean;
  // Potentially add password and confirm_password if needed for any operations
  // password?: string;
  // confirm_password?: string;
}

interface CreateAdminData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: string; // Add the role field
  is_attorney_approved?: boolean; // Add this if it's part of admin creation
}

interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  is_attorney_approved?: boolean;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const adminService = {
  // Create a new admin user
  async createAdmin(data: CreateAdminData): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/createadmin`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create admin');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Create admin failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while creating admin');
    }
  },

  // Updated getUserAttorney method to handle different user types
  async getUserAttorney(): Promise<UserResponse[]> {
    try {
      const response = await fetch(`${API_URL}/listusers`, {
        method: 'GET',
        headers: getAuthHeader(),
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch users');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Fetch users failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching users');
    }
  },

  // Helper method to check user type
  isClient(user: UserResponse): user is ClientResponse {
    return user.User.Role === "client";
  },

  isAttorney(user: UserResponse): user is AttorneyResponse {
    return user.User.Role === "attorney";
  },

  isAdmin(user: UserResponse): user is AdminResponse {
    return user.User.Role === "admin";
  },

  // Get list of all users
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_URL}/listusers`, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch users');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Fetch users failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching users');
    }
  },

  // Get user details by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/getuserbyid/${id}`, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Fetch user failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching user');
    }
  },

  // Update user details
  async updateUser(id: string, data: UpdateUserData): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/getuserbyid/${id}`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Update user failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while updating user');
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/getuserbyid/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete user');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Delete user failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while deleting user');
    }
  },

  // Toggle attorney approval
  async toggleAttorneyApproval(id: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/attorney/toggleapproval/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to toggle attorney approval');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Toggle attorney approval failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while toggling attorney approval');
    }
  },
};
