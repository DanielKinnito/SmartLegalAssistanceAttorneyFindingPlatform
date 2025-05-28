import axios from "axios";

// Base URL from environment variables or fallback
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Interface for LegalRequest (unchanged)
export interface LegalRequest {
  id: string;
  case: string; // Case ID
  attorney: string;
  status: "pending" | "accepted" | "declined";
  response_message: string | null;
  requested_at: string;
  responded_at: string | null;
}

// Interface for LegalRequestsResponse (unchanged)
export interface LegalRequestsResponse {
  success: boolean;
  message: string;
  data: LegalRequest[];
  error: any[];
  statuscode: number;
}

// Interface for Case
export interface Case {
  id: string;
  title: string;
  description: string;
  document: string;
  is_probono: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// Interface for CaseResponse
export interface CaseResponse {
  success: boolean;
  message: string;
  data: Case;
  error: any[];
  statuscode: number;
}

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch legal requests (unchanged)
export const fetchLegalRequests = async (): Promise<LegalRequestsResponse> => {
  try {
    const response = await api.get("/api/case-requests");
    return response.data;
  } catch (error) {
    console.error("Error fetching legal requests:", error);
    throw error;
  }
};

// Accept legal request (unchanged)
export const acceptLegalRequest = async (requestId: string): Promise<LegalRequestsResponse> => {
  try {
    const response = await api.patch(`/api/case-requests/${requestId}`, {
      status: "accepted",
      response: "Request accepted",
    });
    return response.data;
  } catch (error) {
    console.error("Error accepting legal request:", error);
    throw error;
  }
};

// Decline legal request (unchanged)
export const declineLegalRequest = async (requestId: string): Promise<LegalRequestsResponse> => {
  try {
    const response = await api.patch(`/api/case-requests/${requestId}`, {
      status: "declined",
      response: "Request declined",
    });
    return response.data;
  } catch (error) {
    console.error("Error declining legal request:", error);
    throw error;
  }
};

// Remove legal request (unchanged)
export const removeLegalRequest = async (requestId: string): Promise<LegalRequestsResponse> => {
  try {
    const response = await api.delete(`/api/cases/${requestId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing legal request:", error);
    throw error;
  }
};

// Fetch case by ID
export const fetchCaseById = async (caseId: string): Promise<CaseResponse> => {
  try {
    const response = await api.get(`/api/cases/${caseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching case ${caseId}:`, error);
    throw error;
  }
};