"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Typography, Collapse, IconButton, Chip } from "@mui/material";
import { AccessTime, ExpandMore, ExpandLess } from "@mui/icons-material";
import {
  fetchLegalRequests,
  acceptLegalRequest,
  declineLegalRequest,
  LegalRequest,
  fetchCaseById,
  Case,
} from "@/app/services/LegalRequests_api";

declare global {
  interface Window {
    Calendly: any;
  }
}

// Type for RequestCard props
type RequestCardProps = {
  request: LegalRequest;
  caseData: Case | null;
  onAccept: (id: string) => Promise<void>;
  onDecline: (id: string) => Promise<void>;
};

const RequestCard: React.FC<RequestCardProps> = ({ request, caseData, onAccept, onDecline }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleAction = async (action: (id: string) => Promise<void>) => {
    try {
      setIsLoading(true);
      await action(request.id);
    } catch (error: unknown) {
      console.error("Error performing action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string): "warning" | "success" | "error" | "default" => {
    switch (status) {
      case "pending":
        return "warning";
      case "accepted":
        return "success";
      case "declined":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <div className="p-4 rounded-lg mb-4 bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div>
            <Chip
            label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            size="small"
            color={getStatusColor(request.status)}
            sx={{ height: "20px", fontSize: "0.75rem" }}
          />
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {caseData ? caseData.title : `Case #${request.case.slice(0, 8)}`}
              </span>
            </div>
            <div className="text-gray-500 text-sm mt-1 flex items-center gap-1">
              <AccessTime fontSize="small" />
              <span>Requested: {new Date(request.requested_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <IconButton
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          size="small"
        >
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>

    <Collapse in={isExpanded}>
  <div className="mt-4 space-y-4">
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="grid grid-cols-1 gap-4 text-sm">
        {caseData && (
          <>
            <div>
              <Typography variant="subtitle2" className="text-gray-500">
                Case Title
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {caseData.title}
              </Typography>
            </div>
            <div>
              <Typography variant="subtitle2" className="text-gray-500">
                Description
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {caseData.description}
              </Typography>
            </div>
            <div>
              <Typography variant="subtitle2" className="text-gray-500">
                Pro Bono
              </Typography>
              <Typography variant="body2" className="text-gray-700">
                {caseData.is_probono ? "Yes" : "No"}
              </Typography>
            </div>
          </>
        )}
        <div>
          <Typography variant="subtitle2" className="text-gray-500">
            Requested At
          </Typography>
          <Typography variant="body2" className="text-gray-700">
            {new Date(request.requested_at).toLocaleString()}
          </Typography>
        </div>
        {request.responded_at && (
          <div>
            <Typography variant="subtitle2" className="text-gray-500">
              Responded At
            </Typography>
            <Typography variant="body2" className="text-gray-700">
              {new Date(request.responded_at).toLocaleString()}
            </Typography>
          </div>
        )}
        {request.response_message && (
          <div>
            <Typography variant="subtitle2" className="text-gray-500">
              Response Message
            </Typography>
            <Typography variant="body2" className="text-gray-700">
              {request.response_message}
            </Typography>
          </div>
        )}
        <div>
          <Typography variant="subtitle2" className="text-gray-500">
            Status
          </Typography>
          
        </div>
      </div>
    </div>
  </div>
</Collapse>

      {request.status === "pending" && (
        <div className="mt-4 flex gap-2" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
          <Button
            variant="contained"
            onClick={() => handleAction(onAccept)}
            disabled={isLoading}
            sx={{
              backgroundColor: "#1E2E45",
              "&:hover": { backgroundColor: "#16233B" },
              fontSize: "0.75rem",
              px: 1.5,
              py: 0.5,
              minHeight: "auto",
              lineHeight: 1.2,
            }}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : "Accept"}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleAction(onDecline)}
            disabled={isLoading}
            sx={{
              backgroundColor: "red",
              "&:hover": { backgroundColor: "darkred" },
              fontSize: "0.75rem",
              px: 1.5,
              py: 0.5,
              minHeight: "auto",
              lineHeight: 1.2,
            }}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : "Decline"}
          </Button>
        </div>
      )}
    </div>
  );
};

const Home: React.FC = () => {
  const [recentRequests, setRecentRequests] = useState<LegalRequest[]>([]);
  const [lateRequests, setLateRequests] = useState<LegalRequest[]>([]);
  const [caseDataMap, setCaseDataMap] = useState<{ [key: string]: Case | null }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequestsAndCases = async () => {
    try {
      setLoading(true);
      // Fetch legal requests
      const requestsResponse = await fetchLegalRequests();
      if (!requestsResponse.success) {
        throw new Error(requestsResponse.message || "Failed to fetch requests");
      }
      const legalRequests = requestsResponse.data;

      // Fetch case details for each request
      const casePromises = legalRequests.map((request: LegalRequest) =>
        fetchCaseById(request.case).catch((error: unknown) => {
          console.error(`Failed to fetch case ${request.case}:`, error);
          return { success: false, data: null, message: error instanceof Error ? error.message : "Unknown error" };
        })
      );
      const caseResponses = await Promise.all(casePromises);

      // Map case data by case ID
      const caseMap: { [key: string]: Case | null } = {};
      legalRequests.forEach((request: LegalRequest, index: number) => {
        const response = caseResponses[index];
        caseMap[request.case] = response.success ? response.data : null;
      });
      setCaseDataMap(caseMap);

      // Categorize requests by age
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recent: LegalRequest[] = [];
      const late: LegalRequest[] = [];
      legalRequests.forEach((request: LegalRequest) => {
        const requestedAt = new Date(request.requested_at);
        if (requestedAt >= sevenDaysAgo) {
          recent.push(request);
        } else {
          late.push(request);
        }
      });
      setRecentRequests(recent);
      setLateRequests(late);
      setError(null);
    } catch (err: unknown) {
      console.error("Error loading requests and cases:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequestsAndCases();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const response = await acceptLegalRequest(id);
      if (response.success) {
        await loadRequestsAndCases();
        setTimeout(() => {
          if (window.Calendly) {
            window.Calendly.initPopupWidget({
              url: "https://calendly.com/doi-amdissa-a2sv/30min",
            });
          }
        }, 500);
      } else {
        throw new Error(response.message || "Failed to accept request");
      }
    } catch (error: unknown) {
      console.error("Error accepting request:", error);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const response = await declineLegalRequest(id);
      if (response.success) {
        await loadRequestsAndCases();
      } else {
        throw new Error(response.message || "Failed to decline request");
      }
    } catch (error: unknown) {
      console.error("Error declining request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress sx={{ color: "#1E2E45" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Recent Requests */}
      <div className="w-full md:w-1/2">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Recent Requests</h1>
        {recentRequests.length === 0 ? (
          <Typography>No recent requests available.</Typography>
        ) : (
          recentRequests.map((request: LegalRequest) => (
            <RequestCard
              key={request.id}
              request={request}
              caseData={caseDataMap[request.case]}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))
        )}
      </div>

      {/* Late Requests */}
      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Late Requests</h2>
        {lateRequests.length === 0 ? (
          <Typography>No late requests available.</Typography>
        ) : (
          lateRequests.map((request: LegalRequest) => (
            <RequestCard
              key={request.id}
              request={request}
              caseData={caseDataMap[request.case]}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;