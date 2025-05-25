import axios from "axios";

// Base URL from environment variables or fallback
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

interface SignupResponse {
  success: boolean;
  message: string;
  tempToken: string; // Temporary token to pass to OTP page
}

interface OtpResponse {
  success: boolean;
  message: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      email: string;
      role: string;
      id: string;
      first_name: string;
      last_name: string;
      image: string | null;
      created_at: string;
      updated_at: string;
    };
    access_token?: string;
    refresh_token?: string;
  };
  error: any[];
  statuscode: number;
}

interface UpdateEducationExperienceBody {
  education?: {
    institution?: string;
    degree?: string;
    year?: string | number;
  };
  experience?: {
    organization?: string;
    title?: string;
    years?: string | number;
  };
}

interface UpdateEducationExperienceResponse {
  success: boolean;
  message: string;
  data: any;
  error: any[];
  statuscode: number;
}

interface DeleteEducationExperienceResponse {
  success: boolean;
  message: string;
  data: any;
  error: any[];
  statuscode: number;
}

/**
 * Creates a new attorney account.
 * @param formData - FormData containing first_name, last_name, email, phone, password, role, and license_document.
 * @returns Promise resolving to the signup API response.
 * @throws Error if the signup fails.
 */
export const createAttorney = async (formData: FormData): Promise<SignupResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  console.log(`Creating attorney at ${baseUrl}/api/createuser`);

  const response = await fetch(`${baseUrl}/api/createuser`, {
    method: "POST",
    body: formData,
  });

  console.log("Create attorney response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.log("Create attorney response body:", errorText);
    throw new Error(`Failed to create attorney: ${response.status} - ${errorText}`);
  }

  return response.json();
};

/**
 * Verifies the OTP for the user.
 * @param email - The user's email.
 * @param otp - The OTP entered by the user.
 * @param tempToken - Temporary token from signup response.
 * @returns Promise resolving to the OTP verification API response.
 * @throws Error if the verification fails.
 */
export const verifyOtp = async (email: string, otp: string): Promise<OtpResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  console.log(`Verifying OTP at ${baseUrl}/api/verifyotp`);

  const response = await fetch(`${baseUrl}/api/verifyotp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });

  console.log("OTP verification response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.log("OTP verification response body:", errorText);
    throw new Error(`Failed to verify OTP: ${response.status} - ${errorText}`);
  }

  return response.json();
};

/**
 * Resends the OTP for the user.
 * @param email - The user's email.
 * @param tempToken - Temporary token from signup response.
 * @returns Promise resolving to the OTP resend API response.
 * @throws Error if the resend fails.
 */
export const resendOtp = async (email: string, tempToken: string): Promise<OtpResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  console.log(`Resending OTP at ${baseUrl}/api/resend-otp`);

  const response = await fetch(`${baseUrl}/api/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tempToken}`,
    },
    body: JSON.stringify({ email }),
  });

  console.log("OTP resend response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.log("OTP resend response body:", errorText);
    throw new Error(`Failed to resend OTP: ${response.status} - ${errorText}`);
  }

  return response.json();
};

/**
 * Logs in a user.
 * @param data - The login credentials (email and password).
 * @returns Promise resolving to the API response with user details and token.
 * @throws Error if the login fails.
 */
export const login = async (data: LoginData): Promise<LoginResponse> => {
  console.log("Logging in with:", data);
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log("Login response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.log("Login response body:", errorText);
    throw new Error(`Failed to login: ${response.status} - ${errorText}`);
  }

  return response.json();
};

/**
 * Uploads a license file for an attorney.
 * @param licenseFile - The file to upload.
 * @returns Promise resolving when the upload is successful.
 * @throws Error if the upload fails.
 */
export const uploadLicense = async (licenseFile: File): Promise<void> => {
  const formData = new FormData();
  formData.append("file", licenseFile);

  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("No authentication token found");
  }

  console.log("Uploading license file:", licenseFile.name, "to", `${BASE_URL}/api/attorney/uploadlicense`);
  const response = await fetch(`${BASE_URL}/api/attorney/uploadlicense`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("Upload license response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.log("Upload license response body:", errorText);
    throw new Error(`Failed to upload license: ${response.status} - ${errorText}`);
  }

  console.log("License upload successful");
};

/**
 * Logs out the user by clearing token, role, userId, and refreshToken from localStorage.
 */
export const logout = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userId");
  localStorage.removeItem("refreshToken");
  console.log("User logged out, localStorage cleared");
};

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function to check if an object is "empty"
const isEmptyObject = (obj: Record<string, any>) => {
  return Object.values(obj).every((value) => value === "" || value === null);
};

// Fetch education and experience data for an attorney
export const fetchEducationAndExperience = async (attorneyid: string) => {
  try {
    console.log(`Fetching data for attorneyid: ${attorneyid} from ${BASE_URL}api/attorney/educationandexperience/${attorneyid}`);
    const response = await api.get(`api/attorney/educationandexperience/${attorneyid}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching education and experience:", error);
    throw error;
  }
};

// Create new education or experience entry
export const createEducationAndExperience = async (
  attorneyid: string,
  data: { education?: any; experience?: any }
) => {
  try {
    let payload: any = {};

    // Only include education if present and not empty, otherwise only experience if present and not empty
    if (data.education && !isEmptyObject(data.education)) {
      payload = { education: data.education };
    } else if (data.experience && !isEmptyObject(data.experience)) {
      payload = { experience: data.experience };
    } else {
      throw new Error("Either education or experience must be provided and not empty.");
    }

    console.log(
      `Creating education/experience for attorneyid: ${attorneyid} at ${BASE_URL}/api/attorney/educationandexperience with payload:`,
      payload
    );
    const response = await api.post(`api/attorney/educationandexperience`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating education/experience:", error);
    throw error;
  }
};

// Update existing education or experience entry
export const updateEducationAndExperience = async (
  education_experienceid: string,
  body: UpdateEducationExperienceBody,
  token: string
): Promise<UpdateEducationExperienceResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  console.log(`Updating education/experience with ID: ${education_experienceid}`);
  console.log('Update payload:', body);

  const response = await fetch(`${baseUrl}/api/attorney/educationandexperience/${education_experienceid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Update education/experience response body:", errorText);
    throw new Error(`Failed to update education/experience: ${response.status} - ${errorText}`);
  }

  return response.json();
};

// Delete education or experience entry
export const deleteEducationAndExperience = async (
  education_experienceid: string,
  token: string
): Promise<DeleteEducationExperienceResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  console.log(`Deleting education/experience with ID: ${education_experienceid}`);

  const response = await fetch(`${baseUrl}/api/attorney/educationandexperience/${education_experienceid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Delete education/experience response body:", errorText);
    throw new Error(`Failed to delete education/experience: ${response.status} - ${errorText}`);
  }

  return response.json();
};

// Get education and experience data for a user by userID from localStorage
export const getEducationAndExperienceByUserId = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      throw new Error("No userId found in localStorage");
    }
    console.log(`Fetching education/experience for userId: ${userId} from ${BASE_URL}/api/attorney/educationandexperience/${userId}`);
    const response = await api.get(`/api/attorney/educationandexperience/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching education/experience by userId:", error);
    throw error;
  }
};