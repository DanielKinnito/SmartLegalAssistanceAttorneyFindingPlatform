"use client";

import { useState, useEffect } from "react";
import { RequestCard } from "./request-card";

// Define request status types
type RequestStatus = "pending" | "accepted" | "declined";

interface BackendCaseRequest {
  id: string; // ID of the case request itself
  case: string; // This is the ID of the case
  attorney: string; // This is the ID of the attorney
  status: RequestStatus;
  response_message: string | null;
  requested_at: string;
  responded_at: string | null;
  caseDetails?: {
    caseType: string;
    description: string;
  };
  attorneyDetails?: {
    attorneyName: string;
    specialization: string;
    appointmentDate?: string;
  };
}

interface CaseDetails {
  id: string;
  title: string; // Map to caseType
  description: string;
  document: string;
  is_probono: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

// *** UPDATED AttorneyDetailsResponse INTERFACE ***
interface AttorneyDetailsResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image: string;
  attorney: {
    id: string;
    starting_price: number | null;
    is_available: boolean;
    offers_probono: boolean;
    address: string;
    rating: number;
    profile_completion: number;
    license_document: string;
    is_approved: boolean;
    expertise: string[]; // This is what we'll use for specialization
    education: Array<{
      id: string;
      institution: string;
      degree: string;
      year: number;
    }>;
    experience: Array<{
      id: string;
      organization: string;
      title: string;
      years: number;
    }>;
  };
}

interface LegalRequest {
  id: string;
  attorneyName: string;
  specialization: string;
  caseType: string;
  description: string;
  requestedDate: string;
  status: RequestStatus;
  appointmentDate?: string;
  completedDate?: string;
  declineReason?: string;
}

