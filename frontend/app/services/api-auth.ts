const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

interface LoginResponse {
  data: {
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      image: string | null;
      created_at: string;
      updated_at: string;
    };
    access_token: string;
    refresh_token: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      // Store tokens in localStorage
      localStorage.setItem('access_token', data.data.access_token);
      localStorage.setItem('refresh_token', data.data.refresh_token);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred during login');
    }
  },

  logout(): void {
    // Clear all auth-related data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // You can add more cleanup here if needed
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
};
