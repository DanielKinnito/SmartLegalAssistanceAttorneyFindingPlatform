const API_URL = "https://main-backend-aan1.onrender.com"

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not defined');
}

// Analytics response interfaces
interface DocumentUploads {
  Civil: number;
  Labor: number;
  Family: number;
  Criminal: number;
  Commercial: number;
  Investment: number;
  "Human Rights": number;
  Constitutional: number;
}

interface CaseRequests {
  "Art Law": number;
  "Tax Law": number;
  "Tort Law": number;
  "Cyber Law": number;
  "Drone Law": number;
  "Elder Law": number;
  "Labor Law": number;
  "Media Law": number;
  "Space Law": number;
  "Trade Law": number;
  "Animal Law": number;
  "Energy Law": number;
  "Family Law": number;
  "Sports Law": number;
  "Banking Law": number;
  "Fashion Law": number;
  "Aviation Law": number;
  "Contract Law": number;
  "Criminal Law": number;
  "Forensic Law": number;
  "Internet Law": number;
  "Juvenile Law": number;
  "Maritime Law": number;
  "Military Law": number;
  "Antitrust Law": number;
  "Education Law": number;
  "Franchise Law": number;
  "Insurance Law": number;
  "Nonprofit Law": number;
  "Bankruptcy Law": number;
  "E-Commerce Law": number;
  "Employment Law": number;
  "Healthcare Law": number;
  "Securities Law": number;
  "Technology Law": number;
  "Immigration Law": number;
  "Oil and Gas Law": number;
  "Real Estate Law": number;
  "Agricultural Law": number;
  "Civil Rights Law": number;
  "Data Privacy Law": number;
  "Human Rights Law": number;
  "Biotechnology Law": number;
  "Entertainment Law": number;
  "Environmental Law": number;
  "International Law": number;
  "Administrative Law": number;
  "Constitutional Law": number;
  "Pharmaceutical Law": number;
  "Transportation Law": number;
  "Estate Planning Law": number;
  "Native American Law": number;
  "Personal Injury Law": number;
  "Asset Protection Law": number;
  "Disability Rights Law": number;
  "Foreign Investment Law": number;
  "Trusts and Estates Law": number;
  "Consumer Protection Law": number;
  "Foreclosure Defense Law": number;
  "Information Security Law": number;
  "Mergers and Acquisitions": number;
  "Intellectual Property Law": number;
  "Workers' Compensation Law": number;
  "Immigration Compliance Law": number;
  "Social Security Disability Law": number;
}

export interface AnalyticsResponse {
  id: number;
  total_users: number;
  attorney_users: number;
  client_users: number;
  pending_approval: number;
  active_requests: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
  document_uploads: DocumentUploads;
  case_requests: CaseRequests;
  last_updated: string;
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

export const analyticsService = {
  // Get lifetime analytics
  async getLifetimeAnalytics(): Promise<AnalyticsResponse> {
    try {
      const response = await fetch(`${API_URL}/analytics/lifetime`, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch lifetime analytics');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Fetch lifetime analytics failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching lifetime analytics');
    }
  },

  // Get analytics for a specific date
  async getAnalyticsByDate(date: string): Promise<AnalyticsResponse> {
    try {
      const response = await fetch(`${API_URL}/analytics/lifetime?date=${date}`, {
        method: 'GET',
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch analytics for date');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Fetch analytics by date failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching analytics by date');
    }
  },

  // Get analytics for a date range
  async getAnalyticsByDateRange(startDate: string, endDate: string): Promise<AnalyticsResponse> {
    try {
      const response = await fetch(
        `${API_URL}/analytics/lifetime?start_date=${startDate}&end_date=${endDate}`,
        {
          method: 'GET',
          headers: getAuthHeader(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch analytics for date range');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Fetch analytics by date range failed: ${error.message}`);
      }
      throw new Error('An unexpected error occurred while fetching analytics by date range');
    }
  }
}; 