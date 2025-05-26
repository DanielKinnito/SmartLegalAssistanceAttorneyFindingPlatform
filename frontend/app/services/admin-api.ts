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
export type UserResponse = ClientResponse | AttorneyResponse | AdminResponse;

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
  image_url?: string;
}

interface ProBonoApprovalRequest {
  status: "pending" | "approved" | "rejected";
  rejected_reason?: string;
}

// Document interfaces
export interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  jurisdiction: string;
  language: string;
  proclamation_number: string;
  publication_year: number;
  document_url: string;
  created_at: string;
}

export interface CreateDocumentData {
  title: string;
  description: string;
  category: string;
  jurisdiction: string;
  language: string;
  proclamation_number: string;
  publication_year: number;
  document_file?: File;
}

export interface UpdateDocumentData {
  title?: string;
  description?: string;
  category?: string;
  jurisdiction?: string;
  language?: string;
  proclamation_number?: string;
  publication_year?: number;
  document_file?: File;
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
      const response = await fetch(`${API_URL}/getuserbyid/${id}/`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json',
        },
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
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          // 'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          throw new Error(errorData.message);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Toggle attorney approval error:', error);
      if (error instanceof Error) {
        throw new Error(`Toggle attorney approval failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while toggling attorney approval');
    }
  },

  // Toggle client pro bono approval
  async toggleClientProBonoApproval(clientId: string, data: ProBonoApprovalRequest): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/admin/probono/status/${clientId}`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeader(),
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: data.status,
          rejected_reason: data.rejected_reason || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message) {
          throw new Error(errorData.message);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Pro bono approval error:', error);
      if (error instanceof Error) {
        throw new Error(`Update pro bono status failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while updating pro bono status');
    }
  },

  // Document Management
  async getDocuments(): Promise<Document[]> {
    try {
      const response = await fetch(`${API_URL}/documents`, {
        // headers: getAuthHeader(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch documents');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Get documents failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching documents');
    }
  },

  async createDocument(formData: FormData): Promise<Document> {
    try {
      // Log the FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      const response = await fetch(`${API_URL}/documents/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Server error response:', error);
        throw new Error(error.message || 'Failed to create document');
      }

      return response.json();
    } catch (error) {
      console.error('Full error in createDocument:', error);
      if (error instanceof Error) {
        throw new Error(`Create document failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while creating document');
    }
  },

  async updateDocument(id: string, formData: FormData): Promise<Document> {
    try {
      // Log the FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      const response = await fetch(`${API_URL}/documents/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Server error response:', error);
        throw new Error(error.message || 'Failed to update document');
      }

      return response.json();
    } catch (error) {
      console.error('Full error in updateDocument:', error);
      if (error instanceof Error) {
        throw new Error(`Update document failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while updating document');
    }
  },

  async deleteDocument(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/documents/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete document');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Delete document failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while deleting document');
    }
  },

  // Upload user profile image
  async uploadProfileImage(imageFile: File): Promise<{ image_url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile); // Changed back to 'image' as that's what backend expects

      // Log the FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log('FormData entry:', pair[0], pair[1]);
      }

      const response = await fetch(`${API_URL}/user/uploadimage`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          // Don't set Content-Type header for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Upload image error response:', errorData);
        throw new Error(errorData?.message || 'Failed to upload image');
      }

      const data = await response.json();
      console.log('Upload image success response:', data);
      return { image_url: data.image_url || data.url };
    } catch (error) {
      console.error('Upload image error:', error);
      if (error instanceof Error) {
        throw new Error(`Upload image failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while uploading image');
    }
  },

  // Update user profile with image
  async updateUserProfile(userId: string, data: UpdateUserData & { image?: File }): Promise<User> {
    try {
      let imageUrl: string | undefined;

      // If there's a new image, upload it first
      if (data.image) {
        try {
          const imageResponse = await this.uploadProfileImage(data.image);
          imageUrl = imageResponse.image_url;
          console.log('Image uploaded successfully:', imageUrl);
        } catch (error) {
          console.error('Image upload failed:', error);
          // Continue with profile update even if image upload fails
        }
      }

      // Prepare the update data
      const updateData = {
        ...data,
        image_url: imageUrl,
      };
      delete updateData.image; // Remove the File object before sending

      console.log('Updating profile with data:', updateData);

      const response = await fetch(`${API_URL}/getuserbyid/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Update profile error response:', errorData);
        throw new Error(errorData?.message || 'Failed to update user profile');
      }

      const updatedUser = await response.json();
      console.log('Profile updated successfully:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      if (error instanceof Error) {
        throw new Error(`Update profile failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while updating profile');
    }
  }
};
