"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Button, CircularProgress, Typography, Collapse, IconButton, Chip } from "@mui/material"
import { AccessTime, ExpandMore, ExpandLess } from "@mui/icons-material"
import {
  fetchLegalRequests,
  acceptLegalRequest,
  declineLegalRequest,
  type LegalRequest,
  fetchCaseById,
  type Case,
} from "@/app/services/LegalRequests_api"

declare global {
  interface Window {
    Calendly: any
  }
}

// Type for RequestCard props
type RequestCardProps = {
  request: LegalRequest
  caseData: Case | null
  onAccept: (id: string) => Promise<void>
  onDecline: (id: string) => Promise<void>
  onRemove?: (id: string) => void
}

const RequestCard: React.FC<RequestCardProps> = ({ request, caseData, onAccept, onDecline, onRemove }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const handleAction = async (action: (id: string) => Promise<void>) => {
    try {
      setIsLoading(true)
      await action(request.id)
    } catch (error) {
      console.error("Error performing action:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string): "warning" | "success" | "error" | "default" => {
    switch (status) {
      case "pending":
        return "warning"
      case "accepted":
        return "success"
      case "declined":
        return "error"
      default:
        return "default"
    }
  }

  return (
    <div className="p-4 rounded-lg mb-3 bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
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
                {caseData
                  ? `${caseData.title} by ${caseData.user.first_name} ${caseData.user.last_name}`
                  : `Case #${request.id.slice(0, 8)}`}
              </span>
            </div>
            <div className="text-gray-700 text-sm mt-1 flex items-center gap-1">
              <AccessTime fontSize="small" />
              <span>Created: {new Date(request.requested_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <IconButton
          onClick={(e: any) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          size="small"
        >
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>

      <Collapse in={isExpanded}>
        <div className="mt-2 space-y-2">
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="grid grid-cols-1 gap-3 text-sm">
              {caseData && (
                <>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Case Title
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333333" }}>
                      {caseData.title}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Client
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333333" }}>
                      {caseData.user.first_name} {caseData.user.last_name}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Description
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333333" }}>
                      {caseData.description}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Pro Bono
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333333" }}>
                      {caseData.is_probono ? "Yes" : "No"}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="text-gray-600">
                      Document
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#333333" }}>
                      <a
                        href={caseData.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Document
                      </a>
                    </Typography>
                    <div className="mt-2">
                      <iframe
                        src={caseData.document}
                        title="Case Document Preview"
                        className="w-full h-64 rounded border border-gray-300"
                        style={{ maxWidth: "100%", border: "1px solid #ccc" }}
                      ></iframe>
                      <Typography variant="caption" sx={{ color: "#666666", mt: 1, display: "block" }}>
                        Note: If the document does not load, please use the link above to view it.
                      </Typography>
                    </div>
                  </div>
                </>
              )}
              <div>
                <Typography variant="subtitle2" className="text-gray-600">
                  Requested At
                </Typography>
                <Typography variant="body2" sx={{ color: "#333333" }}>
                  {new Date(request.requested_at).toLocaleString()}
                </Typography>
              </div>
              {request.responded_at && (
                <div>
                  <Typography variant="subtitle2" className="text-gray-600">
                    Responded At
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#333333" }}>
                    {new Date(request.responded_at).toLocaleString()}
                  </Typography>
                </div>
              )}
              {request.response_message && (
                <div>
                  <Typography variant="subtitle2" className="text-gray-600">
                    Response Message
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#333333" }}>
                    {request.response_message}
                  </Typography>
                </div>
              )}
              <div>
                <Typography variant="subtitle2" className="text-gray-600">
                  Status
                </Typography>
                <Typography variant="body2" sx={{ color: "#333333" }}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Collapse>
      {(request.status === "accepted" || request.status === "declined") && (
        <div className="mt-3 flex gap-2" onClick={(e: any) => e.stopPropagation()}>
          <Button
            variant="outlined"
            onClick={() => onRemove && onRemove(request.id)}
            disabled={isLoading}
            sx={{
              borderColor: "#666",
              color: "#666",
              "&:hover": { borderColor: "#333", color: "#333", backgroundColor: "#f5f5f5" },
              fontSize: "0.75rem",
              px: 1.5,
              py: 0.5,
              minHeight: "auto",
              lineHeight: 1.2,
            }}
          >
            Remove
          </Button>
        </div>
      )}

      {request.status === "pending" && (
        <div className="mt-3 flex gap-2" onClick={(e: any) => e.stopPropagation()}>
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
  )
}

const Home: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<LegalRequest[]>([])
  const [acceptedRequests, setAcceptedRequests] = useState<LegalRequest[]>([])
  const [declinedRequests, setDeclinedRequests] = useState<LegalRequest[]>([])
  const [caseDataMap, setCaseDataMap] = useState<{ [key: string]: Case | null }>({})
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadRequestsAndCases = async () => {
    try {
      setLoading(true)
      // Fetch legal requests
      const requestsResponse = await fetchLegalRequests()
      if (!requestsResponse.success) {
        throw new Error(requestsResponse.message || "Failed to fetch requests")
      }
      const legalRequests = requestsResponse.data

      // Fetch case details for each request
      const casePromises = legalRequests.map((request: LegalRequest) =>
        fetchCaseById(request.case).catch((error: unknown) => {
          console.error(`Failed to fetch case ${request.case}:`, error)
          return { success: false, data: null, message: error instanceof Error ? error.message : "Unknown error" }
        }),
      )
      const caseResponses = await Promise.all(casePromises)

      // Map case data by case ID
      const caseMap: { [key: string]: Case | null } = {}
      legalRequests.forEach((request: LegalRequest, index: number) => {
        const response = caseResponses[index]
        caseMap[request.case] = response.success ? response.data : null
      })
      setCaseDataMap(caseMap)

      // Categorize requests by status
      const pending: LegalRequest[] = []
      const accepted: LegalRequest[] = []
      const declined: LegalRequest[] = []

      legalRequests.forEach((request: LegalRequest) => {
        switch (request.status) {
          case "pending":
            pending.push(request)
            break
          case "accepted":
            accepted.push(request)
            break
          case "declined":
            declined.push(request)
            break
          default:
            // Handle any other status by adding to pending
            pending.push(request)
        }
      })

      // Sort each category by requested_at date (newest first)
      const sortByDate = (a: LegalRequest, b: LegalRequest) =>
        new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()

      setPendingRequests(pending.sort(sortByDate))
      setAcceptedRequests(accepted.sort(sortByDate))
      setDeclinedRequests(declined.sort(sortByDate))
      setError(null)
    } catch (err: unknown) {
      console.error("Error loading requests and cases:", err)
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequestsAndCases()
  }, [])

  const handleAccept = async (id: string) => {
    try {
      const response = await acceptLegalRequest(id)
      if (response.success) {
        await loadRequestsAndCases()
        setTimeout(() => {
          if (window.Calendly) {
            window.Calendly.initPopupWidget({
              url: "https://calendly.com/doi-amdissa-a2sv/30min",
            })
          }
        }, 500)
      } else {
        throw new Error(response.message || "Failed to accept request")
      }
    } catch (error: unknown) {
      console.error("Error accepting request:", error)
    }
  }

  const handleDecline = async (id: string) => {
    try {
      const response = await declineLegalRequest(id)
      if (response.success) {
        await loadRequestsAndCases()
      } else {
        throw new Error(response.message || "Failed to decline request")
      }
    } catch (error: unknown) {
      console.error("Error declining request:", error)
    }
  }

  const handleRemove = (id: string) => {
    // Remove from pending requests
    setPendingRequests((prev) => prev.filter((request) => request.id !== id))
    // Remove from accepted requests
    setAcceptedRequests((prev) => prev.filter((request) => request.id !== id))
    // Remove from declined requests
    setDeclinedRequests((prev) => prev.filter((request) => request.id !== id))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress sx={{ color: "#1E2E45" }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Typography color="error">{error}</Typography>
      </div>
    )
  }

  return (
    <div className="px-6 py-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Legal Requests Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: "bold" }} />
            <span className="text-lg font-semibold text-gray-800">({pendingRequests.length})</span>
          </div>
          {pendingRequests.length === 0 ? (
            <Typography className="text-gray-600">No pending requests.</Typography>
          ) : (
            pendingRequests.map((request: LegalRequest) => (
              <RequestCard
                key={request.id}
                request={request}
                caseData={caseDataMap[request.case]}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>

        {/* Accepted Requests */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Chip label="Accepted" color="success" size="small" sx={{ fontWeight: "bold" }} />
            <span className="text-lg font-semibold text-gray-800">({acceptedRequests.length})</span>
          </div>
          {acceptedRequests.length === 0 ? (
            <Typography className="text-gray-600">No accepted requests.</Typography>
          ) : (
            acceptedRequests.map((request: LegalRequest) => (
              <RequestCard
                key={request.id}
                request={request}
                caseData={caseDataMap[request.case]}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>

        {/* Declined Requests */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Chip label="Declined" color="error" size="small" sx={{ fontWeight: "bold" }} />
            <span className="text-lg font-semibold text-gray-800">({declinedRequests.length})</span>
          </div>
          {declinedRequests.length === 0 ? (
            <Typography className="text-gray-600">No declined requests.</Typography>
          ) : (
            declinedRequests.map((request: LegalRequest) => (
              <RequestCard
                key={request.id}
                request={request}
                caseData={caseDataMap[request.case]}
                onAccept={handleAccept}
                onDecline={handleDecline}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