export default function LegalRequestsClient() {
  const [activeTab, setActiveTab] = useState<"all" | RequestStatus>("all");
  const [requests, setRequests] = useState<LegalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "https://main-backend-aan1.onrender.com";

  useEffect(() => {
    const fetchAllRequestsAndDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const authToken = localStorage.getItem("access_token");

        if (!authToken) {
          setError(
            "You are not logged in. Please log in to view your requests."
          );
          setLoading(false);
          return;
        }

        // 1. Fetch initial case requests
        const caseRequestsResponse = await fetch(
          `${BASE_URL}/api/case-requests`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!caseRequestsResponse.ok) {
          if (
            caseRequestsResponse.status === 401 ||
            caseRequestsResponse.status === 403
          ) {
            setError(
              "Your session has expired or you are not authorized. Please log in again."
            );
          } else {
            throw new Error(
              `HTTP error! status: ${caseRequestsResponse.status}`
            );
          }
        }

        const jsonCaseRequests = await caseRequestsResponse.json();

        if (!jsonCaseRequests.success) {
          throw new Error(
            jsonCaseRequests.message || "Failed to retrieve case requests."
          );
        }

        const backendCaseRequests: BackendCaseRequest[] = jsonCaseRequests.data;

        // 2. Prepare for concurrent fetches of case and attorney details
        const caseDetailsPromises: Promise<CaseDetails>[] = [];
        // *** ATTORNEY PROMISE TYPE CHANGED ***
        const attorneyDetailsPromises: Promise<AttorneyDetailsResponse>[] = [];

        // To avoid redundant fetches for the same case/attorney ID
        const fetchedCaseIds = new Set<string>();
        const fetchedAttorneyIds = new Set<string>();

        backendCaseRequests.forEach((bRequest) => {
          if (bRequest.case && !fetchedCaseIds.has(bRequest.case)) {
            caseDetailsPromises.push(
              fetch(`${BASE_URL}/api/cases/${bRequest.case}`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }).then((res) => {
                if (!res.ok)
                  throw new Error(`Failed to fetch case ${bRequest.case}`);
                return res.json().then((data) => data.data as CaseDetails);
              })
            );
            fetchedCaseIds.add(bRequest.case);
          }

          if (bRequest.attorney && !fetchedAttorneyIds.has(bRequest.attorney)) {
            // *** UPDATED ATTORNEY ENDPOINT URL ***
            attorneyDetailsPromises.push(
              fetch(`${BASE_URL}/api/attorney/available/${bRequest.attorney}`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }).then((res) => {
                if (!res.ok)
                  throw new Error(
                    `Failed to fetch attorney ${bRequest.attorney}`
                  );
                // *** NO .data NESTING HERE FOR ATTORNEY DETAILS AS PER YOUR EXAMPLE ***
                return res.json() as Promise<AttorneyDetailsResponse>;
              })
            );
            fetchedAttorneyIds.add(bRequest.attorney);
          }
        });

        // 3. Wait for all detail fetches to complete
        const caseDetailsResponses = await Promise.allSettled(
          caseDetailsPromises
        );
        const attorneyDetailsResponses = await Promise.allSettled(
          attorneyDetailsPromises
        );

        // Map IDs to their fetched details for easy lookup
        const caseDetailsMap = new Map<string, CaseDetails>();
        caseDetailsResponses.forEach((result) => {
          if (result.status === "fulfilled") {
            caseDetailsMap.set(result.value.id, result.value);
          } else {
            console.warn("Failed to fetch case details:", result.reason);
          }
        });

        // *** UPDATED ATTORNEY DETAILS MAP ***
        const attorneyDetailsMap = new Map<string, AttorneyDetailsResponse>();
        attorneyDetailsResponses.forEach((result) => {
          if (result.status === "fulfilled") {
            attorneyDetailsMap.set(result.value.id, result.value);
          } else {
            console.warn("Failed to fetch attorney details:", result.reason);
          }
        });

        // 4. Map and combine data
        const mappedRequests: LegalRequest[] = backendCaseRequests.map(
          (bRequest) => {
            const caseDetail = caseDetailsMap.get(bRequest.case);
            const attorneyDetail = attorneyDetailsMap.get(bRequest.attorney);

            // Default values if details aren't found or still loading
            // *** EXTRACTING ATTORNEY NAME AND SPECIALIZATION FROM NEW STRUCTURE ***
            const attorneyName = attorneyDetail
              ? `${attorneyDetail.first_name} ${attorneyDetail.last_name}`
              : "Unknown Attorney";
            const specialization =
              attorneyDetail?.attorney?.expertise?.join(", ") ||
              "Unknown Specialization"; // Join expertise array into a string

            const caseType = caseDetail?.title || "Unknown Case Type";
            const description = caseDetail?.description || "No description";

            const requestedDate = new Date(
              bRequest.requested_at
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            let appointmentDate: string | undefined;
            if (bRequest.status === "accepted" && bRequest.responded_at) {
              const date = new Date(bRequest.responded_at);
              appointmentDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
              if (date.getHours() !== 0 || date.getMinutes() !== 0) {
                appointmentDate += ` at ${date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}`;
              }
            }

            let declineReason: string | undefined;
            if (bRequest.status === "declined" && bRequest.response_message) {
              declineReason = bRequest.response_message;
            }

            return {
              id: bRequest.id,
              attorneyName: attorneyName,
              specialization: specialization,
              caseType: caseType,
              description: description,
              requestedDate: requestedDate,
              status: bRequest.status,
              appointmentDate: appointmentDate,
              declineReason: declineReason,
            };
          }
        );

        setRequests(mappedRequests);
      } catch (e: any) {
        console.error("Failed to fetch legal requests:", e);
        setError("Failed to load legal requests. " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRequestsAndDetails();
  }, []); // Empty dependency array means this runs once on mount

  const filteredRequests =
    activeTab === "all"
      ? requests
      : requests.filter((request) => request.status === activeTab);

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-[#e4e4e7] mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 border-b-2 ${
              activeTab === "all"
                ? "border-[#1e2e45] font-medium text-[#1e2e45]"
                : "border-transparent text-[#71717a] hover:text-[#1e2e45]"
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 border-b-2 ${
              activeTab === "pending"
                ? "border-[#1e2e45] font-medium text-[#1e2e45]"
                : "border-transparent text-[#71717a] hover:text-[#1e2e45]"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`px-4 py-2 border-b-2 ${
              activeTab === "accepted"
                ? "border-[#1e2e45] font-medium text-[#1e2e45]"
                : "border-transparent text-[#71717a] hover:text-[#1e2e45]"
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setActiveTab("declined")}
            className={`px-4 py-2 border-b-2 ${
              activeTab === "declined"
                ? "border-[#1e2e45] font-medium text-[#1e2e45]"
                : "border-transparent text-[#71717a] hover:text-[#1e2e45]"
            }`}
          >
            Declined
          </button>
        </nav>
      </div>

      {/* Loading, Error, and Request Cards */}
      {loading ? (
        <div className="text-center py-10 text-[#71717a]">
          Loading requests...
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-10 text-[#71717a]">
          No requests found in this category.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </>
  );
}